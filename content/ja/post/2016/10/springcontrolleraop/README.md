---
title: "SpringのControllerメソッド実行時にAOPでログ出力する"
createdAt: 2016-10-16T23:29:00.001+09:00
tags: ["AOP","Spring Boot"]
---
APIだとAOPでロギングするのは割と簡単だが、画面の場合にうまいやり方が見つからず試行錯誤したのでメモ。

```java
@Pointcut("@annotation(org.springframework.web.bind.annotation.RequestMapping)")
```

などを使えばリクエストの前後に処理を挟むことは簡単。
APIの場合は、バリデーションエラーや例外に対して共通的な処理を入れることは容易いが、画面の場合、バリデーションエラーが発生したら共通エラー画面ではなく元の画面を表示したいし、例外に対しても同じ。
例外に関しては個別のControllerのメソッド内でtry-catchを入れてログ出力すればいいが、バリデーションエラーは画面に表示されるだけでログに出力する方法がわかっていなかった。

<!--more-->

### 基本形

まず、ControllerのRequestMappingが付与されたメソッドの実行前後に処理を挟む、というのは以下のようなComponentを用意すればいい。
`com.example.spring`は、このサンプルコードのパッケージ。

```java
@Component
@Aspect
@Slf4j
public class LogAdvice {
    @Pointcut("@within(org.springframework.stereotype.Controller)")
    public void controller() {
    }

    @Pointcut("@annotation(org.springframework.web.bind.annotation.RequestMapping)")
    public void requestMapping() {
    }

    @Pointcut("execution(* com.example.spring..*.*(..))")
    public void anyProjectMethodExecution() {
    }

    @Around("controller() && requestMapping() && anyProjectMethodExecution()")
    public Object log(ProceedingJoinPoint pjp) throws Throwable {
        log.info("before");
        Object retVal = pjp.proceed();
        log.info("after");
        return retVal;
    }
}
```

以降は、このlogの部分にいかにして有益な情報を詰め込むかの話。

### メソッド名

どのControllerのどのメソッドを実行したか、は ProceedingJoinPoint から取得できる。

```java
Signature sig = pjp.getSignature();
// FooController#index のようにControllerクラス名とメソッド名を取得
sig.getDeclaringType().getSimpleName() + "#" + sig.getName()
```

### 未処理の例外

try-catchを入れておけば、Controllerがそのままスローした例外は取れる。

```java
try {
    Object retVal = pjp.proceed();
    log.info(...);
    return retVal;
} catch (Throwable t) {
    log.info(...);
    throw t;
}
```

### バリデーションエラー

バリデーションエラーの情報は、以下のようなメソッドの定義であればメソッドの引数の BindingResult から取得できる。

```java
@RequestMapping("/projects/create")
public String create(@Validated ProjectCreateForm projectCreateForm, BindingResult bindingResult) {
```

ProceedingJoinPoint から引数を取得できるので、その中からBindingResultを取得すればいい。

```java
private BindingResult getBindingResult(ProceedingJoinPoint pjp) {
    for (Object arg : pjp.getArgs()) {
        if (arg != null && arg instanceof BindingResult) {
            return (BindingResult) arg;
        }
    }
    return null;
}
```

BindingResultが取れたら、それをシリアライズする。
GlobalErrorかFieldErrorかでメッセージの組み立て方は変える必要がある。

```java
@Autowired
private MessageSource messageSource;

private String getErrors(BindingResult bindingResult) {
    if (bindingResult != null && bindingResult.hasErrors()) {
        return bindingResult.getAllErrors().stream().map(map -> {
            if (map instanceof FieldError) {
                return ((FieldError) map).getField() + " " + map.getDefaultMessage();
            } else {
                return messageSource.getMessage(map, Locale.getDefault());
            }
        }).collect(Collectors.toList()).toString();
    } else {
        return "-";
    }
}
```

これらを用意した上で、以下のようにすれば...

```java
@Around("controller() && requestMapping() && anyProjectMethodExecution()")
public Object log(ProceedingJoinPoint pjp) throws Throwable {
    BindingResult bindingResult = getBindingResult(pjp);
    Object retVal = pjp.proceed();
    log.info("{}", getErrors(bindingResult));
```

例えば以下のような文字列が取得できる。

```
[name は入力必須です, パラメータfooを持つメッセージです]
```

ここで、１つ目のメッセージは以下のようなFormを使ったもの。

```java
@Data
public class ProjectCreateForm {
    @NotEmpty
    private String name;
}
```

NotEmptyのメッセージ定義。

```properties
org.hibernate.validator.constraints.NotEmpty.message=は入力必須です
```

２つ目のメッセージはBindingResultに対してパラメータつきのメッセージを設定したもの。

```java
bindingResult.reject("message.error.param", new Object[]{"foo"}, null);
```

```properties
message.error.param=パラメータ{0}を持つメッセージです
```

ここまで出力できていると、ユーザに見えているエラーが大体ログからわかるはず。

なお、BindingResultはProceedingJoinPointから取得しなくても、
AOPのPointcutで`args(*,bindingResult,..)`などとすれば取得できるがBindingResultがある場合の`@Around`、ない場合の`@Around`とパターンが増えていってしまうので、ここではメソッド内で引数を取得する方法を選んだ。

### catchしてしまった例外

「HTTP 500」のような共通のエラー画面に遷移するような状況を避けようと、Serviceがスローした例外全てをControllerの中でcatchしてしまい「システムエラー」などと表示していると、ログを見ても何が起きているのかわからない。

もちろん、個別に例外スタックトレースを出力したりしておけばいいのだが、Controller個別にこういう処理を書かなければならない、というルールだとどうしても抜け漏れが発生する。
ある程度共通化するにはどうするか。

まず、HttpServletRequestのattributeに例外を保存しておく簡単なComponentを用意しておく。

```java
@Component
public class LogHandler {
    public static String CAUGHT_ERROR_ATTRIBUTE_NAME = "error";

    @Autowired
    private HttpServletRequest request;

    public void handle(Throwable e) {
        request.setAttribute(CAUGHT_ERROR_ATTRIBUTE_NAME, e);
    }
}
```

そしてControllerの中ではcatchした例外を放り込む。

```java
@Autowired
private LogHandler logHandler;

@RequestMapping("/projects/create")
public String create(...) {
    try {
        projectService.create(projectCreateForm.getName());
    } catch (Exception e) {
        // bindingResult.reject()とかlog.warn()とかはここには書かない！
        logHandler.handle(e);
        // eをcatchせずAOPで処理できれば一番いいが、
        // そうするとAOP側ではこの戻り値が判別できない＝適切な画面に遷移させることができない。
        // なので個別にtry-catchしておく。
        return "...";
    }
    return "...";
}
```

そしてLogAdviceの中でこのattributeから例外を取得する。
BindingResultがあれば、「システムエラーが発生しました」のような汎用的なエラーメッセージはAOPで設定してしまうこともできる。

```java
@Autowired
private HttpServletRequest request;

private Throwable getCaughtError(BindingResult bindingResult) {
    Object attr = request.getAttribute(LogHandler.CAUGHT_ERROR_ATTRIBUTE_NAME);
    if (attr != null && attr instanceof Throwable) {
        bindingResult.reject("message.error");
        return (Throwable) attr;
    }
    return null;
}
```

### 一行で出力

あとはこれらを連結して一行で出力するように調整すればいいが、いろんなパターンがあるのでなるべく共通化して扱いたい。

```java
private void log(Object... params) {
    String serialized = Arrays.stream(params)
        .map(p -> p == null ? "-" : p.toString())
        .collect(Collectors.joining(" "));
    log.info("{}", serialized)
```

のようにすれば、BindingResultが引数にあるメソッドの場合はXXXを出力して、ない場合は「-」を出力、という感じでnullかどうかとかを気にせずとりあえず羅列して呼び出せる。

### 例外はスタックトレースを出力

さらに、最後に例外オブジェクトを渡した場合はスタックトレースを出力してくれるようにしたい。
これは最後の引数の型を調べればいい。

```java
private void log(Object... params) {
    if (params[params.length - 1] instanceof Throwable) {
        String serialized = Arrays.stream(params).limit(params.length - 1).map(p -> p == null ? "-" : p.toString()).collect(Collectors.joining(" "));
        log.warn("{}", serialized, params[params.length - 1]);
    } else {
        String serialized = Arrays.stream(params).map(p -> p == null ? "-" : p.toString()).collect(Collectors.joining(" "));
        log.info("{}", serialized);
    }
}
```

### 単体テスト

Spring Bootの[OutputCapture](http://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/OutputCapture.html)を使えば、ログ出力した文字列をテストで調べることができるので、例外情報をログ出力できているかなど、ある程度はテストできる。

[Spring Bootのドキュメントにも書かれている](http://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-testing.html#boot-features-output-capture-test-utility)が、OutputCaptureはJUnitのRuleとして使う。

```
@Rule
public OutputCapture capture = new OutputCapture();
```

MockMvcでリクエストして、captureした文字列を調べていけば大体のテストはできる。

```java
@Test
public void createWithValidationErrorAndException() throws Exception {
    try {
        mockMvc.perform(get("/projects/create/ex"))
            .andExpect(status().is5xxServerError());
        fail();
    } catch (Exception ignore) {
        assertThat(capture.toString(),
            stringContainsInOrder(Arrays.asList(
	            // 1行に期待した情報が含まれているか？
                "ProjectController#createWithException [name は入力必須です, パラメータfooを持つメッセージです] This is a test exception",
                // 例外スタックトレースを出力できているか？
                "java.lang.RuntimeException: This is a test exception")));
    }
}
```

---

今回の[ソースコードはこちら](https://github.com/ksoichiro/spring-boot-practice/tree/master/contents/20161016-logging)。

実際には、例えば以下のような情報も出力した方が良いかもしれない。
(時間があればサンプルを修正して加筆します)
 
- リクエストパラメータ
- ログインユーザ名
- ロール名
- アクセス元のIPアドレス
- 表示したビューの名前
- pjp.proceed() を実行するのにかかった時間

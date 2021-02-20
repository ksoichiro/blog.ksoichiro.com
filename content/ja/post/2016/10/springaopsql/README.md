---
title: "SpringのAOPでSQLエラーをハンドリングする"
created: 2016-10-30T22:19:00.001+09:00
tags: ["Spring Framework","AOP","Spring Boot"]
---
Spring BootでJDBCを使っていてSQLExceptionが発生した場合に、HibernateのSqlExceptionHelperが以下のようにERRORログを出力してしまう。

```
2016-10-30 13:56:45.772  WARN 40153 --- [nio-8080-exec-6] o.h.engine.jdbc.spi.SqlExceptionHelper   : SQL Error: 23502, SQLState: 23502
2016-10-30 13:56:45.772 ERROR 40153 --- [nio-8080-exec-6] o.h.engine.jdbc.spi.SqlExceptionHelper   : 列 "TEAM_ID" にはnull値が許されていません
NULL not allowed for column "TEAM_ID"; SQL statement:
insert into tag (id, created_at, updated_at, account_id, name, team_id) values (null, ?, ?, ?, ?, ?) [23502-190]
```

未知の例外に対してはこの挙動でも問題ないように思うが、例えばデッドロックが発生した時にはリトライしたいとか、自分でハンドリングしたいケースがあった場合には、本当に問題といえる状態だと判断ができるレイヤでERRORログを出力するように制御したい。

…ということで、このログ出力を回避して自分でハンドリングする方法について。
<!--more-->

SqlExceptionHelperのソースコードを見る限り、LoggerでERRORレベルを出力するようにしていたらログは出力されてしまう模様。
Spring Boot の [LevelRemappingAppender](https://github.com/spring-projects/spring-boot/blob/v1.3.2.RELEASE/spring-boot/src/main/java/org/springframework/boot/logging/logback/LevelRemappingAppender.java) を使ってこのクラスのERRORログをWARNレベルに変更してみる。

これには `src/main/resources/logback-spring.xml` を作って以下のように記述すればいい。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/base.xml" />

    <appender name="ERROR_LEVEL_REMAPPER" class="org.springframework.boot.logging.logback.LevelRemappingAppender">
        <remapLevels>ERROR->WARN</remapLevels>
    </appender>

    <logger name="org.hibernate.engine.jdbc.spi.SqlExceptionHelper" additivity="false">
        <appender-ref ref="ERROR_LEVEL_REMAPPER"/>
    </logger>
</configuration>
```

次に、SQLExceptionをキャッチして自分でハンドリングできる状態をつくる。
これにはAOPを使って `@Service` なクラスのメソッド実行を捉え、SQLExceptionをキャッチすればいい。…と思ったが、いくつか引っかかるポイントがあった。

以下のような形で、`@Service`が付与されたクラスのメソッドの実行に対して処理を挟めるようにする。

```java
@Component
@Aspect
public class ServiceAdvice {
    @Pointcut("@within(org.springframework.stereotype.Service)")
    public void service() {
    }

    @Around("service() && execution(* com.ksoichiro.task.service.*.*(..))")
    public Object execution(ProceedingJoinPoint pjp) throws Throwable {
        return pjp.proceed();
    }
}    
```

これを追加したところ、アプリが起動しなくなってしまった。
以下のように、DIに失敗してしまう。

```
Caused by: org.springframework.beans.factory.NoSuchBeanDefinitionException: No qualifying bean of type [com.ksoichiro.task.service.LoginService] found for dependency: expected at least 1 bean which qualifies as autowire candidate for this dependency. Dependency annotations: {@org.springframework.beans.factory.annotation.Autowired(required=true)}
```

AOPが適用されると、Proxyされたクラスを使うことになるため、Springがそれを認識できるようにするには以下のように proxy-target-class を設定する必要がある。

```yaml
spring:
    aop:
        proxy-target-class: true
```

これで起動はできるようになったので、`pjp.proceed()` がスローする SQLException をキャッチすれば良い…と思いきや、スローされているのはSpring Frameworkの別の例外。

```
org.springframework.dao.DataIntegrityViolationException: could not execute statement; SQL [n/a]; constraint [null]; nested exception is org.hibernate.exception.ConstraintViolationException: could not execute statement
...
```

メッセージの `nested exception is ...` というところからわかるが、ダイレクトにスローされているわけではなく [NestedRuntimeException](http://docs.spring.io/spring/docs/4.2.4.RELEASE/javadoc-api/org/springframework/core/NestedRuntimeException.html) を継承した例外クラスで、元の例外を内包した構造になっている。

そのため、単純に `catch (SQLException e)` としてもSQLExceptionを捉えることはできない。NestedRuntimeExceptionをキャッチして、SQLException を取り出す必要がある。

NestedRuntimeExceptionが特定の例外クラスを含んでいるかどうかは contains() で判定できるが、実際にそれを取得するメソッドまでは用意されていないようなので、getCause() で原因の例外を辿っていきながらSQLExceptionを取得するようにしてみる。

```java
@Around("service() && execution(* com.ksoichiro.task.service.*.*(..))")
public Object execution(ProceedingJoinPoint pjp) throws Throwable {
    try {
        return pjp.proceed();
    } catch (NestedRuntimeException e) {
        if (e.contains(SQLException.class)) {
            // 必要ならここで特定のエラーコードに対するハンドリングを行う。
            // ここでは警告ログを出力するのみ。
            log.warn("SQL Error: {}, SQLState: {}, message: {}", cause.getErrorCode(), cause.getSQLState(), cause.getMessage());
        }
        // ハンドリングを別の箇所で行うため、ここでは再びスローする。
        throw e;
    }
}

// NestedRuntimeExceptionから指定の例外を取り出す
@SuppressWarnings("unchecked")
<T> T getCause(NestedRuntimeException e, Class<T> exceptionClass) {
    Throwable cause = e.getCause();
    while (cause != null) {
        if (exceptionClass.isAssignableFrom(cause.getClass())) {
            break;
        }
        cause = cause.getCause();
    }
    return (T) cause;
}
```

これらによって、以下のようにHibernateのログをWARNレベルに抑えつつ自分で同じ情報を出力させることができた。
これだと元の動作と何も変わらないが、必要な情報が捉えられているので、あとは必要に応じてハンドリングを実装すればいい。

```
2016-10-30 22:10:33.854  WARN 51426 --- [nio-8080-exec-2] o.h.engine.jdbc.spi.SqlExceptionHelper   : SQL Error: 23505, SQLState: 23505
2016-10-30 22:10:33.854  WARN 51426 --- [nio-8080-exec-2] o.h.engine.jdbc.spi.SqlExceptionHelper   : ユニークインデックス、またはプライマリキー違反: "UQ_TAG_INDEX_1 ON PUBLIC.TAG(TEAM_ID, ACCOUNT_ID, NAME) VALUES (0, 1, 'test', 1)"
Unique index or primary key violation: "UQ_TAG_INDEX_1 ON PUBLIC.TAG(TEAM_ID, ACCOUNT_ID, NAME) VALUES (0, 1, 'test', 1)"; SQL statement:
insert into tag (id, created_at, updated_at, account_id, name, team_id) values (null, ?, ?, ?, ?, ?) [23505-190]
2016-10-30 22:10:33.861  WARN 51426 --- [nio-8080-exec-2] com.ksoichiro.task.aspect.ServiceAdvice  : SQL Error: 23505, SQLState: 23505, message: ユニークインデックス、またはプライマリキー違反: "UQ_TAG_INDEX_1 ON PUBLIC.TAG(TEAM_ID, ACCOUNT_ID, NAME) VALUES (0, 1, 'test', 1)"
Unique index or primary key violation: "UQ_TAG_INDEX_1 ON PUBLIC.TAG(TEAM_ID, ACCOUNT_ID, NAME) VALUES (0, 1, 'test', 1)"; SQL statement:
insert into tag (id, created_at, updated_at, account_id, name, team_id) values (null, ?, ?, ?, ?, ?) [23505-190]
```

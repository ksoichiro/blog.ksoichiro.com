---
title: "Thymeleafのlayoutを使う"
originalCreatedAt: 2015-04-14T01:09:00.001+09:00
tags: ["Spring Framework","Thymeleaf"]
---
Spring BootとThymeleafの組み合わせにおいて、`th:fragment`などの使い方は分かったが、共通のレイアウト（`<head>`なども含めて）を集約するにはどうすればいいのかわからなかった。
例によって[Sagan](https://github.com/spring-io/sagan)を見てみると、`layout:`というのを使っていた。
[Thymeleafの日本語ドキュメントのこのページ](http://www.thymeleaf.org/doc/tutorials/2.1/usingthymeleaf_ja.html)を見ていたら見つからなかったが、[こちら](http://www.thymeleaf.org/doc/articles/layouts.html)には書いてあった。
<!--more-->

これによると、Thymeleaf Layout Dialectを使えばいいらしい。

### Dependency

Dependencyとして
```
nz.net.ultraq.thymeleaf:thymeleaf-layout-dialect:1.2.1
```
が必要とのことだったが、Spring Bootだからもしかして・・・
```
./gradlew dependencies | grep thymeleaf
```
としてみると、やはり
```
+--- org.springframework.boot:spring-boot-starter-thymeleaf:1.2.3.RELEASE
|    +--- org.thymeleaf:thymeleaf-spring4:2.1.4.RELEASE
|    |    +--- org.thymeleaf:thymeleaf:2.1.4.RELEASE
|    \--- nz.net.ultraq.thymeleaf:thymeleaf-layout-dialect:1.2.7

```
というように、すでに含まれていた。なので、Spring Bootで`spring-boot-starter-thymeleaf`を使っているなら特に何もしなくて良い。

### LayoutDialect

次に、以下のようなコードを追加する必要があるとのことだったが
```java
@Bean
public SpringTemplateEngine templateEngine() {
    SpringTemplateEngine templateEngine = new SpringTemplateEngine();
    ...
    templateEngine.addDialect(new LayoutDialect());
    return templateEngine;
}
```
これは追加しなくて良いようだった。

### layout.html

共通レイアウトとして、今回は`templates/layout.html`を作成した。
XMLネームスペースとして`layout`を定義し、コンテンツを埋め込みたい部分のタグに`layout:fragment="fragment名"`を定義する。

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout">
:
    <title layout:title-pattern="$DECORATOR_TITLE - $CONTENT_TITLE">TODO</title>
:
<div layout:fragment="content">
    <p>Static content for prototyping purposes only</p>
</div>
:
</html>
```

`$DECORATOR_TITLE`は、layout.html側の`<title>`の値。
つまり上記では`TODO`となる。
`$CONTENT_TITLE`は、埋め込むページ側の`<title>`の値。

### 各ページ

埋め込む側のページでは、例えば以下のようにしてレイアウトを適用する。
`layout:decorator`の部分で、どのレイアウトを使うかを指定している。

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
      layout:decorator="layout">
<head>
    <title>Main</title>
</head>
<body>

<div layout:fragment="content">
(このページのコンテンツをここに定義)
</div>

</body>
</html>
```

### 結果

以上の記述で実行すると、以下のようにレイアウトが適用される。

```html
<!DOCTYPE html>
<html>
:
    <title>TODO - Main</title>
:
<div>
(このページのコンテンツをここに定義)
</div>
:
</html>
```

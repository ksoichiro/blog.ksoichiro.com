---
title: "Constructor Injectionに変えてみる"
created: 2017-01-05T23:23:00.001+09:00
tags: ["Spring Framework"]
---
[SpringでField InjectionよりConstructor Injectionが推奨される理由](http://pppurple.hatenablog.com/entry/2016/12/29/233141) を読んで、Springにおいて@Autowiredをフィールドに付与するField Injection、普通に使ってしまっているなぁ…と考えつつ、Constructor Injectionの方が確かに良さそうなので試してみた。これ自体は補足することはないが、Spring 4.2以前+Gradle+Querydslという点で少し躓いたのでメモ。

各種バージョンなどは以下のとおり。(いずれも少し古い)

- Spring Boot 1.3.2.RELEASE (Spring Framework 4.2.4.RELEASE)
- Gradle 2.11
- Lombok 1.16.2
- Querydsl 3.6.7

<!--more-->

### 書き換え

Lombokを使っているので`@RequiredArgsConstructor`を使った。
ここで問題となったのが`@__`の部分。
Querydslも使っているプロジェクトでは、Lombokが動く前にQuerydsl用のクラスの自動生成をAnnotation Processorで行うため、`@__` が解決できずコンパイルエラーになってしまう。

Gradleでの解決策が見つからなかったが、以下を発見。
https://github.com/ewerk/gradle-plugins/issues/59
LombokのProcessorを同時に指定してあげれば解決できるということ。

上記Issueに書かれているものを少し変えて、以下のような感じでprocessorを複数指定して無事解決。

```groovy
task generateQuerydsl(type: JavaCompile) {
    source = sourceSets.main.java
    classpath = configurations.compile + configurations.provided
    destinationDir = querydslDir
    options.compilerArgs += [
        '-proc:only',
        '-processor', [
            'com.mysema.query.apt.jpa.JPAAnnotationProcessor',
            'lombok.launch.AnnotationProcessorHider$AnnotationProcessor',
        ].join(',')
    ]
}
```

### Configurationへの対応

`@Configuration`に対して適用したところBean Creationが失敗。
[ドキュメント](https://docs.spring.io/spring/docs/current/spring-framework-reference/html/beans.html)を確認すると

- `@Configuration`ではCGLIBを利用する影響でデフォルトコンストラクタが必要(Spring 4.2まで)
- `@Component`にすればそうした制約はない

ということで、`@Configuration`を`@Component`に変えてみると確かに動く。

とはいえ動いたとしても`@Configuration`をやめるほどのメリットがわからなかったので現時点ではやめておく。

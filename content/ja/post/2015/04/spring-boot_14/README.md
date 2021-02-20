---
title: "Spring Bootで静的コンテンツにフィンガープリントをつける"
created: 2015-04-14T01:37:00.001+09:00
tags: ["Spring Framework","Spring Boot"]
---
Spring BootではRuby on Railsのアセットパイプラインのようなものをどうやって実現するのか？というのを調べていた。
Sprinb Bootのバージョンは1.2.3-RELEASE。

以下のSpringのブログによれば、静的コンテンツのハンドリングはSpring Framework 4.1で改善されたらしい。
[Spring Framework 4.1 - handling static web resources](https://spring.io/blog/2014/07/24/spring-framework-4-1-handling-static-web-resources)
<!--more-->

JavaScriptの開発については、grunt、gulp、Dart、TypeScriptなどネイティブのものを使ってくれ、とある。
確かに、こちらの進化の速度は速いので直接こういったツール等を使う方がいい。結合・圧縮はこちらでできる。

あとは、リソースにフィンガープリントをつける(app-ハッシュ値.cssなど)方法だが、これは"Resource versioning"と呼んでいる。
(知らなかったが、こういうのを"Cache busting"というらしい。)

[Showcase application](https://github.com/bclozel/spring-resource-handling)があるよ、と紹介されており、こちらを動かしてみれば期待しているものかわかりだったが、上手く動かず・・・。
見よう見まねで、作成中のサンプルアプリに組み込んでみた。

結論から言うと、以下のようなクラスを追加するだけだった。簡単。

```java
@Configuration
public class WebConfig extends WebMvcConfigurerAdapter {
    @Bean
    public ResourceUrlEncodingFilter resourceUrlEncodingFilter() {
        return new ResourceUrlEncodingFilter();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        VersionResourceResolver versionResolver = new VersionResourceResolver()
                .addContentVersionStrategy("/css/**", "/js/**");
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:static/")
                .setCachePeriod(null)
                .resourceChain(true)
                .addResolver(versionResolver);
    }
}
```

`addContentVersionStrategy()`で指定しているのが、バージョニングする対象のリソース。
`/css/**`と`/js/**`は、今回はここにリソースを配置していたというだけなので、適宜読み替えが必要。
また、上記では使っていなかったがライブラリのJavaScriptなどにバージョンをつける場合は`addFixedVersionStrategy()`を使えば、固定のバージョンをつけられるらしい。
上記Showcaseアプリでは`application.yml`に定義した値を読み込ませていた。
これはこれでいいが、バージョンの更新を忘れそう。
Gitのコミットハッシュ値を自動的につけられるなら利用したいが…これはまた別の機会に考えてみる。
(**2016/03追記**: ライブラリのバージョニングについてはこちら → [Spring BootでJavaScript/CSSライブラリにフィンガープリントをつける](/ja/post/2016/03/spring-bootjavascriptcss/))

`addResourceLocations()`がバージョニングしたファイルを配置する場所を指定する(と思われる)。
上記はバージョニングができることを確認したいだけだったのでごく簡潔な内容にとどめたが、実際にはアプリケーションのProfileによってキャッシュの設定を切り替えるのが良いようだ。
([Showcaseアプリを見るとわかる](https://github.com/bclozel/spring-resource-handling/blob/master/server/src/main/java/org/springframework/samples/resources/WebConfig.java#L87-L101))

`resourceUrlEncodingFilter()`については、ただnewしているだけだが、これがないとバージョニングが適用されなかった。

HTML側で、CSSやJSの指定の仕方が変わるかというと、そのままだった。
ShowcaseアプリはGroovyのテンプレートを使っておりThymeleafだとどう書くのだろうと考えてしまったが、通常通り`th:href="@{/css/main.css}"`などと書けば自動的に変換される。

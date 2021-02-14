---
title: "Spring BootでJavaScript/CSSライブラリにフィンガープリントをつける"
created: 2016-03-21T22:37:00.001+09:00
tags: ["Spring Framework","Git","Gradle","Spring Boot"]
---
もう1年近く経ってしまうが、[Spring Bootで静的コンテンツにフィンガープリントをつける](/ja/post/2015/04/spring-boot_14/) の続き。

以前は、プロジェクト内で書いたCSSやJavaScriptに対して、コンテンツを基にしたハッシュ値によるバージョニングについて確認したが、Bowerなどのライブラリに対してバージョニングする部分は

> これはこれでいいが、バージョンの更新を忘れそう。   
> Gitのコミットハッシュ値を自動的につけられるなら利用したいが…これはまた別の機会に考えてみる。

としたままだった。  

このままだと、ライブラリをアップデートしてもクライアント側のキャッシュが更新されず、更新が適用されない、というような問題が生じる。

しかしこれは今になってチャレンジしてみると意外に簡単にできた。
<!--more-->

---

前回のエントリに加えて必要なものは [gradle-build-info-plugin](https://github.com/ksoichiro/gradle-build-info-plugin)。
これを組み込むことで、手軽にgit.propertiesというファイルにGitコミットIDなどを埋め込むことができる。

### gradle-build-info-plugin 適用

以下のように`build.gradle`に追加する。

```groovy
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath 'org.springframework.boot:spring-boot-gradle-plugin:1.3.3.RELEASE'
        classpath 'com.github.ksoichiro:gradle-web-resource-plugin:1.7.0'
        // ↓追加
        classpath 'com.github.ksoichiro:gradle-build-info-plugin:0.1.5'
    }
}

apply plugin: 'spring-boot'
apply plugin: 'com.github.ksoichiro.web.resource'
// ↓追加
apply plugin: 'com.github.ksoichiro.build.info'

// ↓追加
buildInfo {
    gitPropertiesEnabled true
}
```

### プロパティ読み込みクラス追加

他にもやり方はいろいろあると思うが、例えばこんな感じでコミットIDを読み込めるようにする。

```java
@Component
@PropertySource("classpath:/git.properties")
public class GitProperties {
    @Autowired
    private Environment environment;

    public String getCommitId() {
        return environment.getProperty("git.commit.id");
    }
}
```

### バージョン設定

以前のエントリで作成したWebConfigクラスに先ほどのGitPropertiesクラスをDIして、それを`VersionResourceResolver#addFixedVersionStrategy()`に設定する。

ここでは静的リソースのインストール/ビルドなどは [gradle-web-resource-plugin](https://github.com/ksoichiro/gradle-web-resource-plugin) を使っている前提としているが、その場合、Bowerのライブラリは/libに配置される。

そのため`/lib/**`に対してGitコミットIDでバージョニングしてやれば、アプリリリース時に必ず更新されるようになる。

```java
@Configuration
public class WebConfig extends WebMvcConfigurerAdapter {
    // ↓追加
    @Autowired
    private GitProperties gitProperties;

    @Bean
    public ResourceUrlEncodingFilter resourceUrlEncodingFilter() {
        return new ResourceUrlEncodingFilter();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        VersionResourceResolver versionResolver = new VersionResourceResolver()
            .addContentVersionStrategy("/css/**", "/js/**")
            // ↓追加
            .addFixedVersionStrategy(gitProperties.getCommitId(), "/lib/**");
        registry.addResourceHandler("/**")
            .addResourceLocations("classpath:static/")
            .setCachePeriod(null)
            .resourceChain(true)
            .addResolver(versionResolver);
    }
}
```

### 結果

上記のような設定で動かしてみると、以下のような記述が

```html
<link rel="stylesheet" th:href="@{/css/app.css}"/>
<link rel="stylesheet" th:href="@{/lib/bootstrap/dist/css/bootstrap.min.css}"/>
```

次のように変換される。

```html
<link rel="stylesheet" href="/css/app-e7970393ed273fc19cc677a9ba21f6c8.css" />
<link rel="stylesheet" href="/fe9698a/lib/bootstrap/dist/css/bootstrap.min.css" />
```

`/css/app.css` に対してはコンテンツベースのバージョニングが適用され、`/lib/bootstrap/dist/css/bootstrap.min.css` に対しては固定バージョニングが適用されている。  
(`fe9698a`がコミットID)

Spring Bootで上記を試して一通り動かせるようにしてあるソースは[こちら](https://github.com/ksoichiro/spring-boot-practice/tree/9b726ab3ef30ea61720a5c32e3160ecea457cddd/20160321-fixed-version)。

### まとめ

- Spring Boot / Spring Framework では GitコミットIDを書き込んだファイルを含めておけばコミットを使ったバージョニングができるので、自分でバージョン番号などを管理しなくても、アプリをリリースするだけでキャッシュバスティングできる。
- gradle-web-resource-plugin と gradle-build-info-plugin を使えば簡単に適用できる。

(2016/03/23 追記)
今回の実装だと、パスのパターンが変わってしまうことにより認証対象外としたいリソースが認証対象になってしまう可能性がある。
これについては次のエントリ [Spring BootでJavaScript/CSSライブラリにフィンガープリントをつける (2)](/ja/post/2016/03/spring-bootjavascriptcss-2/) で補足。

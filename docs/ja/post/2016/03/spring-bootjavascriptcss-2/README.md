---
title: "Spring BootでJavaScript/CSSライブラリにフィンガープリントをつける (2)"
created: 2016-03-23T02:27:00.001+09:00
tags: ["Spring Framework","Spring Boot"]
---
[Spring Bootで静的コンテンツにフィンガープリントをつける](http://ksoichiro.blogspot.com/2015/04/spring-boot_14.html),
[Spring BootでJavaScript/CSSライブラリにフィンガープリントをつける](http://ksoichiro.blogspot.com/2016/03/spring-bootjavascriptcss.html)の続き。

前回の内容だと、外部ライブラリに対してGitコミットハッシュを固定のバージョンとして付与できるが、これだと例えば`/lib/`というリソースに対して`/バージョン/lib/`というパスが生成される。

この場合、`/lib/**`は認証対象外、というようなSpring Securityの設定をしているケースではバージョン付与後のパスが認証対象となってしまい、ログイン画面でリソースが読み込めない状態になってしまう。
このエントリでは、これに対処する方法について説明する。
<!--more-->

### 分析

このパターンに対処するには、前回のエントリで使った `addFixedVersionStrategy()` の実装を追っていくと答えが見えてくる。

`addFixedVersionStrategy()`の内部では`addVersionStrategy()`を呼び出しており、そこでは`FixedVersionStrategy`と`PrefixVersionPathStrategy`というクラスが使われている。
これらを置き換えるような独自のストラテジを設定すればよさそう。

`FixedVersionStrategy`は、バージョンの識別に、コンストラクタで与えられたバージョンを固定値として使う、というストラテジ。
さらに、具体的なパスの中にバージョンを埋め込んだり抽出したりするロジックは`PrefixVersionPathStrategy`に委ねられている。

`PrefixVersionPathStrategy`は、与えられたバージョンをprefixとしてパスの先頭につけるというストラテジ。

### 実装

まず`FixedVersionStrategy`の代替として  
`PrefixAndFixedVersionStrategy`というものを作る。

これは、`FixedVersionStrategy`がパラメータとしてバージョンだけを受け取っていたのに対して、先頭につける文字列も与えられるようにするもの。

こんな感じ。

```java
public class PrefixAndFixedVersionStrategy extends AbstractVersionStrategy {
    private final String version;

    public PrefixAndFixedVersionStrategy(String prefix, String version) {
        super(new MiddleVersionPathStrategy(prefix, version));
        this.version = version;
    }

    @Override
    public String getResourceVersion(Resource resource) {
        return this.version;
    }
}
```

上記のコンストラクタでsuper()に渡しているのは、  
パスをハンドリングするストラテジ(VersionPathStrategy)のインスタンスで、`PrefixVersionPathStrategy`の代替となるもので、この後で実装する。
パスのハンドリングについて`MiddleVersionPathStrategy`を使い、これに対してprefixを渡せる、というのが`FixedVersionStrategy`との違い。

次に、VersionPathStrategyの実装として`MiddleVersionPathStrategy`と名付けたクラスを以下のように実装する。

```java
public class MiddleVersionPathStrategy implements VersionPathStrategy {
    private final String prefix;
    private final String version;

    public MiddleVersionPathStrategy(String prefix, String version) {
        this.prefix = prefix;
        this.version = version;
    }

    @Override
    public String extractVersion(String requestPath) {
        if (requestPath.startsWith(this.prefix)) {
            String prefixRemoved = requestPath.substring(this.prefix.length());
            if (prefixRemoved.startsWith(this.version)) {
                return this.version;
            }
        }
        return null;
    }

    @Override
    public String removeVersion(String requestPath, String version) {
        // addVersion()にてprefixを一度取り払ってから
        // prefixとバージョンを付与しているので、
        // ここでは逆にprefixとバージョンを取り払ってprefixを付け直す
        return this.prefix + requestPath.substring(this.prefix.length() + this.version.length());
    }

    @Override
    public String addVersion(String path, String version) {
        // この分岐の必要性はわかっていない...
        // PrefixVersionPathStrategyの実装のまま
        if (path.startsWith(".")) {
            return path;
        } else {
            // "/"を先に除去しておく
            String p = path;
            if (p.startsWith("/")) {
                p = p.substring(1);
            }
            // 指定のprefixが付いているパスにのみバージョン付与可能とし
            // その他はバージョン付与せずにそのまま返す
            if (p.startsWith(this.prefix)) {
                return this.prefix + this.version + "/" + p.substring(this.prefix.length());
            } else {
                return path;
            }
        }
    }
}
```

PrefixVersionPathStrategyを参考に、とりあえず動くようにした実装なので、改善の余地ありという感じではあるけれど・・

最後に、WebConfigでは

```java
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    VersionResourceResolver versionResolver = new VersionResourceResolver()
        .addContentVersionStrategy("/css/**", "/js/**")
        .addVersionStrategy(new PrefixAndFixedVersionStrategy("lib/", gitProperties.getCommitId()), "/lib/**");
```
 
 というように、今回作成した`PrefixAndFixedVersionStrategy`を指定して`addVersionStrategy()`を呼び出すようにする(上記の最後の行)。
 
これで`/lib/9b726ab/bootstrap/dist/css/bootstrap.min.css`のようなパスが生成できるようになる。

今回更新した結果のソースコード一式は[こちら](https://github.com/ksoichiro/spring-boot-practice/tree/1c924f9e0c7000d19fc01e64ad140637a35ec873/20160321-fixed-version)。

(2016/03/26 追記)  
上記のコードでは、バージョンを削除したパスを作る部分(removeVersion())に問題があった。  
bootRunで実行するときにはうまくいったが、java -jarで実行するときに、区切り文字(/)が重なっている部分がありバージョンを除去できない。

`/lib/1c924f9/bootstrap/dist/css/bootstrap.min.css`を  
`/lib/bootstrap/dist/css/bootstrap.min.css`としたいが  
`/lib//bootstrap/dist/css/bootstrap.min.css`となっていた。

removeVersion()の中身の

```java
return this.prefix + requestPath.substring(this.prefix.length() + this.version.length());
```

の部分は

```java
return this.prefix + requestPath.substring((this.prefix + this.version + "/").length());
```

とする必要がある。
修正したコードは[こちら](https://github.com/ksoichiro/spring-boot-practice/tree/098c25735ca532452b2c92f2ac909b5c90b0ca4d/20160321-fixed-version)。

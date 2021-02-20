---
title: "Spring BootのプロファイルにGitコミットハッシュ値を含める"
originalCreatedAt: 2015-12-11T00:39:00.001+09:00
tags: ["Git","Gradle","Spring Boot"]
---
今起動しているSpring Bootアプリはどのコミットでビルドされたものなのか？
を確認できるようにしたいと思い、やり方を探ってみた。

前提として、ビルドにはGradleを使う。
AndroidアプリなどでもGradleを使ってSHAハッシュ値をアプリの中に含めたりしていたが、それと似たようなことをやる方法。
<!--more-->

まず、GradleのJavaプラグインでは`processResources`というタスクがありこのタスクではsrc/main/resourcesフォルダのファイルがbuild/resourcesへコピーされる。
このときにファイルをフィルタリングしたり変数を展開したりすることができる。
ProcessResourcesはCopyを継承しているので、Copyができることはできる。
[AbstractCopyTask#expand()](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/AbstractCopyTask.html#expand(java.util.Map))を使うと、引数に渡したMapで変数を置換してくれる。
application.ymlに対してこれを実行すれば、Gradleから変数を渡して定義してやることができる。
また、Gitのハッシュはexecute()で簡単に取れる。
build.gradleには以下のように書く。

```groovy
ext.gitSha = "git rev-parse --short HEAD".execute().text.trim()
processResources {
    filesMatching('**/*.yml') {
        expand(gitSha: gitSha)
    }
}
```

こうすると、コミットの短縮ハッシュ値をymlファイル上で`${gitSha}`という記述で埋め込むことができる。
(※ただし、この書き方だとgitコマンドが実行できない状況ではビルドが失敗するようになるので注意)

src/main/resources/application.ymlには例えば以下のように書けばいい。

```yaml
application:
    revision: ${gitSha}
```

すると、Springアプリ側では

```java
@Value("${application.revision}")
private String revision;
```

のように値を取得してどこか(画面かな？)に表示することができる。

しかし、どこかに表示するための画面を作ったりしなくてもSpring Bootのバナー機能を使うと簡単にログ出力できる。
src/main/resources/banner.txtを用意して

```
Revision: ${application.revision}
```

などとすれば

```
$ ./gradlew bootRun
...
:bootRun
Revision: b27952a
2015-12-11 00:01:50.979  INFO 11297 --- [  restartedMain] com.example.spring.App                   : Starting App on xxxx with PID 11297 ...
```

という感じで起動時にコミットハッシュ値を出力できる。
このやり方ならアプリの形態を問わずに使える。

なお、プロファイルに定義するプロパティ名は何でも良いはずだが、[バナーのカスタマイズの説明](http://docs.spring.io/spring-boot/docs/1.3.0.RELEASE/reference/htmlsingle/#boot-features-banner)によると`application.version`は特別な意味を持たせているようなので上記のように別の名前で定義することにした。

上記の内容でもやらないよりはマシだが、ビルドからデプロイの過程に人(手作業)が介在するなら、もっと厳密にやったほうがいいのかもしれない。
例えば、作業コピーがDirtyな状態でビルドしてしまったら同じコミットハッシュを持っていても違うアプリができあがってしまう。
さらにはビルドしたJDKが違うせいで起きる問題とかもあるかもしれない。
そうした諸々の「ビルド時点の情報」をすべて盛り込む、というのもやってみてもいいかもしれない。

---

最後に・・
昔から行われている事だとは思うが、なぜこんなことをする必要があるか？というと、それはトレーサビリティのある状態を手間をかけずに維持したいから。
何かアプリに問題があったときに、Javaならスタックトレースを見たりするがそのとき、そのモジュールがどのコミットに対応しているのかは重要になる。
（ちょっとでも修正を加えていたら行番号が合わなかったりするし・・）
厳密にバージョン管理されてリリースされていればいいかもしれない。
例えばリリースの台帳があって、バージョン番号とコミットハッシュ値が書かれていて、それを更新しないとリリースできない手順になっているとか。
しかしそのような管理体制になっているとも限らない。
それならバージョン情報を書いたファイルを入れてもいいが、それを更新するのを忘れたりする。
それなら、ビルドの過程で自動的に情報を埋め込めばいい。

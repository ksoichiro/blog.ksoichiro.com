---
title: "Android Gradle PluginでJaCoCoを有効にしてテストするとjava.lang.VerifyError発生"
noEnglish: true
originalCreatedAt: 2014-05-11T09:46:00.001+09:00
tags: ["Android Studio","Gradle","JaCoCo","Android","AndroidFormEnhancer"]
---
[AndroidFormEnhancer](https://github.com/ksoichiro/AndroidFormEnhancer)は、Eclipseでの利用も可能にしているものの基本的にはAndroid Studioで開発し、Gradleでビルドしている。
テストカバレッジを上げるために少しでも多くのテストを書こうとしているが`connectedAndroidTest`タスクを実行しているときに特定のクラスで`java.lang.VerifyError`が発生する。
(未解決です)

> com.androidformenhancer.helper.ActivityFormHelperTest > testInit[test(AVD) - 4.2.2] FAILED 
> 	**java.lang.VerifyError**: com/androidformenhancer/internal/ValidationManager
> 	at com.androidformenhancer.helper.FormHelper.setValidationManager(FormHelper.java:356)
> :library:connectedAndroidTest FAILED
> 
> FAILURE: Build failed with an exception.

<!--more-->

### バージョン情報

各種バージョンは以下の通り。

* Android Studio 0.5.7
* Gradle 1.10 (Gradle Wrapper)
* com.android.tools.build:gradle:0.10.+
* com.android.support:support-v4:19.0.1

### VerifyErrorの詳細

上記の通りメッセージにはクラス名しか含まれていないので、なぜ`VerifyError`が発生したのかが分からない。
そのクラスのコンストラクタを呼び出すだけで発生し、中身が空のデフォルトコンストラクタでも発生するのでこのクラス内の処理が問題なのではなく、クラスの構造や依存関係(`import`など)が関係しているのかもしれない。

### 外部ライブラリが原因か？

当初は原因の一つが、android-support-v4ライブラリに依存していることのように見えた。

このライブラリが問題、というよりは外部jarファイルに依存したライブラリプロジェクトだと、`androidTest`などのテストタスクが失敗する模様。

よく考えてみれば、後方互換性のためのライブラリを含めているとこれが障害で導入できないプロジェクトもありそうなのでなるべく切り離したプロジェクト構成として見直すことにした。

実際、問題の起きたクラスがandroid-support-v4ライブラリに依存しないように修正すると、そのクラスでは発生しなくなった。

しかし、そのクラスが読み込む別のクラスで発生。
このクラスはandroid-support-v4もその他の外部ライブラリにも依存していない。
どうやら外部ライブラリが原因ではないらしい。

### Verifierの調整

Androidで`VerifyError`というと、ADTのバージョンによってはjarファイルがエクスポートされない設定になっているだとかの情報が見当たるが、今回のケースには該当しない。

[CoberturaでVerifyErrorにてカバレッジが取得できない現象](http://kikutaro777.hatenablog.com/entry/2013/02/18/222723)という記事を見つけ、同様にJDK7関連の問題か？と以下を`gradle-wrapper.properties`に追記して実行してみる。

```
org.gradle.jvmargs=-XX:-UseSplitVerifier
```

しかし失敗。。。
実行時に与えるように以下も試したがやはり失敗。

```
GRADLE_OPTS="-XX:-UseSplitVerifier" ./gradlew :library:connectedCheck
```

でもカバレッジ取得が関係していそうな気が。
そこで、`gradle.properties`から以下の記述を除去してみる。

```groovy
buildTypes {
    debug {
        testCoverageEnabled = true
    }
}
```

すると、なんとテストが成功！
しかしカバレッジを上げるためのテストなのにカバレッジを取らない場合でしか実行できないのでは意味がない。。。
JaCoCo(もしくはAndroid Gradle Plugin？)が問題である可能性は高い。
[以前のエントリ](/ja/post/2014/05/androidgradle-jacoco/)でのように別のGradleファイルに記述することでうまく回避したいが、、、
前回はカバレッジ取得＋カバレッジ送信だったので分けられたが今回は同一の操作(テスト＆カバレッジ取得)なので分割しようがない。

さらに見ていくと、Javassist関連でも`VerifyError`の情報が見つかる。
https://code.google.com/p/powermock/issues/detail?id=355
EMMAなどのキーワードで探してもやはり色々見つかる。

リフレクション関連の問題なのだろうか？
[Android Gradle PluginがDaggerには対応していない](http://tools.android.com/tech-docs/new-build-system)ということもあるし。。
(以下、Daggerに関する記述の引用)

> Known issue: This is not compatible with using Dagger.

DIなのでリフレクション的なことはしているのだろうと思い実際、Daggerのリポジトリ内で`java.lang.reflect`を探してみるといくらかヒットする。

今回問題の起きているAndroidFormEnhancerもリフレクションを多用している。

ちなみにandroid-support-v4ライブラリ内にも`java.lang.reflect`パッケージの利用箇所がある。

### 他に試したこと

…ということで`VerifyError`問題は解決せず。
カバレッジは35％のまま。。。
リフレクション＋カバレッジ計測の問題だとするとかなり根が深そう。
上記の他には以下のことも試してみた。

* `JAVA_OPTS`で`-XX:-UseSplitVerifier`を設定して実行→失敗
* `GRADLE_OPTS`で`-XX:-UseSplitVerifier`を試す→失敗
* `-XX:+FailOverToOldVerifier`を試す→失敗
* `-Xverify:none`を試す→失敗
* JaCoCoのバージョンを下げる→失敗
* JDK6で実行する(DockerでOpenJDK6を入れてテスト)→失敗

ここまで書いて気づいたが、`connectedAndroidTest`で発生しているのだからGradleを実行するJVMに問題があるのではなく端末上のVM(DalvikVM)のVerifierに問題がある・・？

今回はここまで。

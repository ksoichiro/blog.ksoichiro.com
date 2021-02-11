---
title: "AndroidのテストタスクだけGradleでログ出力する"
created: 2015-12-01T23:06:00.001+09:00
tags: ["Gradle","Travis CI","Android"]
---
久々のAndroid関連ネタ。
[Android-ObservableScrollView](https://github.com/ksoichiro/Android-ObservableScrollView)では、なるべくカバレッジ100%になるようテストを書こうとしている。
しかしテストが増えてきたせいか、Travis CIでのテスト実行中に出力がない時間が10分以上続いてしまい、ビルドが失敗することが多くなってきた。
テスト系のタスクだけもう少しログ出力させられないか？
を解決する方法について紹介する。

まず、テスト系限定でなく、すべてのタスクに対して
INFOレベルでログ出力するのなら
Gradle的には以下のように--infoなどをつければいい。

```
./gradlew connectedCheck --info
```

しかしすべてのタスクがINFOレベルで出力されるのは
見づらくなるだけなので避けたい。
<!--more-->

Javaプラグインが適用できれば
testクロージャにtestLoggingなどの設定を書くことで
実現できるようなのだが、
AndroidライブラリにJavaプラグインを適用するのは避けたい。

結論としては次のように書けば
テストの状況がログ出力されるようになる。

```groovy
afterEvaluate { project ->
    tasks.withType(VerificationTask) {
        logging.level = LogLevel.INFO
    }
}
```

以下はMacでNexus5を接続してテストした時の様子。

```
➜  Android-ObservableScrollView git:(master) ✗ ./gradlew library:connectedCheck -s
:library:preBuild UP-TO-DATE
:library:preDebugBuild UP-TO-DATE
:library:compileDebugNdk UP-TO-DATE
:library:compileLint
:library:copyDebugLint UP-TO-DATE
:library:checkDebugManifest
...
:library:connectedDebugAndroidTest
Starting 61 tests on Nexus 5 - 6.0

com.github.ksoichiro.android.observablescrollview.SavedStateTest > testGridViewSavedState[Nexus 5 - 6.0] SUCCESS 

com.github.ksoichiro.android.observablescrollview.SavedStateTest > testListViewSavedState[Nexus 5 - 6.0] SUCCESS 

com.github.ksoichiro.android.observablescrollview.SavedStateTest > testRecyclerViewSavedState[Nexus 5 - 6.0] SUCCESS 

com.github.ksoichiro.android.observablescrollview.SavedStateTest > testScrollViewSavedState[Nexus 5 - 6.0] SUCCESS 
...
```

テストの進捗状況がわかるので、Travis CIに限らずローカルでの実行時にも有用かも。

先ほどの設定をもう少し詳しく説明する。
まず次のようにすると、connectedDebugAndroidTestタスクに対してINFOレベルでログ出力させるような指示になる。

```groovy
tasks.connectedDebugAndroidTest {
    logging.level = LogLevel.INFO
}
```

connectedDebugAndroidTestはconnectedAndroidTestのうちDebugのBuildTypeに対応するタスク。

しかしこれはうまくいかない。
connectedDebugAndroidTestタスクが定義されるのは
Gradleの評価(evaluation)が終わってからなので、
上記を記述して実行するとビルド失敗する。

そこで次のようにすれば、評価が終わって
BuildTypeごとのタスクが定義された状態で
アクセスできるので、正常に設定することができる。

```groovy
afterEvaluate { project ->
    tasks.connectedDebugAndroidTest {
        logging.level = LogLevel.INFO
    }
}
```

connectedDebugAndroidTestという特定のタスクを
書きたくない(複数のBuildTypeやFlavorをテストしたい)という場合は、

```groovy
afterEvaluate { project ->
    tasks.withType(VerificationTask) {
        logging.level = LogLevel.INFO
    }
}
```

とすればorg.gradle.api.tasks.VerificationTaskを
実装したタスクに対してはすべて設定を適用できる。
ただし、Android Gradle Pluginの今後の仕様によっては使えなくなる可能性もあるかもしれない(VerificationTaskをimplementしなくなるかも)。
上記の動作を確認したのはPluginのv1.5.0。

なお、VerificationTaskの部分をAndroidTestTaskとしなかったのは、
このタスクはcom.android.build.gradle.internal.tasksパッケージに
属しており、外部から使うべきではないだろうと考えたため。

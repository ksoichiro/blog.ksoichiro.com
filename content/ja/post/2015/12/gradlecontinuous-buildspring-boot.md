---
title: "GradleのContinuous BuildでSpring Bootアプリ実行中にリソース変更を反映する"
originalCreatedAt: 2015-12-20T18:40:00.001+09:00
tags: ["Gradle","Spring Boot"]
---
タイトルの内容は、もともとできるんじゃないの？という感じもするかもしれないが、それではうまくいかないケースがあり、それをGradleのContinuous Build機能を使ったら何とか実現できた、という話。

Continuous Build
http://gradle.org/feature-spotlight-continuous-build/
https://docs.gradle.org/current/userguide/continuous_build.html

少し長いので、順序立てて説明。
<!--more-->

### 背景

Spring Boot + Gradle で開発している時、特にWebの画面をもつアプリを開発している場合は「gradlew bootRunでのアプリ起動中にThymeleafテンプレートやpropertiesなどの静的リソースを変更したら、再起動なしで反映するようにしたい」と考えると思う。

もともと Spring Boot 1.2.x までは、デフォルトで src/main/resources 以下がbootRunタスクのクラスパスに追加されていたため、変更して画面をリロードすればすぐに反映されていた。

Spring Boot 1.3.0では、Automatic Restart、Live Reloadといった機能が DevTools として実装されたのだが、どうも意図したように再起動・リロードしてくれない。静的リソースを変更しただけで再起動してしまうし、Live Reload もうまく動作していない。

またこの機能が入ったことにより、bootRun タスクでは src/main/resources をクラスパスに含めないのがデフォルトとなったのだが、結局うまく動作しないので以下のように build.gradle に設定して、1.2.x までのようにクラスパスに入れてくれるようにしている。

```groovy
bootRun {
    addResources = true
}
```

しかし、この方法にはいくつか問題がある。

### リソースが直接読み取られる

Spring Boot のドキュメントでも、bootRun.addResources = false をデフォルトにした理由として書いてあったのだが、この方法の問題は、 src/main/resources 以下のファイルの内容がそのまま Spring Boot に読み取られてしまうことだ。

bootRun は開発用のタスクであり、実際にリリースする場合は当然JARファイルにしてデプロイする。その際には src/main/resources が丸ごとJARに入って読み取られるわけではなく、processResources タスクでフィルタリングすることができ、ファイル内容を加工してからJARに入るようにしたり、一部のファイルだけを含めるようにしたりすることができる。
設定ファイルの一部に変数を埋め込んでおいて、processResources タスクで置換することもできる。

こうした処理をスキップして直接 src/main/resources 以下が読み取られてしまうので、processResources タスクなどでリソースに手を加える必要がある場合は、開発時とリリース時で異なる状態になってしまう。

### プロパティファイルはnative2asciiした状態で管理しなければならない

Propertiesファイルの仕様としては、native2asciiをかけてUnicodeエスケープされていなければいけない。

だから、bootRunタスクでリソースを直接読み取らせるようにするならば、Unicodeエスケープされた状態でファイルを管理していなければならない。例えばIntelliJ で開発するなら [Transparent native to ascii conversionの設定](https://www.jetbrains.com/idea/help/configuring-encoding-for-properties-files.html) をしておく必要がある。

これが非常に扱いづらい。
何と言っても、bootRun実行中にpropertiesを編集したりするとIntelliJが変換してくれないことがあるし、新規ファイルを追加した後はIntelliJを再起動しないと変換対象ファイルとして認識してくれなかったりする（これは動かしてみての推測で、仕様/不具合なのかどうかは不明）。

さらに、Unicodeエスケープされた状態のファイルをバージョン管理することになるので、ソースコードレビューする際にもUnicodeエスケープされた状態で差分が出てくる。

まあ、Thymeleafに限って言えば、native2asciiしてなくてもきちんと表示されるのだが、@PropertySourcesとかProperties#load()などを使ってプロパティを読み込む場合はきちんと変換していなければUnicode文字を表示できない。

## 解決策

というわけで、以下のように管理・開発できるのが望ましいなと考えた。

* src/main/resources以下のファイルはヒューマンリーダブルな状態で管理する
* アプリのビルド時にnative2asciiなどのファイル加工を実行する
* バージョン管理するのは加工前のヒューマンリーダブルなほう
* bootRunでの実行、JARファイルとしての実行、どちらも加工済みのファイルだけを参照する（開発・本番の差異は少なくする）
* processResourcesなどによるファイル加工は、ファイル変更を検知して自動的に実行する

src/main/resources以下のファイルを加工するタスクは、processResourcesでもいいし独自のタスクでも構わない。
processResourcesはデフォルトではbuild/resources/mainにファイルを出力するので、独自タスクを用意する場合は、このディレクトリにアウトプットすればいい。
このタスクを手動実行すれば話は簡単なのだが、開発効率が下がるので避けたい。

そこで解決策となるのは、冒頭に書いた通り、Gradle に最近追加された Continuous Build という機能。-tオプションをつけてタスクを実行すると、そのタスクの入力ファイルの変更を検知してタスクを再実行してくれる。この機能を使って、src/main/resources以下のファイルを随時加工していけばいい。
フロントエンド界隈のGulpとかGruntなどだと既に提供されている機能だけど、Gradleでもできるようになっていた。

例えば、src/main/resources/messages.propertiesをnative2asciiする場合は以下のようにすればいい。

```groovy
task native2ascii {
    inputs.files files("src/main/resources/messages.properties")
    doLast {
        ant.native2ascii(
            src: "${projectDir}/src/main/resources",
            dest: "${buildDir}/resources/main")
    }
}
```

そして、次のように-tをつけてnative2asciiタスクを実行すれば、messages.propertiesを変更するたびにbuild/resources/以下に変換され、出力される。

```
./gradlew -t native2ascii
```

なお、これだけだと当然bootRunタスクは動かないので、別のターミナルでbootRunタスクを実行しておく必要がある。

これで、bootRun.addResources = trueとしていなくても、アプリ実行中に静的リソースの編集→反映ができて開発効率も落ちずソースコードレビューもしやすくなる。

### 残りの問題

Gradleを同じプロジェクトの中で複数動かすため、時々タスクの起動に失敗してしまう。正確には、Configurating ...と表示されたまま止まってしまう。
（一度両方のタスクを停止して起動しなおせば大概うまくいくが）

それから、2つのタスクを別ターミナルで実行しなければいけないという面倒さ。開発が進行中のプロジェクトでは、きちんと周知しないと「変更が反映されなくなった！」と不満が噴出するかもしれない。

この2つが特に問題にならなければ、この方法でうまくいきそうだ。

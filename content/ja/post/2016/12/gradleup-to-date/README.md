---
title: "Gradleプラグインのup-to-dateを確認するテスト"
createdAt: 2016-12-31T17:47:00.001+09:00
tags: ["Gradle","Spock"]
---
GradleプラグインのTaskにInputとOutputを設定して、いずれかが変化した時にだけタスクが再実行されるようにしたいとき。
実装は簡単でも、テストはどうするか。
up-to-dateがきちんと判定できないと、変更が入った時に処理が実行されないなど致命的な不具合になる。
※Gradleのバージョンが古い(2.x)ので、最新では少し話が違うかもしれない。
<!--more-->

タスクが実行されるかどうかをテストするには、GradleのTestKitを使う。

以下のようにするとタスク(ここでは`build`)を実行できる。

```groovy
def result = GradleRunner.create()
    .withProjectDir(rootDir)
    .withArguments('build')
    .withPluginClasspath(pluginClasspath)
    .build()
```

ビルドが成功したかどうか、は以下のようにチェックできる。

```groovy
result.task(":build").getOutcome() == TaskOutcome.SUCCESS
```

同様に、up-to-dateと判定されスキップされたことを確かめるには以下のようにすればいい。

```groovy
result.task(":build").getOutcome() == TaskOutcome.UP_TO_DATE
```

入出力を変更しながら、あるいは変更せずに、GradleRunnerを繰り返し実行すればこの遷移をテストすることができる。

前のエントリ [Spockで複数ステップのテストを書く](/ja/post/2016/12/spock/) に書いたように、when: と then: を繰り返せば Spock でも表現できるので、例えば以下のように書ける。

```groovy
def foo() {
    setup:
    def buildFileContent = """\
        |plugins {
        |    id '${PLUGIN_ID}'
        |}
        |apply plugin: 'java'
        |//その他の設定
        |""".stripMargin().stripIndent()
    buildFile.text = buildFileContent

    when:
    def result = run('1st')

    then:
    result.task(":foo").getOutcome() == TaskOutcome.SUCCESS

    when:
    // 何も変更せずに再実行してスキップされるか
    result = run('2nd')

    then:
    result.task(":foo").getOutcome() == TaskOutcome.UP_TO_DATE

    when:
    // 入力ファイルを変更して再実行したら処理されるか
    new File("${rootDir}/build/resources/main/bar.properties").canonicalFile.text += "\ntest"
    result = run('3rd')

    then:
    result.task(":foo").getOutcome() == TaskOutcome.SUCCESS
}

BuildResult run(def label) {
    BuildResult result = GradleRunner.create()
        .withProjectDir(rootDir)
        .withArguments('foo')
        .withPluginClasspath(pluginClasspath)
        .build()
    if (label) {
        println label
    }
    result
}
```

具体的な実装例は [gradle-build-info-plugin のこちらのテスト](https://github.com/ksoichiro/gradle-build-info-plugin/blob/master/src/test/groovy/com/github/ksoichiro/build/info/FunctionalSpec.groovy) などを参照。

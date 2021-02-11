---
title: "[Android][Gradle] ライブラリプロジェクトのJaCoCoでのカバレッジ計測"
created: 2014-05-05T21:31:00.000+09:00
tags: ["Gradle","Travis CI","JaCoCo","Android","AndroidFormEnhancer"]
---
Android Studioがリリースされて以来、Gradleプラグインをしばらく使っていたものの androidプラグインがjavaプラグインと共存できないせいでいろいろとできないことがあった。

その一つが、カバレッジの計測。 4月末のAndroid Gradle Plugin 0.10.0のリリースでJaCoCoのサポートが追加され、ついにandroidプラグインでもカバレッジ計測ができるようになった。
[http://tools.android.com/tech-docs/new-build-system](http://tools.android.com/tech-docs/new-build-system)

気づいて早速使おうとしたものの、上記ページに書かれている他は
ほとんど書かれているところがなくうまく動かず。。。
また、動かそうとしたのが単純なAndroidアプリケーションプロジェクトでなく
ライブラリプロジェクトであり、Eclipse互換の構造を保とうとしながら
作っていたせいかもしれない。

今回は、そんな条件であってもJaCoCoによるカバレッジ計測を可能にし、
[Travis CI](https://travis-ci.org/) でビルドして [Coveralls](https://coveralls.io/) でカバレッジを表示するところまで試してみた
という内容。※長いです。

Androidライブラリの [AndroidFormEnhancer](https://github.com/ksoichiro/AndroidFormEnhancer) でこれを試し、
以下のようなバッジを表示することがゴール。

[![](http://4.bp.blogspot.com/-52QWIKXsFhY/U2d26nrHWyI/AAAAAAAAMug/euh1PvxyauU/s1600/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2014-05-05+20.32.14.png)](http://4.bp.blogspot.com/-52QWIKXsFhY/U2d26nrHWyI/AAAAAAAAMug/euh1PvxyauU/s1600/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2014-05-05+20.32.14.png)

カバレッジが35％しかないですが、低いのは理由があり、
デモアプリでの動作である程度カバーしていたのが今は計測できていないというため。
ライブラリプロジェクトでは単純なJUnitテスト(あるいはInstrumentationTestCase)
ならできるものの、ActivityやR(リソース)を絡めたテストがうまく実行できず。
これは今後の課題ということで。。。

### Android Gradle Pluginプラグインのアップデート

0.10を適用する。
Gradleを使っていれば、おそらく、プロジェクトのトップレベルのbuild.gradleで
次のような指定をしているはずなのでバージョンを「0.10.+」に変更する。

```groovy
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:0.10.+'
    }
}
```

上述のAndroidのサイトの内容より、
Gradleは1.10から1.12がサポートされているとのことなので、
ラッパーを使っている場合は以下のようにgradle/wrapper/gradle-wrapper.propertiesでのバージョン指定を確認する。

```
distributionUrl=http\://services.gradle.org/distributions/gradle-1.10-all.zip
```

### JaCoCoの適用

ビルド対象のプロジェクト(Gradleでのプロジェクトの意味。
今回の場合はAndroid Studioでのプロジェクトではなくサブプロジェクト)の
build.gradleでJaCoCoを適用する。
JaCoCoプラグインのバージョンは [Mavenリポジトリ](http://mvnrepository.com/artifact/org.jacoco/jacoco-maven-plugin) から最新のものを選んだ。

```groovy
android {
    // 以下を追加
    jacoco {
        version = '0.7.0.201403182114'
    }
    (中略)
    buildTypes {
        debug {
            // debugのBuildTypeに以下を追加することで有効になる
            testCoverageEnabled = true
        }
    }
}
```

また、上記で基本的に設定は終わりだが、このままだとJaCoCoプラグインが見つからないエラーが発生する。
(Could not find org.jacoco:org.jacoco.agent:0.6.2.201302030002.)
以下のように、対象プロジェクトのトップレベルでrepositoriesを設定しておく必要がある。

```groovy
apply plugin: 'android-library'

// これを追加
repositories {
    mavenCentral()
}
:
android {
:
```

他にサブプロジェクトが存在する場合は、そちらでも同じように設定しておかないとエラーが発生するかもしれない。

### カバレッジレポートの出力

ここまでの設定で、カバレッジレポートを出力できるようになっているはず。
今回のプロジェクトはライブラリのプロジェクトとサンプルが同梱されたプロジェクトになっており、以下のような構造。

```
AndroidFormEnhancer
├── README.md
├── build
├── build.gradle
├── gradle
├── gradlew
├── gradlew.bat
├── library
│   ├── AndroidManifest.xml
│   ├── build
│   ├── build.gradle
│    :
│   └── src
├── samples
│   ├── demos
│   │   ├── AndroidManifest.xml
│   │   ├── ant.properties
│   │   ├── build
│    :
├── settings.gradle
├── tests
│   ├── AndroidManifest.xml
│   ├── proguard-project.txt
│   ├── project.properties
│   ├── res
│   │     :
│   └── src
:
```

カバレッジを計測したいのは、上記のうちのlibraryというサブプロジェクトの部分のみ。
以下のコマンドでカバレッジを計測できる。

```
./gradlew :library:createDebugCoverageReport
```

もしくは、チェック全体を通すように以下を実行しても良い。

```
./gradlew :library:connectedCheck
```

これにより、 library/build/reports/coverage/debug のフォルダにレポートが出力される。

### Travis CIでの実行

単にフォルダにレポートを出力するだけなら、.travis.ymlで上記を実行するようにすれば良い。
例えば、buildした後にconnectedCheckをするようにするなら以下のように書く。

```yaml
script:
    - TERM=dumb ./gradlew build
    - TERM=dumb ./gradlew connectedCheck
```

### Coveralls連携

まずCoverallsでアカウントを作成し、対象のGitHubリポジトリ(Publicなもの)を連携しておく。
その上で、Travis CI (Proではない)でのビルド完了時にレポートをCoverallsへ送信するように設定する必要がある。
[Coverallsのドキュメント](https://coveralls.io/docs) を見ると、各言語用に書かれているがAndroidについては触れられておらず、Javaについても [リンクしかない](https://coveralls.io/docs/java)。

ここでは [coveralls-maven-plugin](https://github.com/trautonen/coveralls-maven-plugin) を利用する方法が紹介されている。
MavenなのでMavenを動かせば問題ないのだがGradleでビルドしているのでGradleで何とかしたい。
と思って探してみると [coveralls-gradle-plugin](https://github.com/kt3k/coveralls-gradle-plugin) というのを発見。

Gradleから実行できる！と思い取り込んでみた。
以下のようにプラグインを適用する apply plugin と、クラスパスの指定が必要。

```groovy
apply plugin: 'coveralls'

buildscript {
    :
    dependencies {
        classpath 'org.kt3k.gradle.plugin:coveralls-gradle-plugin:0.4.0'
    }
}
```

さらに、このままだとJaCoCo単独でのレポート出力先を見に行ってしまうので
パスをAndroid用に修正する。

```
coveralls.jacocoReportPath = 'build/reports/coverage/debug/report.xml'
```

これで PushしてTravis CIでビルドし、

```
./gradlew coveralls
```

で連携を試みるものの 「No source file found on the project: "library"」

試行錯誤するたびにコミットしないといけないのも嫌なので、ローカルで実行してみる。
単純に実行するとトークンがなく失敗するので以下のようにトークンを与えてcoverallsタスクを実行。

```
COVERALLS_REPO_TOKEN=(このプロジェクト用のトークン) ./gradlew coveralls --info
```

すると以下のようになり、

```
repo token: present (not shown for security)
Report file: /.../AndroidFormEnhancer/library/build/reports/coverage/debug/report.xml
No source file found on the project: "library"
With coverage file: /.../AndroidFormEnhancer/library/build/reports/coverage/debug/report.xml
:library:coveralls (Thread[main,5,main]) completed. Took 0.7 secs.
```

レポートファイルが出力されているが対応するソースコードが見つからず失敗している様子(pluginのソースコードから確認)。
プラグインを修正しても良いが、Pluginの種類を見てソースフォルダを振り分けており、
Android Pluginをインポートするくらいしか解決策が見つからなかったので
別の方法を探すことに。

### 別のgradleファイルからのカバレッジ送信

pluginを修正するとか、mvnでcoveralls-maven-pluginを実行する、
というのはかなり骨が折れそうな気がしたので、
思い切ってandroid-libraryプラグインとの共存をあきらめた。
そもそも問題はandroidあるいはandroid-libraryプラグインがjavaプラグインと共存できないことにあるので、
依存関係を切り離せないか？と調べたところgradlewにはbuild.gradle以外のファイルを指定してビルドするオプションがあった。
これで、別のファイルにjavaプラグインに依存するタスクの設定を書き、単独で実行すれば問題なくcoverallsを実行できる。
結果的に.travis.ymlに書いた、ちゃんと動く書き方は以下。

```yaml
after_success:
    - TERM=dumb ./gradlew -p library -b library/coverage.gradle coveralls
```

libraryサブプロジェクト内に coverage.gradleというファイル(名前は何でもOK、場所もここでなくても良いかも)を以下のような内容で作成してから実行する。

```groovy
apply plugin: 'java'
apply plugin: 'jacoco'
apply plugin: 'coveralls'

buildscript {
    repositories {
        mavenCentral()
    }

    dependencies {
        classpath 'org.kt3k.gradle.plugin:coveralls-gradle-plugin:0.4.0'
    }
}

sourceSets {
    main {
        java.srcDirs = ['src']
    }
}

coveralls.jacocoReportPath = 'build/reports/coverage/debug/report.xml'
```

これでようやく、
GitHubへPush
→Travis CIでのビルド(GradleでのAndroidプロジェクトビルド)
→JaCoCoでのカバレッジ計測
→Coverallsへの送信
→GitHubプロジェクトのREADMEでのカバレッジ表示
という一連の流れが実現できた。

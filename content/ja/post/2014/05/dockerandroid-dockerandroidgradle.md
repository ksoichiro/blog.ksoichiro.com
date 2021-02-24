---
title: "[Docker][Android] DockerでAndroidエミュレータを動かしGradleによるビルド＆テストを実行"
noEnglish: true
originalCreatedAt: 2014-05-02T21:58:00.005+09:00
tags: ["Dockerfile","Docker","Android"]
---
[前のエントリ](/ja/post/2014/05/docker-dockerfile/) で書いたように、Dockerを使ってAndroidのテストをすることができる。
さらに色々なパターンのテストを試していこうとVagranfile, Dockerfileに続きAndroidのテスト集を作成(以前からあったがいくつか追加)。
[https://github.com/ksoichiro/android-tests](https://github.com/ksoichiro/android-tests)
<!--more-->
以下は、Docker上のAndroidエミュレータでテストをする例。
[https://github.com/ksoichiro/android-tests/tree/master/docker-emulator](https://github.com/ksoichiro/android-tests/tree/master/docker-emulator)
比較のために通常のGradleによるインストールなども記載してるがメインはサイトの test.sh の実行部分。
ここで [Androidエミュレータセットアップ済みのコンテナ](https://index.docker.io/u/ksoichiro/android-emulator/) を使ってGradleラッパーによる端末テストを実行する。
テストが本当に実行されていることが分かるように、わざと失敗するテストにしてある。

気をつけないといけないのが local.properties の存在。
JenkinsでDockerを使ったビルドをする場合なら考慮する必要のないことだが、通常のIDE( or Gradle)でのビルドとDockerでのビルドを同じファイルに対して実行する場合、local.propertiesに定義されたAndroid SDKのパスがそれぞれ異なるため、どちらかで動くようにするとどちらかのビルドが失敗してしまう。
上記スクリプト(test.sh)では、Gradleラッパーの実行前に local.properties をリネームしてから実行し、終了後に戻すようなことをしている。

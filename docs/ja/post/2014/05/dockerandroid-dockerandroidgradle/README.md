---
title: "[Docker][Android] DockerでAndroidエミュレータを動かしGradleによるビルド＆テストを実行"
created: 2014-05-02T21:58:00.005+09:00
tags: ["Dockerfile","Docker","Android"]
---
[前のエントリ](http://ksoichiro.blogspot.jp/2014/05/docker-dockerfile.html) で書いたように、Dockerを使ってAndroidのテストをすることができる。
さらに色々なパターンのテストを試していこうと
Vagranfile, Dockerfileに続きAndroidのテスト集を作成(以前からあったがいくつか追加)。
[https://github.com/ksoichiro/android-tests](https://github.com/ksoichiro/android-tests)
<!--more-->
以下は、Docker上のAndroidエミュレータでテストをする例。
[https://github.com/ksoichiro/android-tests/tree/master/docker-emulator](https://github.com/ksoichiro/android-tests/tree/master/docker-emulator)
比較のために通常のGradleによるインストールなども記載してるが
メインはサイトの test.sh の実行部分。
ここで [Androidエミュレータセットアップ済みのコンテナ](https://index.docker.io/u/ksoichiro/android-emulator/) を使って
Gradleラッパーによる端末テストを実行する。
テストが本当に実行されていることが分かるように、
わざと失敗するテストにしてある。

気をつけないといけないのが local.properties の存在。
JenkinsでDockerを使ったビルドをする場合なら考慮する必要のないことだが、
通常のIDE( or Gradle)でのビルドとDockerでのビルドを同じ
ファイルに対して実行する場合、local.propertiesに定義された
Android SDKのパスがそれぞれ異なるため、どちらかで動くようにすると
どちらかのビルドが失敗してしまう。
上記スクリプト(test.sh)では、Gradleラッパーの実行前に local.properties を
リネームしてから実行し、終了後に戻すようなことをしている。

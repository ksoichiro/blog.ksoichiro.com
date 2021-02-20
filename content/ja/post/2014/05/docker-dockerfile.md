---
title: "[Docker] Dockerfileのサンプル"
originalCreatedAt: 2014-05-02T21:44:00.000+09:00
tags: ["Java","Dockerfile","JDK","Docker","Android"]
---
勉強のために、そしてCIやら色々使い方を考えるためにテンプレートとして
リポジトリを作成。
[https://github.com/ksoichiro/dockerfiles](https://github.com/ksoichiro/dockerfiles)
さらに最後には index.docker.io に登録してみた。

以下その内容。
<!--more-->
## OpenJDK7

Javaが使えるというだけですが・・。
[https://github.com/ksoichiro/dockerfiles/tree/master/openjdk7](https://github.com/ksoichiro/dockerfiles/tree/master/openjdk7)
こちらに登録中。
[https://index.docker.io/u/ksoichiro/openjdk7/](https://index.docker.io/u/ksoichiro/openjdk7/)
"docker pull ksoichiro/openjdk7" でプルできます。

## Android

Android SDKが使えるコンテナ。Jenkinsでのビルドに使えそう。
[https://github.com/ksoichiro/dockerfiles/tree/master/android](https://github.com/ksoichiro/dockerfiles/tree/master/android)
こちらに登録中。
[https://index.docker.io/u/ksoichiro/android/](https://index.docker.io/u/ksoichiro/android/)
"docker pull ksoichiro/android" でプルできます。

## Android + エミュレータ

Android SDKとエミュレータ(ARM)が使えるコンテナ。
[https://github.com/ksoichiro/dockerfiles/tree/master/android-emulator](https://github.com/ksoichiro/dockerfiles/tree/master/android-emulator)
エミュレータを実行するスクリプトはENTRYPOINTになっているだけなので、docker runしてからしばらくは起動待ち。。。
それでも、ホスト側の環境を汚さずにAndroid上でのテストができるのでこれもCIに使えそう。
(頻繁な実行は厳しいが・・・)

こちらに登録中。
[https://index.docker.io/u/ksoichiro/android-emulator/](https://index.docker.io/u/ksoichiro/android-emulator/)
"docker pull ksoichiro/android-emulator" でプルできます。

エミュレータについては、例えばGradleでビルドしているプロジェクトなら以下のように使える。

```
cd /path/to/project
docker run -t -i -v \`pwd\`:/workspace ksoichiro/android-emulator start-emulator "./gradlew connectedAndroidTest"
```

VOLUMEとWORKDIRの設定がしてあり、dockerのコンテナ内では/workspaceがプロジェクトフォルダになる。
/opt/android-sdk-linuxにインストールされたAndroid SDKを使って/workspaceのプロジェクトをGradleでビルド・テストすることになる。

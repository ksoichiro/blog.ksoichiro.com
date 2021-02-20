---
title: "[Docker][Android] AndroidアプリでHTTP通信を含むコードをDockerコンテナ内で完結させて自動テスト"
created: 2014-05-02T22:36:00.000+09:00
tags: ["Docker","Android"]
---
[前回](/ja/post/2014/05/dockerandroid-dockerandroidgradle/) の続きで、DockerでAndroidの自動テストを試してみる。

前回は単純なテストケース(中身がないといってもいい)だったが、実際のAndroidアプリなら大抵の場合は通信が発生するもの。
<!--more-->

以下のサンプルでは、DockerでHTTPサーバ(Node.js)を立て、そのコンテナにAndroid SDK+エミュレータのコンテナを接続することですべてDocker上で完結したテストを実行する。

[https://github.com/ksoichiro/android-tests/tree/master/docker-http-client](https://github.com/ksoichiro/android-tests/tree/master/docker-http-client)

(自分が知らないだけかもしれないが)
従来なら、外部のWeb APIなどと接続するテストはAPI基盤側との事情ですぐにできなかったりしたが、上記のやり方ならAPIのインタフェースさえ分かっていれば(決まっていれば)開発初期からテストできる。
(開発用の公開サーバを用意しなくても)
外部環境を含めて常に同じ状態を再現してテストできる、というのはうれしい。
しかも、Dockerが使える環境さえあればPCのセットアップに時間をかけたりしなくても すぐに同じ構成でのテストが実行できる。

## テストの内容

上記の例は、ごく簡単なJSONを固定で返すだけのもので、前回のエントリでの例と違い、これは合格するように書いてある。

## Dockerfileのポイント

HTTPサーバはポートをバインドしてデーモンとして起動する。
名前をつけておくのが重要。

```
docker run --name node -p 8080:8080 -d ksoichiro/http-mock-server
```

Androidテスト環境側では、--linkを使って上記モックサーバとリンクして起動させる。
これにより、環境変数を介してモックサーバのIPアドレスを取得できる。

```
docker run --link node:mock -i -t -v ${PROJECT_ROOT}:/workspace -w /workspace ksoichiro/android-emulator start-emulator "./gradlew :app:connectedAndroidTestIntegrationDebug"
```

## build.gradleのポイント

これはGradle (Android Plugin)ならでは、という感じだが Product Flavorを活用する。
IDEでの開発時、実機でのデバッグ実行、CI、リリース用と一貫して同じコードベースで管理するためにAPIのベースとなるURLをProductFlavorで変化させてビルドする。

上記の例ではBuildConfigへのフィールド追加機能を使っているが、これをやってしまうとAndroid Studioでの開発が必須になってしまうのでEclipseを使うメンバーがいる場合はBuildConfigのような役割を持つ別のクラスを用意する。

BuildConfigの場合は、以下のように buildConfigFieldでURL用の定数をdefaultConfigの中に定義する。

```
buildConfigField "String", "REMOTE_URL", "\"https://raw.githubusercontent.com/ksoichiro/android-tests/master/docker-http-client/web/dummy.json\""
```

これはデフォルト値なので、実際には接続先が開発・ステージング・本番などで分けて用意する必要があるかもしれない。

そして、以下がこのエントリでのメインとなるCI用の設定。
ここでは integration という Flavor を定義して、 ext.mockServer というプロパティに対して環境変数からIPアドレスを取得して設定している。

```groovy
productFlavors {
    integration {
        ext.mockServer = System.env['MOCK_PORT_8080_TCP_ADDR']
        buildConfigField "String", "REMOTE_URL", "\"http://${ext.mockServer}:8080\""
    }
    production {
    }
}
```

上記のDockerfileの書き方でサーバを起動しておき(--name node)、リンクして(--link node:mock)起動すると、linkした側ではMOCK\_〜という名前の環境変数で接続先のコンテナの情報がとれる。
/etc/hostsが編集できれば良いのだが、読み取り専用で変更ができないため(これは解決方法があるのかも？)この環境変数からIPアドレスを取得してURLに埋め込む。
ちなみに $System.env.MOCK\_PORT\_8080\_TCP\_ADDRで取得することもできるがdeprecatedのようなのでextを使った方が良さそう。

もう一つのポイントは、BuildTypeでなくProductFlavorを使う、ということ。
エミュレータを使ってテストする場合、Gradle Android PluginではconnectedAndroidTestのタスクを使うことになるが、これは debug の BuildType で実行することになる。
そのため、

```groovy
buildTypes {
    debug {
        buildConfigField ...
    }
}
```

としてしまうと実機につないでテストする場合でもDockerでテストする場合でも同じconnectedAndroidTestのタスクを使うことになる。
つまり実機でも MOCK\_PORT\_8080\_TCP\_ADDR を使おうとしてしまう。

そうではなく、CI専用の設定を作るためには ProductFlavor を使う。
上記のように ProductFlavor として integration, production と定義すれば、

```
connectedAndroidTestconnectedAndroidTestIntegrationDebugconnectedAndroidTestProductionDebug
```

というタスクが定義される。
CIの場合は connectedAndroidTestIntegrationDebug を使い、
実機の場合は connectedAndroidTestProductionDebug を使えば良い。

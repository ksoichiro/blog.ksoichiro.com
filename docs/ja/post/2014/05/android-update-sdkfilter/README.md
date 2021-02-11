---
title: "android update sdkのfilterで指定できる項目名の確認方法"
created: 2014-05-10T16:56:00.001+09:00
tags: ["Travis CI","Android SDK","Android"]
---
[Travis CI](https://travis-ci.org)でビルドする場合などでは
コマンドラインでAndroid SDKをアップデートする必要がある。
この場合、

```sh
android update sdk --filter platform-tools
```

などとすると、必要な項目だけをフィルタリングしてインストールすることができる。

これまで、`filter`に使える名前として、ブログなどで使われている例を
そのまま試していたものの、新しい項目をインストールしたくなった場合
他に何の項目が使えるのかが分からず
`.travis.yml`に何と書いてよいか分からず困った。

これを解決するには、以下で確認する。

```sh
android list sdk --all --extended
```

<!--more-->

`--all`をつけないと、実行した環境でインストール
またはアップデート可能なものしか表示されないため、
SDK Managerで手動インストール済みの項目が表示されない。

`--extended`をつけることで、各項目の詳細情報が表示され、
`android update sdk --filter`で指定する名前(`platform-tools`など)
を確認することができる。

`--all`の場合の出力例：

```sh
android list sdk --all
Refresh Sources:
  Fetching https://dl-ssl.google.com/android/repository/addons_list-2.xml
  Validate XML
  Parse XML
:
(略)
:
Packages available for installation or update: 97
   1- Android SDK Tools, revision 22.6.3
   2- Android SDK Platform-tools, revision 19.0.1
   3- Android SDK Build-tools, revision 19.0.3
   4- Android SDK Build-tools, revision 19.0.2
   5- Android SDK Build-tools, revision 19.0.1
   6- Android SDK Build-tools, revision 19
   7- Android SDK Build-tools, revision 18.1.1
   8- Android SDK Build-tools, revision 18.1
   9- Android SDK Build-tools, revision 18.0.1
:
```

`--extends`の場合の出力例：

```sh
android list sdk --all --extended
Refresh Sources:
  Fetching https://dl-ssl.google.com/android/repository/addons_list-2.xml
  Validate XML
  Parse XML
  :
  (略)
  :
Packages available for installation or update: 97
----------
id: 1 or "tools"
     Type: Tool
     Desc: Android SDK Tools, revision 22.6.3
----------
id: 2 or "platform-tools"
     Type: PlatformTool
     Desc: Android SDK Platform-tools, revision 19.0.1
----------
id: 3 or "build-tools-19.0.3"
     Type: BuildTool
     Desc: Android SDK Build-tools, revision 19.0.3
:
```

---
title: "[iOS][Xcode] OCLintでXcode5プロジェクトのObjective-Cソースコードを静的解析"
created: 2014-02-28T23:52:00.003+09:00
tags: ["ビルド","iOS","静的解析","CMake","OCLint","Xcode","xctool"]
---
Xcodeでは標準でもAnalyzeでClangによる静的解析ができますが、OCLintというツールでさらに多くのチェックができます。
[http://oclint.org/](http://oclint.org/)

Xcode 5.0.2で試したところ、上記サイトで説明されている手順では導入できず苦戦したので、うまくいった手順を記録しておきます。

まず、環境です。
マシン：Mac Book Air
OS：OS X 10.9.1
Xcode：Xcode 5.0.2

以下を導入していきます。
（このうち自分の環境で元から入っていたものの導入手順は割愛します）
OCLint：0.8
xctool：0.1.14
CMake：2.8.12.2
Python：2.7.5
Git：1.8.3.4
Subversion：1.7.6

では、導入手順です。

### xctoolインストール

OCLintのサイトで説明されている、Xcodeでビルドする場合の例を辿っていくとこれが必要なことが分かります。
[https://github.com/facebook/xctool](https://github.com/facebook/xctool)
下記から、最新のバージョン(Latest Release)をダウンロードします。
[https://github.com/facebook/xctool/releases](https://github.com/facebook/xctool/releases)
解凍して、
/usr/local/xctool-v0.1.14
というパスになるように配置します。

### CMakeインストール

CMakeサイトからインストーラをダウンロードします。
http://www.cmake.org/cmake/resources/software.html
自分の場合は Mac OS X 64/32-bit Universal (for Intel, Snow Leopard/10.6 or later)をダウンロードしました。
dmg形式でダウンロードして、実行してインストールします。
インストール場所は/usr/local/binとしました。
※最初、brew install cmakeでインストールしましたが、OCLintのビルドが失敗してしまいました。

### OCLintインストール

現時点でのMac向けの最新バイナリは0.7でしたが、これではXcode5.0.2でのビルドが失敗しました。
UIKit等、ライブラリの部分で大量にエラーが発生します。
そこで、Githubからcloneして最新のrelease\_08ブランチからビルドしました。

```
$ git clone git@github.com:oclint/oclint.git
$ cd oclint
$ git checkout release_08
$ cd oclint-scripts
$ ./make
```

これでビルドできます。
警告は沢山出ましたが、ビルドはできています。
(HomebrewでインストールしたCMakeでは、wchar.h等のヘッダファイルが見つからずビルドに失敗しました。)

OCLintサイトでの説明の通り、ビルドできたか検証します。

```
$ cd ..
$ ./build/oclint-0.8.dev.c1da4cc/bin/oclint-0.8
oclint-0.8: Not enough positional command line arguments specified!
Must specify at least 1 positional arguments: See: ./build/oclint-0.8.dev.c1da4cc/bin/oclint-0.8 -help
```

ビルドした結果をコピーします。ここでは/usr/localへコピーします。

```
$ cd build
$ cp -pR oclint-0.8.dev.c1da4cc /usr/local/
```

ここまでで、OCLintに必要なものが揃いました。

### Xcodeプロジェクトでの利用

Xcode 5.0.2で新規にプロジェクトを作成します。
Target「OCLint」を追加します。
iOS > Other > Aggregateで作成します。

Build Phasesを表示して、メニューの Editor > Add Build Phase > Add Run Script Build Phase を選択して Build Phase を作成します。

以下のようなスクリプトを貼付けます。
xctoolとOCLintのパスの指定はもっと良いやり方があると思いますが、ここではベタで書いてしまいます。

```
XCTOOL=/usr/local/xctool-v0.1.14
export PATH=$XCTOOL/bin:$PATH
OCLINT_HOME=/usr/local/oclint-0.8.dev.c1da4cc
export PATH=$OCLINT_HOME/bin:$PATH

cd ${SRCROOT}

xctool -project LintTest.xcodeproj -scheme LintTestForLint -reporter json-compilation-database:compile_commands.json clean
xctool -project LintTest.xcodeproj -scheme LintTestForLint -reporter json-compilation-database:compile_commands.json build

oclint-json-compilation-database | sed 's/\(.*\.\m\{1,2\}:[0-9]*:[0-9]*:\)/\1 warning:/'
```

貼り付け後の画面は以下です。

[![](http://4.bp.blogspot.com/-6P36PzvisRk/UxCdK00EbaI/AAAAAAAAMe4/DYpdxejzHXE/s1600/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2014-02-28+22.44.41.png)](http://4.bp.blogspot.com/-6P36PzvisRk/UxCdK00EbaI/AAAAAAAAMe4/DYpdxejzHXE/s1600/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2014-02-28+22.44.41.png)

「-project」で指定しているのは、ビルド使用としているプロジェクトです。適宜名前を変更してください。
「-scheme」で指定しているのは、対象となる Scheme です。
プロジェクト作成時に用意されているSchemeでは、うまくいきません。
iOS 7 SDK内でUnknown architecture などのエラーが大量に発生します。

この原因、よく分かっていませんがどうやらarm64アーキテクチャをうまく認識していないことによるもののようです。

そこで、Lint用のTargetを作り、arm64アーキテクチャを対象外にしてやることで回避します。
最初、OCLint Targetのアーキテクチャを調整していましたが、OCLint TargetはOCLintを実行するだけであり、プロジェクト自体をビルドするTargetではないので間違いです。
ビルドに使われるTargetでアーキテクチャを変える必要があります。

ここでは、通常のビルドで使うTargetはそのままにし、プロジェクト作成時にできているTargetをDuplicateします。
(アーキテクチャを減らしてビルドするので、Lint専用のものとして用意した方が良いと思います。)
名前は適当なものに変更します。
この操作で、SchemeもDuplicateされているので、Manage SchemesからSchemeの一覧を表示して名前を適当に変更します。
(ここで変更した名前が、上記Scriptでの「-scheme」に指定する名前です。)

DuplicateしたTargetのBuild Settingsを開き、このTargetのArchitecturesを
「Standard architectures(armv7, armv7s)」に変更します。
※プロジェクトのArchitecturesを変えないように注意

[![](http://3.bp.blogspot.com/-rtTPN3VsafI/UxCd-3YIdeI/AAAAAAAAMfE/cXrqLZ7qQ2M/s1600/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2014-02-28+22.45.33.png)](http://3.bp.blogspot.com/-rtTPN3VsafI/UxCd-3YIdeI/AAAAAAAAMfE/cXrqLZ7qQ2M/s1600/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2014-02-28+22.45.33.png)

そして、このTargetをビルド対象にしているSchemeをOCLint TargetのScriptで「-scheme」に設定します。

ここまでできたら、後はOCLint Schemeを選択してビルドです。
すると、以下のように自動生成のままのソースコードでも見事に警告だらけになるはずです。

[![](http://3.bp.blogspot.com/-MwLMtJe7m64/UxCc11BW2pI/AAAAAAAAMew/UNZJZVfecFc/s1600/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2014-02-28+22.43.22.png)](http://3.bp.blogspot.com/-MwLMtJe7m64/UxCc11BW2pI/AAAAAAAAMew/UNZJZVfecFc/s1600/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2014-02-28+22.43.22.png)

---
title: "Android Gradle Pluginにおけるresとresourcesフォルダ"
noEnglish: true
originalCreatedAt: 2014-05-10T12:33:00.001+09:00
tags: ["Android Studio","Gradle","Android"]
---
Android Gradle Pluginでは、`sourceSets`として以下のようなものが指定できる。
<!--more-->
```groovy
android {
    sourceSets {
        main {
            manifest.srcFile 'AndroidManifest.xml'
            java.srcDirs = ['src']
            resources.srcDirs = ['src']
            aidl.srcDirs = ['src']
            renderscript.srcDirs = ['src']
            res.srcDirs = ['res']
            assets.srcDirs = ['assets']
        }
    }
}
```

ディレクトリ構造を変えたくて上記を変更しようとしたとき、上記のうち`res`と`resources`は何が違うのか？という点がすぐには分からなかったのでメモ。
[Gradle Plugin User Guide](http://tools.android.com/tech-docs/new-build-system/user-guide) には以下のように書いてある。

> To replace the default source folders, you will want to use srcDirs
> instead, which takes an array of path. This also shows a different way
> of using the objects involved:
>
> ```groovy
> sourceSets {
>     main.java.srcDirs = ['src/java']
>     main.resources.srcDirs = ['src/resources']
> }
> ```
>
> For more information, see the Gradle documentation on the Java plugin
> here.

`sourceSets`で設定できるものはすべてAndroidプラグイン独自のものなのではなくJavaプラグイン由来のものとAndroid独自のものがある。
つまり、`resources.srcDirs`はJavaでいうリソースなので`.properties`ファイルなどを配置するディレクトリのこと。

なので、Androidでいうリソースファイル(`res`フォルダ以下のXMLなど)の配置は`sourceSets.main.res.srcDirs`で設定するのが正しい。

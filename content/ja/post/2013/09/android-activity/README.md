---
title: "[Android] 最初のActivityが起動するまでの間だけスプラッシュ画面を表示する方法"
createdAt: 2013-09-16T09:28:00.001+09:00
tags: ["Android"]
---
起動後、数秒間表示するスプラッシュ画面の実装については色々解説されていますが
最初のActivityが起動するまでのわずかな時間だけ別の画像を表示する方法が
なかなか分からなかったのでメモします。
<!--more-->
ユーザからすればスプラッシュ画面は操作するまでの時間が長くなるだけなので避けるべきですが、

- Application#onCreate()で重たい処理が必要(何かのSDKの初期化等)で、Activityの起動まで時間がどうしても長くなってしまう
- ActivityのsetContentView()完了までの時間が長く、それまでの間にデフォルトのActionBarが表示されてしまうのが嫌
- アプリ内でテーマを選べるようにしたいが、Activity起動直後はデフォルトのテーマのスタイルで画面が表示されてしまうのが嫌

などなど、初期画面を表示するまでの時間だけスプラッシュを表示しておきたいという場合があると思います。 そんな場合の対処方法です。
起動直後、こんな画面を表示させます。(小さいアイコンだけで寂しいですが、サンプルですので…)

[![](http://2.bp.blogspot.com/-aRkJwtQO5rA/UjZPi9S8z0I/AAAAAAAALuk/6T103jFwM4c/s320/device-2013-09-16-092228.png)](http://2.bp.blogspot.com/-aRkJwtQO5rA/UjZPi9S8z0I/AAAAAAAALuk/6T103jFwM4c/s1600/device-2013-09-16-092228.png)

まず、アプリ全体では背景のみのテーマを設定します。
AndroidManifest.xmlのapplicationタグ(android:theme)に、起動時のみ使うテーマを設定します。
ここではAppFirstThemeとしています。

この内容は以下のようなものです。

```xml
<style name="AppFirstTheme" parent="@style/Theme.Sherlock.Light.NoActionBar">
    <item name="android:windowBackground">@drawable/splash</item>
</style>
```

ActionBarSherlockを使っているためTheme.Sherlock.Light.NoActionBarとなっていますが以下のような、ActionBarもTitleもないスタイルであれば良いはずです。

```xml
<item name="android:windowActionBar">false</item>
<item name="android:windowNoTitle">true</item>
```

以下のようなものでも良いです(このままではActionBar導入前のバージョンだとダメですが)。

```xml
<style name="AppFirstTheme" parent="android:style/Theme.Black">
    <item name="android:windowBackground">@drawable/splash</item>
    <item name="android:windowActionBar">false</item>
    <item name="android:windowNoTitle">true</item>
</style>
```

次に、windowBackgroundに設定している@drawable/splashですが、以下のようなものです。
ここでは下のbitmapに@drawable/ic\_launcherを設定していますが、これが中央に表示させる画像です。

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android" >

    <item>
        <shape android:shape="rectangle" >
            <solid android:color="#FFFFFFFF" />
        </shape>
    </item>
    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/ic_launcher" />
    </item>

</layer-list>
```

そして、Activityでは以下のようにonCreateでテーマを設定します。
このActivityについては、AndroidManifest.xmlでandroid:themeを設定しません。

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setTheme(R.style.AppTheme);
    setContentView(R.layout.activity_main);
}
```

以上です。

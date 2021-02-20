---
title: "Android ライブ壁紙設定画面の背景色"
created: 2011-02-22T21:47:00.000+09:00
tags: ["Android"]
---
以下のページを参考に、ライブ壁紙の設定画面(PreferenceActivity)を作成しました。
<!--more-->
[http://developer.android.com/resources/samples/CubeLiveWallpaper/AndroidManifest.html](http://developer.android.com/resources/samples/CubeLiveWallpaper/AndroidManifest.html)

この場合、設定画面の背景が半透明になり、後ろの画面が透けて見えます。

通常の不透明な画面にする方法を探していたのですが、AndroidManifest.xmlの以下の設定を修正するだけでした。

```
android:theme="@android:style/Theme.Light.WallpaperSettings"
```

以下のページに記載されている、Androidで提供されているテーマTheme\_Blackを使用すれば通常の黒い画面になります。

[http://developer.android.com/reference/android/R.style.html](http://developer.android.com/reference/android/R.style.html)

AndroidManfest.xmlに書く場合には、Theme.Blackと「.」で区切るようです。

```
android:theme="@android:style/Theme.Black"
```

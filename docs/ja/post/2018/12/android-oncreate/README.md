---
title: "Android ナイトモードを起動時に設定するとonCreateが二度呼ばれる"
created: 2018-12-29T18:14:00.001+09:00
tags: ["Android"]
---
シンプル単語帳にナイトモードを導入してほしいリクエストがあり、
確かにあったほうが良さそうだと思ったため実装している。
(現時点ではまだリリースしていない)

ただ、どうもアプリの起動が遅くなっているように見える。
各 Activity の onCreate でナイトモードを設定するような方法で実装。

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    if (App.instance.nightModeEnabled) {
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
    } else {
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
    }
```

デバッグしてみると、これが原因で onCreate が二回呼ばれてしまい初期画面の表示が遅くなっている模様。

ナイトモードが変更されたことによって再度 onCreate が呼び出されてしまっている。

onCreate が複数回呼び出されるというところでピンとくるべきだったが、
よく調べてみると [設定変更のイベント](https://developer.android.com/guide/topics/manifest/activity-element?hl=ja#config) によって発生しているのだった。

この設定変更が必要ないなら以下のようにすると解決するが、
今回のケースではナイトモードが反映されなくなってしまう。

```xml
<activity android:name=".app.MainActivity"
    android:configChanges="uiMode">
```

というわけで、対象 Activity の onCreate をなるべく軽くしておくくらいしか対処はできなさそう。

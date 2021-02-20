---
title: "Android ioschedのDashboardLayoutをタイトルなしのダイアログで使う"
originalCreatedAt: 2011-09-23T23:53:00.002+09:00
tags: ["Google","UI","Android"]
---
Google I/Oのアプリ [iosched](http://code.google.com/p/iosched/) に含まれているDashboardLayoutをカスタムダイアログで適用しようとしましたが、タイトルバーを非表示にしたところ、レイアウトが崩れてしまいました。
DashboardLayoutを使っているActivityのレイアウトファイルをそのまま使ったわけではなく、 Fragmentを使わないように書き換えたのですが、その際に誤って削ってしまった「android:layout\_weight="1"」が原因でした。
以下、詳細のメモです。
<!--more-->
まず、最初にダイアログに使ったレイアウトです。

```xml
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:minHeight="300dp"
    android:minWidth="300dp"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent"
    android:orientation="vertical"
    android:background="@drawable/background">
    <TextView
        android:text="@string/title_a"
        android:textColor="@color/accent"
        android:layout_width="fill_parent"
        android:layout_height="wrap_content"
        android:gravity="center" />
    <com.google.android.apps.iosched.ui.widget.DashboardLayout
        android:layout_width="fill_parent"
        android:layout_height="fill_parent"
        android:layout_weight="1">
        <Button
            android:id="@+id/button_a"
            style="@style/DashboardButton"
            android:text="@string/label_button_a"
            android:drawableTop="@drawable/icon" />
        :
    </com.google.android.apps.iosched.ui.widget.DashboardLayout>
</LinearLayout>
```

これをタイトルバーありの状態で表示すると以下のようになります。
黒い空白領域ができてしまい不恰好です。
※タイトルらしい文字列を別に表示しているので紛らわしいですが、やりたいことは、デフォルトのタイトルバーを消した状態でDashboardLayoutを使うということです。

[![](http://2.bp.blogspot.com/-JVUDMqILuUg/TnyZm-n0heI/AAAAAAAAGtU/kPagwUu48Ok/s320/device-2011-09-23-232557.png)](http://2.bp.blogspot.com/-JVUDMqILuUg/TnyZm-n0heI/AAAAAAAAGtU/kPagwUu48Ok/s1600/device-2011-09-23-232557.png)

次にタイトルバーを消します。
以下のようなタイトルバー非表示のダイアログ用スタイルを定義して、ダイアログのインタンス生成時に指定します。

```xml
<style name="Theme.Dialog" parent="android:style/Theme.Dialog">
    <item name="android:windowNoTitle">true</item>
</style>
```

```java
XxxDashboardDialog dialog = new XxxDashboardDialog(this, R.style.Theme_Dialog);
```

これを表示すると、android:layout\_height="fill\_parent"が効かず、以下のように潰れてしまいます。

[![](http://1.bp.blogspot.com/-bdLPLaMgw-o/TnyapV_JiAI/AAAAAAAAGtY/mQn1zYVj9uw/s320/device-2011-09-23-232846.png)](http://1.bp.blogspot.com/-bdLPLaMgw-o/TnyapV_JiAI/AAAAAAAAGtY/mQn1zYVj9uw/s1600/device-2011-09-23-232846.png)

これは、以下のようにandroid:layout\_weightを指定することで解決しました。

```xml
<com.google.android.apps.iosched.ui.widget.DashboardLayout
    android:layout_width="fill_parent"
    android:layout_height="fill_parent"
    android:layout_weight="1">
```

以下が指定した後の表示です。

[![](http://1.bp.blogspot.com/-0H72U21_BaI/TnybppyXiNI/AAAAAAAAGtc/WIJY273v7uw/s320/device-2011-09-23-233009.png)](http://1.bp.blogspot.com/-0H72U21_BaI/TnybppyXiNI/AAAAAAAAGtc/WIJY273v7uw/s1600/device-2011-09-23-233009.png)

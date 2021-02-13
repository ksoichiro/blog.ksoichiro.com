---
title: "Android TabHostで下側にタブを表示するときにビューが隠れないようにする方法"
created: 2011-05-03T11:53:00.002+09:00
tags: ["UI","Android"]
---
\# これまであまりに一般的すぎる内容ばかり書いていたので、ある程度調べてもわからなかったこと、つまづいたことを中心に書いていきたいと思います。
<!--more-->
AndroidでTabHostによるタブを作成するとき、下側にタブを作成するにはRelativeLayoutを使う必要があるようです。
しかしこのとき、メインのビューを下一杯まで広げると、タブでビューの一部が隠れてしまいました。

RelativeLayoutを使う場合の注意ですが、相対的な配置なので、
他の要素とどのような位置関係にあるのかを指定しなくてならないようです。

上側に表示するFrameLayoutにこれを指定することで解決しました。

```
android:layout_above="@android:id/tabs"
```

FrameLayoutはTabWidgetの上にある、という指定です。

以下、全体のレイアウトです。タブのコンテンツは含まれていません。

```xml
<?xml version="1.0" encoding="utf-8"?>
<TabHost
 xmlns:android="http://schemas.android.com/apk/res/android"
 android:id="@android:id/tabhost"
 android:layout_width="fill_parent"
 android:layout_height="fill_parent">
 <RelativeLayout
  android:layout_width="fill_parent"
  android:layout_height="fill_parent"
  android:orientation="vertical">
  <FrameLayout
   android:layout_alignParentTop="true"
   android:layout_above="@android:id/tabs"
   android:id="@android:id/tabcontent"
   android:layout_width="fill_parent"
   android:layout_height="fill_parent" />
  <TabWidget
   android:id="@android:id/tabs"
   android:layout_alignParentBottom="true"
   android:layout_width="fill_parent"
   android:layout_height="wrap_content" />
 </RelativeLayout>
</TabHost>
```

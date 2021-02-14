---
title: "Android ListViewがクリックできない原因の一例"
created: 2012-03-31T12:03:00.001+09:00
tags: ["UI","Android"]
---
ListViewをカスタマイズして以下のような行のレイアウトを作成しましたが、
クリックできなくなってしまいました。
ListView#setOnItemClickListener()を使っても、クリックのイベントに反応しなくなったのです。
しかしなぜか ListView#setOnItemLongClickListener() は有効でした。
<!--more-->
レイアウトは以下です。

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="?android:attr/listPreferredItemHeight"
    android:padding="2dp">

    <TextView
        android:id="@+id/title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentLeft="true"
        android:textSize="18sp" />

    <TextView
        android:id="@+id/updated_at"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentRight="true" />

    <TextView
        android:id="@+id/content"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true"
        android:layout_below="@id/title"
        android:inputType="text" />

</RelativeLayout>
```

試行錯誤した挙げ句、原因は最後の TextView に指定している android:inputType だとわかりました。
これが設定されていると、この TextView が focusable になり、ListViewではクリックイベントを拾えなくなるようです。

対策は、以下のように focusable="false" とすることです。
これで、ListView#setOnItemClickListener() が有効になります。

```xml
<TextView
    android:id="@+id/content"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_alignParentBottom="true"
    android:layout_below="@id/title"
    android:inputType="text"
    android:focusable="false"  />
```

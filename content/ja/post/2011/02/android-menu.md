---
title: "Android Menuサンプル"
noEnglish: true
originalCreatedAt: 2011-02-19T21:45:00.001+09:00
tags: ["サンプル","Android"]
---
メニューのサンプルを作成しました。
<!--more-->
実行イメージ：

[![](/img/2011-02-android-menu_1.png)](/img/2011-02-android-menu_1.png)

[![](/img/2011-02-android-menu_2.png)](/img/2011-02-android-menu_2.png)

構成：

```
├─res
│  ├─drawable-hdpi
│  │      icon.png
│  │      ic_light.png
│  ├─drawable-ldpi
│  │      icon.png
│  │      ic_light.png
│  ├─drawable-mdpi
│  │      icon.png
│  │      ic_light.png
│  ├─layout
│  │      main.xml
│  ├─menu
│  │      sample_menu.xml
│  ├─values
│  │      strings.xml
│  └─values-ja
│          strings.xml
└─src
    └─com
        └─example
            └─menu
                    MenuSample.java
```

ソースコード：

MenuSample.java

```java
package com.example.menu;

import android.app.Activity;
import android.content.res.Resources;
import android.os.Bundle;
import android.text.Html;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.widget.Toast;

public class MenuSample extends Activity {
  /** Called when the activity is first created. */
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.main);
  }

  @Override
  public boolean onCreateOptionsMenu(Menu menu) {
    MenuInflater inflator = getMenuInflater();
    inflator.inflate(R.menu.sample_menu, menu);
    return true;
  }

  @Override
  public boolean onOptionsItemSelected(MenuItem item) {
    Resources res = getResources();
    switch (item.getItemId()) {
    case R.id.add:
    case R.id.info:
      Toast.makeText(
        this,
        Html.fromHtml(String.format(res.getString(R.string.selected_message),
          item.getTitle())), Toast.LENGTH_SHORT).show();
      return true;
    default:
      return super.onOptionsItemSelected(item);
    }
  }
}
```

main.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
 android:orientation="vertical" android:layout_width="fill_parent"
 android:layout_height="fill_parent">
 <TextView android:layout_width="fill_parent"
  android:layout_height="wrap_content" android:text="@string/hello" />
 <ListView android:id="@+id/ListView01" android:layout_width="wrap_content"
  android:layout_height="wrap_content"></ListView>
</LinearLayout>
```

sample\_menu.xml

```xml
<?xml version="1.0" encoding="utf-8" ?>
<menu xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:id="@+id/add" android:title="@string/add">
        <menu>
            <item android:id="@+id/plan" android:title="@string/plan" />
            <item android:id="@+id/result" android:title="@string/result" />
        </menu>
    </item>
    <item android:id="@+id/info" android:title="@string/info" android:icon="@drawable/ic_light" />
</menu>
```

values/strings.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="hello">Hello World, MenuSample!</string>
    <string name="app_name">MenuSample</string>
    <string name="add">Add</string>
    <string name="info">Info</string>
    <string name="plan">Plan</string>
    <string name="result">Result</string>
    <string name="selected_message"><u>The button \'%1$s\'</u> was selected.</string>
</resources>
```

values-ja/strings.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="hello">こんにちは, メニューサンプル!</string>
    <string name="app_name">メニューサンプル</string>
    <string name="add">追加</string>
    <string name="info">情報</string>
    <string name="plan">予定</string>
    <string name="result">実績</string>
    <string name="selected_message"><u>\'%1$s\'ボタン</u>が選択されました</string>
</resources>
```

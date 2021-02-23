---
title: "Android Listサンプル"
originalCreatedAt: 2011-02-19T21:24:00.000+09:00
tags: ["サンプル","Android"]
---
Androidでリスト表示をするサンプルを作成しました。
<!--more-->
実行イメージ：

[![](/img/2011-02-android-list_1.png)](/img/2011-02-android-list_1.png)

ListActivityを継承して作成します。

```java
package com.example.listviewsample;

import android.app.ListActivity;
import android.os.Bundle;
import android.widget.ArrayAdapter;

public class ListViewSampleActivity extends ListActivity {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // レイアウトは不要
        //setContentView(R.layout.main);

        // アダプタに項目を設定
        setListAdapter(new ArrayAdapter<String>(
          this,
          android.R.layout.simple_list_item_1,
          new String[]{
            "item1",
            "item2",
            "item3",
          }));
    }
}
```

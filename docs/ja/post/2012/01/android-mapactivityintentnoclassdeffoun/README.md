---
title: "Android MapActivityをIntentで起動したときにNoClassDefFoundError発生"
created: 2012-01-02T13:45:00.001+09:00
tags: ["Google Maps","Android"]
---
AndroidでGoogle Maps APIを使う場合に、次のようにIntentでMapActivityのサブクラスを起動するケースがあると思います。
<!--more-->
```java
Intent intent = new Intent().setClass(this, SampleMapActivity.class);
```

その際、別のプロジェクトからコピーしてきた場合などで、ある記述が抜けていると NoClassDefFoundErrorが発生してしまいます。 他の情報が全くなく、はまってしまったので対処方法を記録します。
解決策は下記の通りなのですが、uses-libraryでGoogle Maps APIを使っていることをAndroidManifest.xmlに明記する必要があります。
[Cannot resolve MapActivity class on Android](http://stackoverflow.com/questions/3621163/cannot-resolve-mapactivity-class-on-android)
具体的には以下のようにapplicationタグの子としてuses-libraryを書きます。

```xml
<application
    android:icon="@drawable/ic_launcher"
    android:label="@string/app_name"
    android:theme="@style/Theme" >
    <uses-library android:name="com.google.android.maps" />
```

uses-libraryがなくてもコンパイルは成功するので、注意が必要です。

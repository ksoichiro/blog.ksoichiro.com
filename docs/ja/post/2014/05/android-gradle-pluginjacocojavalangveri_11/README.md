---
title: "Android Gradle PluginでJaCoCoを有効にしてテストするとjava.lang.VerifyError発生 (2)"
created: 2014-05-11T17:08:00.001+09:00
tags: ["Gradle","JaCoCo","Android"]
---
Android Gradle PluginでJaCoCoを使ったカバレッジ計測を試したが[java.lang.VerifyErrorが発生したというエントリ](https://blog.ksoichiro.com/ja/post/2014/05/android-gradle-pluginjacocojavalangveri/)を書いた。

どうやらこの影響が及ぶのはリフレクションだけではないらしく、通常の`Intent`による起動が失敗した。
以下のようなパターンで、`testCoverageEnabled = true`となったビルドでインストールしたアプリが`java.lang.VerifyError`によりクラッシュした。
<!--more-->
まずAndroidManifest.xml。
途中は省略するが、トップ画面からメニューを開き
「About」の項目をタップすると`AboutActivity`が開き
アプリの概要が表示される、というもの。

```xml
<application
:
        <activity
                android:name=".AboutActivity"
                android:label="@string/title_activity_about" />
</application>
```

トップ画面の`MainActivity`では以下のように書いている。

```java
@Override
public boolean onOptionsItemSelected(final MenuItem menu) {
    int id = menu.getItemId();
    if (id == R.id.menu_about) {
        startActivity(new Intent(getApplicationContext(),
            AboutActivity.class));
        return true;
    }
    return false;
}
```

これが、通常のビルドなら問題なかったが上記の通りカバレッジ計測を有効にしたら失敗した。
(自動テストでなく手動で動かしても同様)

実際のプロジェクトで利用するにはまだ問題がありそうだ。。。

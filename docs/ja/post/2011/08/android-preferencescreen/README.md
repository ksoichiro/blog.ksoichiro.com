---
title: "Android PreferenceScreenのタイトルバーをカスタマイズする"
created: 2011-08-24T01:15:00.002+09:00
tags: ["Preference","UI","Android"]
---
Androidの設定画面では、PreferenceScreenをクリックすると次の階層の設定画面に進みます。
これはActivityのように思えますが、実際にはダイアログが表示されています。
<!--more-->
このタイトル部分のスタイルを変えようと思ったのですが、最初の画面だけが変更され、PreferenceScreenで遷移した先の画面のタイトルバーを変えられず、苦労したので記録しておきます。
結論から言うと、PreferenceScreenのタイトルバーはカスタマイズできず、同じような見た目・挙動になる別の方法をとりました。

まず該当部分をカスタマイズできるのか、Androidのソースコードを見てみたところ、android.preference.PreferenceScreenに以下のような記述がありました。

```java
private void showDialog(Bundle state) {
    Context context = getContext();
    if (mListView != null) {
        mListView.setAdapter(null);
    }
    mListView = new ListView(context);
    bind(mListView);

    // Set the title bar if title is available, else no title bar
    final CharSequence title = getTitle();
    Dialog dialog = mDialog = new Dialog(context, TextUtils.isEmpty(title)
            ? com.android.internal.R.style.Theme_NoTitleBar
            : com.android.internal.R.style.Theme);
    dialog.setContentView(mListView);
    if (!TextUtils.isEmpty(title)) {
        dialog.setTitle(title);
    }
    dialog.setOnDismissListener(this);
    if (state != null) {
        dialog.onRestoreInstanceState(state);
    }

    // Add the screen to the list of preferences screens opened as dialogs
    getPreferenceManager().addPreferencesScreen(dialog);
    
    dialog.show();
}
```

これを見ると、Dialogに適用されるテーマは
デフォルトのThemeかTheme\_NoTitleBarとなっていて、外から変えられません。
ではこのdialogを操作できるかというと、ローカル変数なので操作できません。
それならshowDialog()の呼び出し元をオーバーライドして書き換えてしまえば…と思いましたが、これもダメです。
PreferenceScreenはfinalなので継承できません。
つまり、PreferenceScreenのスタイルを変えたい場合は、この部分だけ変更可能にしたカスタムPreferenceScreenを作成しなくてはなりません。

これはあまり良い方法に思えませんでしたので、別の方法を探りました。
他にも方法はあるかもしれませんが、Activityを分ける方法でうまくいきました。

PreferenceActivityの本体のタイトルバーは変更できるので、PreferenceScreenの代わりにPreferenceを使い、
そのPreferenceにOnClickListenerを設定して、クリック時に次の画面のPreferenceActivityを呼び出すという方式です。

以下、具体的な方法です。( [BasicWall](https://market.android.com/details?id=com.sika524.android.livewallpaper.basicwall) に適用しています。)
ソースコードは重要な部分を抜粋・改変したものなので、そのままでは動かないかもしれません。

1. ベースとなるPreferenceActivityを作成します(FirstPreferenceActivityとします)。
2. 通常PreferenceScreenとして作成する画面を別のPreferenceActivityとして作成します(SecondPreferenceActivityとします)。
3. プリファレンスのXMLを定義します(res/xml/preferences.xmlとします)。PreferenceScreenだった部分は単純なPreferenceとして定義します。

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <PreferenceScreen ...>
      <Preference
        android:key="pref_second"
        android:title="..."
        android:summary="..." />
    :
    </PreferenceScreen>
    ```

4. PreferenceScreenの中に含めていたPreferenceの定義を別のXMLに移します(preferences\_second.xmlとします)。

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <PreferenceScreen ...>
      <ListPreference
    :
    </PreferenceScreen>
    ```

5. FirstPreferenceActivityのPreference(キーはpref\_second)をクリックしたときに、SecondPreferenceActivityを起動するようにします。

    ```java
    protected final void onCreate(final Bundle savedState) {
      :
      addPreferencesFromResource(R.xml.preferences);
      Preference pref = findPreference("pref_second");
      pref.setOnPreferenceClickListener(new Preference.OnPreferenceClickListener() {
        @Override
        public boolean onPreferenceClick(final Preference preference) {
          startActivity(new Intent(FirstPreferenceActivity.this,
                                    SecondPreferenceActivity.class));
          return true;
        }
      });
    }
    ```

6. SecondPreferenceActivityでは、普通のPreferenceActivityと同様にXMLからプリファレンスを読み込みます。

    ```java
    protected final void onCreate(final Bundle savedState) {
      :
      addPreferencesFromResource(R.xml.preferences_second);
      :
    }
    ```

7. 各アクティビティをAndroidManifest.xmlに登録します。

    ```xml
    <application ..>
        <activity android:label="First preferences" android:name=".FirstPreferenceActivity" android:exported="true">
          <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.DEFAULT" />
          </intent-filter>
        </activity>
        <activity android:label="Second preferences" android:name=".SecondPreferenceActivity" android:exported="true">
          <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.DEFAULT" />
          </intent-filter>
        </activity>
        :
    ```

8. 各PreferenceActivityに適用するタイトルバーのスタイルを、テーマとして定義します。例えば、res/values/styles.xmlに以下のように書きます。

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <resources>
      <style name="CustomTheme.Black" parent="@android:style/Theme.Black">
        <item name="android:windowTitleBackgroundStyle">@style/WindowTitleBackground</item>
        <item name="android:windowTitleStyle">@style/WindowTitle</item>
        <item name="android:windowTitleSize">45dip</item>
      </style>

      <style name="WindowTitleBackground">
        <item name="android:background">@drawable/title_background</item>
      </style>

      <style name="WindowTitle">
        <item name="android:singleLine">true</item>
        <item name="android:textAppearance">@style/TextAppearance.WindowTitle</item>
        <item name="android:shadowColor">#BB000000</item>
        <item name="android:shadowRadius">2.75</item>
        <item name="android:paddingLeft">10dip</item>
        <item name="android:typeface">sans</item>
      </style>

      <style name="TextAppearance.WindowTitle" parent="@android:style/TextAppearance.WindowTitle">
        <item name="android:textColor">#fff</item>
        <item name="android:textSize">18sp</item>
        <item name="android:textStyle">bold</item>
      </style>
    </resources>
    ```

9. 上記のようにスタイルを定義しているときは、グラデーションをDrawableとして作成する必要があります。上記に合わせるとres/drawable/title\_background.xmlです。

    ```xml
    <shape
      xmlns:android="http://schemas.android.com/apk/res/android"
      android:shape="rectangle">
      <gradient
        android:startColor="#FF444444"
        android:endColor="#FF222222"
        android:angle="270" />
    </shape>
    ```

10. テーマをアプリケーション全体もしくはアクティビティに適用します。
    アプリケーション全体なら以下のようにします。

    ```xml
    <application android:icon="@drawable/icon" android:label="@string/app_name" android:theme="@style/CustomTheme.Black">
    ```


これで、階層化されたプリファレンスのタイトルバーを全てカスタマイズできるはずです。
(もちろん、この方法ならタイトルバー以外もカスタマイズできるはずです。)

(完成版のイメージは、 [BasicWall](https://market.android.com/details?id=com.sika524.android.livewallpaper.basicwall) をダウンロードしてご確認いただけると嬉しいです。)

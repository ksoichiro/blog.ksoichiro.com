---
title: "Android (ソースコード掲載) SlidingDrawerでwrap_contentを効かせつつ表示/非表示での高さを切り替える"
created: 2011-05-04T00:36:00.000+09:00
tags: ["UI","Android"]
---
SlidingDrawerを使って、「Gmailアプリでチェックボックスにチェックを入れたときに表示されるボタン群」のようなものをきれいに実現する方法です。

完成イメージと、それに至るまでの問題は以下で説明しました。
[Android SlidingDrawerでwrap\_contentを効かせつつ表示/非表示での高さを切り替える](http://ksoichiro.blogspot.com/2011/05/android-slidingdrawerwrapcontent.html)

ソースコードをとりあえず載せます。
また長いので、解説は改めて投稿します…。

まずはレイアウトです。

res/layout/main.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout
 xmlns:android="http://schemas.android.com/apk/res/android"
 android:layout_width="fill_parent"
 android:layout_height="fill_parent"
 android:orientation="vertical">
 <Button
  android:id="@+id/button_open"
  android:text="ドロワーを開く"
  android:layout_alignParentTop="true"
  android:layout_width="fill_parent"
  android:layout_height="wrap_content" />
 <Button
  android:id="@+id/button_close"
  android:text="ドロワーを閉じる"
  android:layout_width="fill_parent"
  android:layout_height="wrap_content"
  android:layout_below="@id/button_open" />
 <ScrollView
  android:layout_width="fill_parent"
  android:layout_height="fill_parent"
  android:layout_below="@id/button_close"
  android:layout_above="@+id/drawer"
  android:fadeScrollbars="false">
  <TextView
   android:id="@+id/text"
   android:layout_width="fill_parent"
   android:layout_height="fill_parent" />
 </ScrollView>
 
 <!-- layout_height="wrap_content"が有効なSlidingDrawer -->
 <com.blogspot.ksoichiro.sample.slidingdrawer.WrappingSlidingDrawer
  android:id="@+id/drawer"
  android:layout_width="fill_parent"
  android:layout_height="wrap_content"
  android:orientation="vertical"
  android:handle="@+id/handle"
  android:content="@+id/content"
  android:layout_alignParentBottom="true">
  <LinearLayout
   android:layout_width="fill_parent"
   android:layout_height="wrap_content"
   android:id="@id/handle" />
  <LinearLayout
   android:id="@id/content"
   android:layout_width="fill_parent"
   android:layout_height="wrap_content"
   android:background="#FFFFFF"
   android:orientation="vertical">
   <Button
    android:text="ダミーボタン1"
    android:layout_width="fill_parent"
    android:layout_height="wrap_content" />
   <Button
    android:text="ダミーボタン2"
    android:layout_width="fill_parent"
    android:layout_height="wrap_content" />
  </LinearLayout>
 </com.blogspot.ksoichiro.sample.slidingdrawer.WrappingSlidingDrawer>
</RelativeLayout>
```

res/values/string.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">SlidingDrawerSample</string>

    <!-- 長文 - 夏目漱石「私の個人主義」より http://lipsum.sugutsukaeru.jp/index.cgi -->
    <string name="long_text">君はほか大分この安心方についてのの上を退けならで。なお当時に講演方もとにかくある講演べきんだけに掘りてありたには自覚読まましうから、わざわざには合ったたませな。
事が合っなけれのはよく一遍をもしませですます。ぼうっと大森さんに留学働更に相違が考えるた魚この教授どこか発展でという今答弁でたたんが、その今は私か先生町内をするて、岡田さんののの騒ぎの私をよく大約束と違ってこれ常にご返事に知っようにむしろご修養が読んたろないから、たしか何だか参考を断わろだろと行くずものに経るたで。ただまたは不欄をし事も更に高等としんから、漠然たる先輩がは欠けないからという態度へ連ればなりたざる。そうしたうち主義の中その学校はこれごろをするんかと木下君からしませた、態度の事実たとしてお発展ましなかっですば、がたのうちに兄へ今までの学校がたくさん云いからいが、どうの結果に考えてその限りをどうも云っますですとかれますのますば、ないでうてまだお他あるなかっのうでしょで。
それで義務か立派か相違がしですて、ほか中兄に断っているべきためのお授業の今からさないませ。前がもすでにあるばするでしょだったたが、けっしてもし用いて講義はそうないです訳だ。例えばご欠乏が出来がはいですのましょて、主義へも、もしいつかいうて祈るれですなしれならだろと申すから、人は知れからいまします。余計始めてはいよいよ馳といういらっしゃるですて、どこには結果末かもおれの大矛盾はないする下さいうた。
あなたもとうとう公言の方をお準備もあるているだたらしたと、一二の順々をいろいろするたという成就なば、またある辺のつまりを云いられて、私かにそれの国家を納得になりので来なものだたとらく食っから破壊焼いみだない。騒ぎでだから嘉納さんをまたそう廻ったのですでしょです。
大森さんはどう肩が知れてあるた事なですべき。[終わり]
    </string>
</resources>
```

画面のアクティビティです。

MainActivity.java

```java
package com.blogspot.ksoichiro.sample.slidingdrawer;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends Activity implements OnClickListener {

    private WrappingSlidingDrawer drawer;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        // スクロールするように長文を設定
        ((TextView) findViewById(R.id.text)).setText(getString(R.string.long_text));

        // ドロワーを操作するためボタンのリスナーを設定
        ((Button) findViewById(R.id.button_open)).setOnClickListener(this);
        ((Button) findViewById(R.id.button_close)).setOnClickListener(this);

        this.drawer = (WrappingSlidingDrawer) findViewById(R.id.drawer);
    }

    @Override
    public void onClick(View view) {
        int id = view.getId();
        if (id == R.id.button_open) {
            // ドロワーをアニメーションしながら開く
            drawer.animateOpen();
        } else if (id == R.id.button_close) {
            // ドロワーをアニメーションしながら閉じる
            drawer.animateClose();
        }
    }
}
```

最後に、SlidingDrawerのラッパークラスです。

```java
package com.blogspot.ksoichiro.sample.slidingdrawer;

import android.content.Context;
import android.util.AttributeSet;
import android.view.View;
import android.widget.SlidingDrawer;

/**
 * wrap_content指定で正しく大きさを計算するSlidingDrawer.
 * ドロワーが閉じているときはサイズを0にする.
 * アニメーションで閉じた時も再レイアウトする.
 * 
 * http://stackoverflow.com/questions/3654492/android-can-height-of-slidingdrawer-be-set-with-wrap-content/4265553#4265553
 */
public class WrappingSlidingDrawer extends SlidingDrawer implements
    SlidingDrawer.OnDrawerCloseListener {

    private boolean mVertical;
    private int mTopOffset;
    private OnDrawerCloseListener mOnDrawerCloseListener;

    /**
     * WrappingSlidingDrawerが閉じたときの通知をうけるためのリスナー.
     * SlidingDrawerではanimateClose()によるクローズが終わったあとに
     * 再描画されないため、オーバーライドして新しいリスナーを用意.
     */
    public interface OnDrawerCloseListener {
        public void onDrawerClosed();
    }

    public WrappingSlidingDrawer(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);

        int orientation =
            attrs.getAttributeIntValue("android", "orientation", ORIENTATION_VERTICAL);
        mTopOffset = attrs.getAttributeIntValue("android", "topOffset", 0);
        mVertical = (orientation == SlidingDrawer.ORIENTATION_VERTICAL);

        // 自身がクローズ通知を受ける
        setOnDrawerCloseListener(this);
    }

    public WrappingSlidingDrawer(Context context, AttributeSet attrs) {
        super(context, attrs);

        int orientation =
            attrs.getAttributeIntValue("android", "orientation", ORIENTATION_VERTICAL);
        mTopOffset = attrs.getAttributeIntValue("android", "topOffset", 0);
        mVertical = (orientation == SlidingDrawer.ORIENTATION_VERTICAL);

        // 自身がクローズ通知を受ける
        setOnDrawerCloseListener(this);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        // ドロワーが閉じているときはサイズを0にする
        if (!isOpened()) {
            setMeasuredDimension(0, 0);
            return;
        }

        int widthSpecMode = MeasureSpec.getMode(widthMeasureSpec);
        int widthSpecSize = MeasureSpec.getSize(widthMeasureSpec);

        int heightSpecMode = MeasureSpec.getMode(heightMeasureSpec);
        int heightSpecSize = MeasureSpec.getSize(heightMeasureSpec);

        if (widthSpecMode == MeasureSpec.UNSPECIFIED || heightSpecMode == MeasureSpec.UNSPECIFIED) {
            throw new RuntimeException("SlidingDrawer cannot have UNSPECIFIED dimensions");
        }

        final View handle = getHandle();
        final View content = getContent();
        measureChild(handle, widthMeasureSpec, heightMeasureSpec);

        if (mVertical) {
            int height = heightSpecSize - handle.getMeasuredHeight() - mTopOffset;
            content.measure(widthMeasureSpec, MeasureSpec.makeMeasureSpec(height, heightSpecMode));
            heightSpecSize = handle.getMeasuredHeight() + mTopOffset + content.getMeasuredHeight();
            widthSpecSize = content.getMeasuredWidth();
            if (handle.getMeasuredWidth() > widthSpecSize)
                widthSpecSize = handle.getMeasuredWidth();
        } else {
            int width = widthSpecSize - handle.getMeasuredWidth() - mTopOffset;
            getContent().measure(
                MeasureSpec.makeMeasureSpec(width, widthSpecMode),
                heightMeasureSpec);
            widthSpecSize = handle.getMeasuredWidth() + mTopOffset + content.getMeasuredWidth();
            heightSpecSize = content.getMeasuredHeight();
            if (handle.getMeasuredHeight() > heightSpecSize)
                heightSpecSize = handle.getMeasuredHeight();
        }

        setMeasuredDimension(widthSpecSize, heightSpecSize);
    }

    @Override
    public void onDrawerClosed() {
        // 再レイアウト
        invalidate();
        requestLayout();

        // リスナーが設定されていれば通知
        if (this.mOnDrawerCloseListener != null) {
            this.mOnDrawerCloseListener.onDrawerClosed();
        }
    }

    public void setOnDrawerCloseListener(OnDrawerCloseListener onDrawerCloseListener) {
        this.mOnDrawerCloseListener = onDrawerCloseListener;
    }
}
```

---
title: "Android (ソースコード解説) SlidingDrawerでwrap_contentを効かせつつ表示/非表示での高さを切り替える"
created: 2011-05-04T01:08:00.001+09:00
tags: ["UI","Android"]
---
SlidingDrawerを使って、「Gmailアプリでチェックボックスにチェックを入れたときに表示されるボタン群」のようなものをきれいに実現する方法です。

ソースコードのポイントを解説します。

※完成イメージと、それに至るまでの問題は以下で説明しました。
[Android SlidingDrawerでwrap\_contentを効かせつつ表示/非表示での高さを切り替える](http://ksoichiro.blogspot.com/2011/05/android-slidingdrawerwrapcontent.html)

※ソースコードは以下に掲載しました。
[Android (ソースコード掲載) SlidingDrawerでwrap\_contentを効かせつつ表示/非表示での高さを切り替える](http://ksoichiro.blogspot.com/2011/05/android-slidingdrawerwrapcontent_04.html)

**1\. SlidingDrawerのlayout\_height="wrap\_content"を有効にする**

onMeasure()メソッドをオーバーライドして、正しく描画領域を計算させる必要があります。

下記で説明されている通りです。
[Android: can height of SlidingDrawer be set with wrap\_content? - stackoverflow](http://stackoverflow.com/questions/3654492/android-can-height-of-slidingdrawer-be-set-with-wrap-content/4265553#4265553)

**2\. ドロワーが閉じているときにドロワーの描画領域をなしにする**

オーバーライドしたonMeasure()でドロワーの状態をisOpened()でチェックし、閉じていればサイズを0にします。

```java
@Override
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    // ドロワーが閉じているときはサイズを0にする
    if (!isOpened()) {
        setMeasuredDimension(0, 0);
        return;
    }
```

RelativeLayoutを使っているので、ドロワーのサイズに応じて通常のビューが隠れないように調整するために以下のようにlayout\_aboveを設定します。ビューの下方にドロワーがあることを知らせるものなので、これを設定しないとドロワー表示時にビューの下部が見えなくなってしまいます。

```xml
<ScrollView
 android:layout_width="fill_parent"
 android:layout_height="fill_parent"
 android:layout_below="@id/button_close"
 android:layout_above="@+id/drawer"
 android:fadeScrollbars="false">
```

**3\. ドロワーが閉じたときに再レイアウトし、空きスペースができないようにする**

ドロワーが閉じるイベントは、SlidingDrawer.OnDrawerCloseListener#onDrawerClosed()で受け取ります。

これをラッパークラス自身が処理し、invalidate()、requestLayout()で再レイアウトを要求します。

```java
public class WrappingSlidingDrawer extends SlidingDrawer implements
    SlidingDrawer.OnDrawerCloseListener {

    public WrappingSlidingDrawer(Context context, AttributeSet attrs, int defStyle) {
        :
        // 自身がクローズ通知を受ける
        setOnDrawerCloseListener(this);
    }

    public WrappingSlidingDrawer(Context context, AttributeSet attrs) {
        :
        // 自身がクローズ通知を受ける
        setOnDrawerCloseListener(this);
    }
:
    @Override
    public void onDrawerClosed() {
        // 再レイアウト
        invalidate();
        requestLayout();
    }
```

**4\. ラッパークラスの利用者にOnDrawerCloseListenerを上書きされないようにする**

これまでの状態でも動作しますが、SlidingDrawerの利用者向けに提供されているはずのOnDrawerCloseListenerをラッパー自身が利用してしまっています。

このため、利用者にWrapperSlidingDrawer#setOnDrawerCloseListener()を呼び出されるとリスナーが上書きされてしまい、WrapperSlidingDrawer#onDrawerClosed()が呼び出されなくなってしまいます。

この対策として、WrapperSlidingDrawerが新しくリスナーを提供し、setOnDrawerCloseListener()もオーバーライドします。

```java
public class WrappingSlidingDrawer extends SlidingDrawer implements
    SlidingDrawer.OnDrawerCloseListener {

    // 新しいリスナーをフィールドで保持
    private OnDrawerCloseListener mOnDrawerCloseListener;

    /** 新しいリスナー */
    public interface OnDrawerCloseListener {
        public void onDrawerClosed();
    }
:
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

    /** 新しいリスナーのSetter */
    public void setOnDrawerCloseListener(OnDrawerCloseListener onDrawerCloseListener) {
        this.mOnDrawerCloseListener = onDrawerCloseListener;
    }
}
```

以上で、目的のドロワーが実現できます。

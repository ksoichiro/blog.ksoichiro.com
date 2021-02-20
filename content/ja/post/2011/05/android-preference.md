---
title: "Android Preferenceの内容が他の項目に変わる"
createdAt: 2011-05-21T16:11:00.000+09:00
tags: ["Preference","UI","Android"]
---
カスタマイズしたPreferenceを作りました。
しばらく画面内に1つしかそのPreferenceを使っていなかったのですが、数を増やしたところおかしなことになりました。
<!--more-->
増やしたもののうち、Dependencyを設定しているカスタムPreferenceがあるのですが依存先のチェックボックスを操作したところそのカスタムPreferenceと他のカスタムPreferenceが入れ替わる現象が起こりました。
さらに、カスタムPreferenceをタップしてダイアログを開き、OKで閉じても他の項目と表示が入れ替わってしまいます。
しかし、他の項目と思ってタップすると、開くダイアログは入れ替わり前の内容です。

Preferenceの一覧表示だけがおかしい？と見当をつけて調べたところ、原因はonBindView()にありました。

Preferenceは通常、ListViewの項目として表示されます。
(PreferenceActivityはListActivityのサブクラスです。)
ListViewの項目を表示するときはgetView()が呼び出されますが、毎回新しいオブジェクトが生成されるわけではなく非表示になったものをリサイクルして使います。

つまり、例えば
1.onCreateViewの中で現在の設定値表示用のTextViewを取得してフィールドに持つ
2.設置値が変わったらフィールドのTextViewに反映する
ということをやっていると
「実はそのTextViewは既に他の項目のものになっていて、他の項目の表示が変わる」
ということが起こります。

こうならないようにするには、onCreateView()ではなくonBindView()で各Viewの値を設定します。
また、ViewのオブジェクトはPreferenceクラス内で保持しないようにします。

以下はNG例です。
違う項目の値が変わってしまうことがあります。

```java
private TextView mTitleView;

@Override
protected View onCreateView(final ViewGroup parent) {
    final LayoutInflater inflater = (LayoutInflater) getContext()
        .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    View view = inflater.inflate(R.layout.font_preference, null);
    mTitleView = (TextView) view.findViewById(R.id.text1);
    mTitleView.setText("Initial value");
    return view;
}
:
// 値を変更したとき
mTitleView.setText("New value");
```

上記は以下のようにすれば適切に動作します。
Viewではなく、そのViewに表現する値をフィールドとして保持し、Viewへの設定はonBindViewで行います。
値を変更したときはnotifyChanged()を呼び出すことで再描画されます。

```java
private String mTitle = "Initial value";

@Override
protected View onCreateView(final ViewGroup parent) {
    final LayoutInflater inflater = (LayoutInflater) getContext()
        .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    return inflater.inflate(R.layout.font_preference, null);
}

@Override
protected void onBindView(final View view) {
    ((TextView) view.findViewById(R.id.text1)).setText(mTitle);
}
:
// 値を変更したとき
mTitle = "New value";
notifyChanged();
```

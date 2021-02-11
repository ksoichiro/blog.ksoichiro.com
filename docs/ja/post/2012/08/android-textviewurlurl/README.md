---
title: "Android TextViewのURLをリンクにしつつURL以外もクリック可能にする"
created: 2012-08-19T20:43:00.000+09:00
tags: ["LinkMovementMethod","TextView","URLSpan","UI","Android"]
---
TextViewに含まれるURLをリンクにして、クリックするとブラウザでリンク先を表示するケースはよくあると思います。
それに加えて、URL以外の場所をクリックした場合はそのイベントを拾いたかったのですが、なかなかその方法が見つからず苦労したので、ここに整理したものを公開します。
同じことをされたい方がいらっしゃいましたらどうぞご利用ください。(LinkUtils.java)
※もう一つのActivityは使用例です。
[https://gist.github.com/3394338](https://gist.github.com/3394338)
上記の抜粋ですが、使い方は以下のようになります。

```java
String testStr = "URLの形式のみブラウザで開きます。http://www.yahoo.co.jp/とhttp://d.hatena.ne.jp/をリンク表示にしてクリック可能にしました。";

TextView textView = new TextView(this);
textView.setText(testStr);
LinkUtils.autoLink(textView, new LinkUtils.OnClickListener() {
    @Override
    public void onLinkClicked(final String link) {
        Log.i("SensibleUrlSpan", "リンククリック:" + link);
    }

    @Override
    public void onClicked() {
        Log.i("SensibleUrlSpan", "ビュークリック");
    }
});
```

文字列を設定したTextViewを渡して、LinkUtils.autoLink()を呼び出します。 単にURLをリンクにするのであればこれだけで動きます。
URLがクリックされたときと、その他の場所がクリックされたときをハンドリングする場合は、第２引数に専用のリスナーを設定します。
URLとして認識される文字列はLinkUtilsの中に正規表現で持っていますが、autoLink()の第３引数で変更可能です。
内容としては、内部でURLSpanとLinkMovementMethodを継承したクラスを作り、リンクがクリックされたかどうかを検知できるようにして実現しています。

以下を参考にさせて頂きました。ありがとうございます。

[http://www.techmaru.net/wordpress/20101015/textviewlink/](http://www.techmaru.net/wordpress/20101015/textviewlink/)

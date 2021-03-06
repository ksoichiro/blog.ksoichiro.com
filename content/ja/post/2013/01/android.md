---
title: "Android 入力チェックライブラリ"
noEnglish: true
originalCreatedAt: 2013-01-12T08:17:00.000+09:00
tags: ["ライブラリ","Android","AndroidFormEnhancer"]
---
Androidアプリ用の入力チェックのライブラリを作りました。
[AndroidFormEnhancer](https://github.com/ksoichiro/AndroidFormEnhancer)
<!--more-->
使い方ですが、まずアノテーションで入力フォームの仕様を定義します。
例えば、「名前」の入力欄を

- 必須
- 全角
- 最大20文字
- 画面上のリソースIDはR.id.textfield\_name
- エラーメッセージの項目名としてR.string.form\_nameを使う

という場合は以下のような感じでクラスを作ります。  送信ボタンを押して入力チェックする場合、以下のように書くだけでエラーメッセージのダイアログが表示されます。 onSubmitは、送信ボタンのonClickイベントで起動されるもの、と読んでください。  また、フォーカスが外れたタイミングですぐに入力チェックをしたければ、以下のように書いておくとフォーカスアウトの入力チェックが適用されます。  入力チェックのパターンは、以下のようなものを用意していますが、独自の入力チェックを追加することもできます。

- 必須
- 半角(シングルバイト)
- 半角英字
- 半角英数字
- 全角(マルチバイト)
- ひらがな
- カタカナ
- 数字
- 整数(Integer)
- 浮動小数点数(Float)
- 整数範囲
- 最大値
- 最小値
- 文字数
- 最大文字数
- 桁数(数字)
- 最大桁数(数字)
- 日付形式
- 過去日付
- メールアドレス
- 正規表現

入力項目数が多ければ多いほど、きっと威力を発揮するはずです。
サンプルアプリも入っていますので、もしご興味のある方がいればご覧下さい。
日本語のREADMEもあります。

[https://github.com/ksoichiro/AndroidFormEnhancer/blob/master/README.ja.md](https://github.com/ksoichiro/AndroidFormEnhancer/blob/master/README.ja.md)

ちなみに、入力チェック系のライブラリは他にも出てきているようですが、わざわざ作ったのは

- 機能をもっと拡充したかった
- 間違える余地のない書き方になるようにしたかった(○○と××は型を一致させる、名前を一致させる、といったような、開発者がライブラリ利用時に気をつけなければいけないことは極力減らしたい)
- 入力フォーム関連に限定したライブラリにしたかった(何か問題があったりカスタマイズしたいときに手を入れられない・入れにくいのは困るので、全体の構成、実装の仕方が全く変わってしまうものは嫌だった)
- 日本語(というより日本？)に最適化されたものにしたかった

という感じです。
(要するに自分が使いやすいものにしたかった、ということです。。。)

今後もまだまだ拡充していく予定です。

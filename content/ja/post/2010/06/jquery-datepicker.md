---
title: "jQuery DatePicker"
originalCreatedAt: 2010-06-20T16:12:00.001+09:00
tags: ["Ajax","jQuery"]
---
jQueryを使ってみましたが、日付を選択できる「DatePicker」について調べてみたところ、紹介されているサイトは少し情報が古いようだったのでまとめておきます。
<!--more-->
### jQuery+jQueryUI読み込み

以下のようにjQueryとjQueryUIのファイルを読み込みます。(ここでは1.4.2と1.8.2を使っています。jQueryUIは「Theme」を「Redmond」としてダウンロードしています。)

```html
<link href="css/redmond/jquery-ui-1.8.2.custom.css" rel="stylesheet" type="text/css"></link>
<script src="js/jquery-1.4.2.min.js" type="text/javascript"></script>
<script src="js/jquery-ui-1.8.2.custom.min.js" type="text/javascript"></script>
```

ダウンロードは以下のサイトから。

[jQueryホームページ](http://jquery.com/)

[jQueryUIダウンロードページ](http://jqueryui.com/download)

### 日本語化

次に日本語化するための「jquery.ui.datepicker-ja.js」も追加しておきます。

```html
<link href="css/redmond/jquery-ui-1.8.2.custom.css" rel="stylesheet" type="text/css"></link>
<script src="js/jquery-1.4.2.min.js" type="text/javascript"></script>
<script src="js/jquery-ui-1.8.2.custom.min.js" type="text/javascript"></script>
<script src="js/jquery.ui.datepicker-ja.js" type="text/javascript"></script>
```

jQueryのDatePickerのドキュメントページにある以下のリンクからダウンロードします。

[http://jquery-ui.googlecode.com/svn/trunk/ui/i18n/](http://jquery-ui.googlecode.com/svn/trunk/ui/i18n/)

### 利用箇所のid属性指定

該当のタグは以下のようにid属性をつけておきます。

```html
<input type="text" name="startedOn" value="2006-12-30" id="startedOn">
```

### DatePicker適用

上記のタグに対してDatePickerを適用します。

```html
<script type="text/javascript">$(function(){ $('#startedOn').datepicker();});</script>
```

### 完成

以下のようになります。普通のinputタグをクリックすると、日付を選択する小さなウィンドウが表示されます。

[![](http://1.bp.blogspot.com/_rtlYXd55yO0/TB29UMs961I/AAAAAAAAFR0/n6XFNo7cBTQ/s320/WS000030.BMP)](http://1.bp.blogspot.com/_rtlYXd55yO0/TB29UMs961I/AAAAAAAAFR0/n6XFNo7cBTQ/s1600/WS000030.BMP)

### カスタマイズ

DatePickerは様々な設定ができます。

「jquery.ui.datepicker-ja.js」に記述されていますが、「$.datepicker.setDefaults」に設定したものがデフォルトの設定として利用されます。

例えば、上記の例では元の日付のフォーマット(2010/06/20のような形式)を以下のようにして変更しています。

```js
jQuery(function($){
    $.datepicker.regional['ja'] = {
:
        dateFormat: 'yy-mm-dd', // 'yy/mm/dd'を変更
:
});
```

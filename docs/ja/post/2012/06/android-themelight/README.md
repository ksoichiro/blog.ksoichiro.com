---
title: "Android Theme.Lightでのダイアログの文字色"
created: 2012-06-12T00:46:00.003+09:00
tags: ["UI","Android"]
---
テーマに@android:style/Theme.Lightを使用すると、
背景が白の明るい配色になり、文字色は黒系の色になります。
<!--more-->
@android:style/Themeの場合は逆です。こちらの場合は問題ないのですが、 @android:style/Theme.Lightを使うときにダイアログを独自のレイアウトで組み立てると、 背景色は黒なのに、文字色も黒系(グレー)になってしまいます。
つまり、各TextViewに文字色を都度設定しなければならないようです。

これを避けるために、独自レイアウトの背景色がTheme.Lightと同じになるようテーマをカスタマイズしよう、という案を思いつきますが ダイアログの背景色を変えると、今度は標準的なAlertDialogに影響が出ます。
AlertDialog.Builder#setView()でレイアウトを変えない普通のAlertDialogの場合、 Theme.Lightを適用していても文字色が白系のまま変わらないためです。
背景白・文字白系で非常に見にくくなります。
\*AlertDialogの色を変えられるのは背景色のみのようです。

背景・文字色ともに変更ができるのはレイアウトを指定しないAlertDialogではなくレイアウトを指定したAlertDialogなのでレイアウトファイルの中で背景色と文字色両方を指定するのが正解なのだと思います。

ちなみに上記はAndroid 2.3.3とAndroid 4.0(エミュレータ)で確認しています。

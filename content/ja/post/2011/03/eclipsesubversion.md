---
title: "EclipseからSubversionリポジトリにアクセスできない"
originalCreatedAt: 2011-03-07T23:44:00.000+09:00
tags: ["eclipse","Subversion"]
---
PCを新しく購入したのですが(Windows7)、以前のPC(Windows XP)で使っていたNAS上のSVNリポジトリにEclipseからアクセスすることができませんでした。以下のようなエラーが発生してしまいます。

```
svn: Unable to open an ra_local session to URLsvn: Unable to open repository 'file:///L:/svn/～'
```
<!--more-->
原因はわかりませんが、どうやらドライブ名を記述しているのがいけないようで、以下のようにディスク名を指定するとアクセスできるようになりました。

```
file://ls-xhl479/share/svn/～
```

以下のサイトからヒントを得ました。

最初はWindows7の問題かと思いましたが、あまり関係なさそうです。

[http://www.tertullian.org/rpearse/subclipse\_windows.htm](http://www.tertullian.org/rpearse/subclipse_windows.htm)

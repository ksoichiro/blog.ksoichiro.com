---
title: "[Inkscape][Android][iOS][Mac] 全サイズのアイコンファイル生成ツール"
noEnglish: true
originalCreatedAt: 2013-09-15T16:45:00.003+09:00
tags: ["Inkscape","iOS","iPad","Mac","Android","iPhone"]
---
MacでInkscapeを使ってSVGのアイコンを作り、AndroidとiOSアプリを開発している人向けのツールを作りました。
タイトルの通り、1つのファイルから全サイズのアイコンファイルを一括生成します。
(使う人いるでしょうか…もしいればコメントなど頂けると嬉しいです。)
[https://github.com/ksoichiro/export\_icons](https://github.com/ksoichiro/export_icons)
<!--more-->
Illustratorとaiファイルや、Photoshopとpsdファイルではありません。
Inkscapeとsvgファイルです。
(GIMPとxcfファイルでもありません。)
毎回個別のサイズを入力しながらエクスポートして用途ごとにリネームしている、という方には役立つと思います。

実行するにはMac OS Xと [Inkscape](http://inkscape.org/) が必要です。
InkscapeでSVG形式のアイコンファイルを用意し、ターミナルで

```
export_icons -i Icon.svg -o output
```

と実行するとoutputディレクトリへAndroid用iOS用のアイコンを一括で作ります。
AndroidとiOSでは違うSVGを使ってる、という場合は

```
export_icons -i ic\_launcher.svg -o output -t Android
export_icons -i Icon.svg -o output -t iOS
```

とすると個別に生成できます。

詳しくは以下のREADMEをご覧下さい。
[https://github.com/ksoichiro/export\_icons/blob/master/README.ja.md](https://github.com/ksoichiro/export_icons/blob/master/README.ja.md)

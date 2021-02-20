---
title: "GitLabのページをきれいに印刷するためのChrome Extension"
originalCreatedAt: 2016-03-30T14:04:00.001+09:00
tags: ["GitLab","CoffeeScript","Chrome Extension"]
---
GitLabを使っていると、モニタを用意できない場所で打ち合わせや作業をするときに、MarkdownのドキュメントやIssueなどの内容を印刷したいシーンがある。
しかしGitLabのレイアウトは印刷用には作られていないので、印刷しようとすると余白や不要な部品だらけになってしまう。そのため、レイアウト調整をする [gitlab-print](https://github.com/ksoichiro/gitlab-print) というChrome Extensionを作った。

以下のイメージの左側のように余白がかなり入ってしまうのだが、これを除去して(右側)きれいに印刷できるようにする。

![イメージ](https://lh3.googleusercontent.com/-IygQDuaLuLo/VvtY_psv0rI/AAAAAAAAQSo/xrl44WgtyDAgPcuz5xjPiEjtuoyEgxYpA/s600/screenshot.png "screenshot.png")

<!--more-->

使い方は、印刷したいページでExtensionのボタンを押すだけ。
適用されている間は以下のように画面上部に適用されている旨が表示されるようになっている。

![適用中](https://lh3.googleusercontent.com/-Dc9VlO_q96k/VvtZi0ECywI/AAAAAAAAQS4/iJJqT_kaVVc85jweTCcjw-4z1SeODEm0w/s600/screenshot2.png "screenshot2.png")

(以下、中身の実装、設計等のメモ)

本当は印刷用なので `@media print` だけにスタイルを適用してもよかったのだが、それをやると見た目が変わらなくなり適用されているか分かりにくくなるのでやめた。

今回初めてChrome Extensionを作ったのだが、Web上の情報も豊富なので割とすんなりと作ることができた。
最初はJavaScriptで書いてみたが、ごちゃごちゃしてきそうだったので途中でCoffeeScriptに書き換えた。

jQueryを使いたかったのだが npm で管理することにし、リリース時のzip化なども考えるとビルドもnpmにしておくか、ということでnpmのscriptsを使った。
Gulpなどを使うのはやりすぎな感じがしたし、[こんなブログ](https://medium.freecodecamp.com/why-i-left-gulp-and-grunt-for-npm-scripts-3d6853dd22b8#.b2fqnm2pf)もあったのでそれでやってみることにした。

しかし`mkdir -p`とか`cp -pR`とかコマンドを組み合わせていたせいで、AppVeyorでビルドすると見事に失敗してしまった上、scriptsの中身が複雑になってきたので最終的に上のブログにもあった別のJavaScriptファイルに移してnpmのパッケージを使う方法に切り替えた。

TypeScriptなども試してみたかったが、それはまた別の機会に。

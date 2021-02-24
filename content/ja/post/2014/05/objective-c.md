---
title: "Objective-Cコードのフォーマットチェック"
noEnglish: true
originalCreatedAt: 2014-05-18T18:06:00.001+09:00
tags: ["Objective-C","iOS","静的解析","OCLint","Xcode","フォーマッタ","fint"]
---
Objective-CにはLintツールとして既にOCLintがあるが、OS Xでなくても手軽にチェックできる仕組みが欲しいと考えて作ってみた。  
[fint](https://github.com/ksoichiro/fint)
<!--more-->
以前に[Run Scriptを利用して簡単なチェックができる](/ja/post/2014/03/iosxcode-xcode/)
というエントリを書いたが、これをツールとして整備したもの。

例えば以下のように、普通のビルドエラーと同じように表示できる。  

![enter image description here][1]

ちなみにツールはGo言語製。  
Go言語環境をセットアップしてあれば、以下でインストールできる。

```sh
go get github.com/ksoichiro/fint
```

lint用のTARGETを追加し、Build Phaseを追加してRun Scriptにfintを呼び出す設定を記述する。  
以下は、設定例。

![enter image description here][2]

コマンドラインからも実行可能。  

![enter image description here][3]


  [1]: /img/2014-05-objective-c_1.png "2014-05-18 17.50.58.png"
  [2]: /img/2014-05-objective-c_2.png "2014-05-18 17.54.12.png"
  [3]: /img/2014-05-objective-c_3.png "2014-05-18 18.02.53.png"

---
title: "WindowsでRails開発するなら…"
createdAt: 2011-08-19T12:14:00.000+09:00
tags: ["Linux","Ubuntu","Ruby on Rails","VMware Player"]
---
Ruby on Railsの開発をWindowsでしようとすると、速度の遅さが気になります。
railsコマンドを使う度に数分間待たされたりして、生産性に関わる遅さです。
加えて、コマンドライン操作をすることが多いですが使えるものが限られていて、grepするためにCygwinを使っていて、ではCygwinに切り替えられないかと思うとRubyのバージョンが古い…という状況です。
<!--more-->
まず以下のサイトなどを参考にさせていただきました。
[http://tobysoft.net/wiki/index.php?Ruby%2FWindows%A4%C7Ruby%A4%AC%C3%D9%A4%A4%B7%EF](http://tobysoft.net/wiki/index.php?Ruby%2FWindows%A4%C7Ruby%A4%AC%C3%D9%A4%A4%B7%EF)
[http://d.hatena.ne.jp/miau/20110404/1301916045](http://d.hatena.ne.jp/miau/20110404/1301916045)

coLinuxを試そうと思いましたが、使っているWindows7のPCではうまくできず、別の方法を探しました。
(もう少し詳しく調べればできたかもしれませんが、64bitマシンにはインストールできないとエラーが出てしまいました。)

デュアルブートにする手もありますが、普段はWindowsで、Railsを使うときだけLinuxにしたい、と思っていたので候補から外しました。

そこではじめて試したのが、VMware Playerです。
Linuxディストリビューションは、使ってみたいと思っていたUbuntuにしました。
下記から日本語Remix CDのisoファイルをダウンロードして使いました。
[http://www.ubuntulinux.jp/products/JA-Localized/download](http://www.ubuntulinux.jp/products/JA-Localized/download)

インストールには下記の冒頭部分を参考にさせていただきました。
[http://blogs.itmedia.co.jp/kichi/2010/05/ubuntu-1004vmwa.html](http://blogs.itmedia.co.jp/kichi/2010/05/ubuntu-1004vmwa.html)

デフォルトから変えているのはメモリのサイズで、「仮想マシンの設定」の「メモリ」の部分を1024MBにしています。

その結果ですが、同じマシンとは思えないほど快適になりました。
(同じ問題を抱えている方にとってはこの言葉だけで十分な気がするのでこれ以上書きません。)
好みや慣れもあると思いますが、vim、zsh、screenを入れればかなり生産性が上がります。

Railsだけでなく、全般をUbuntuでやれないか(移行できないか)調べてみたいと思います。

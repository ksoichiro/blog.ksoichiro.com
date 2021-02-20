---
title: "Node.js での Traditional PKWARE encryption 実装の記録"
originalCreatedAt: 2018-12-31T10:08:00.001+09:00
tags: ["ライブラリ","Node.js"]
---
少し前、従来のパスワードつきのZIP圧縮(Traditional PKWARE encryption)をNode.js (Lambda)で使いたかったが、ちょうどよいものが見当たらなかったので [node-archiver-zip-encryptable](https://github.com/ksoichiro/node-archiver-zip-encryptable) というものを作成したので記録しておく。

これは [node-archiver](https://github.com/archiverjs/node-archiver) をベースにして、拡張機能的に付加することで利用する。

この archiver とその依存ライブラリが変わらない限りは、100% ピュア JavaScript の実装である。

今回の実装をするにあたり、そもそも普通に Windows で展開できるような(セキュリティ的には弱い)パスワードつきの圧縮というものに名前がついているのを知らず、調査に手間取った。

[Golang での ZIP 圧縮ライブラリ alexmullins/zip](https://github.com/alexmullins/zip) にパスワード付与を実装している [yeka/zip](https://github.com/yeka/zip) と、こちらの仕様を参考に実装。
[https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT](https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT)
<!--more-->
archiver は汎用的なアーカイブ作成のライブラリになっており、プラグインのような仕組みとして拡張子とその処理を登録することができる。これを利用して、以下のように archiver を読み込み、追加の拡張子として パスワードつき ZIP を登録する構成としている。

```js
var fs = require('fs');
var archiver = require('archiver');

archiver.registerFormat('zip-encryptable', require('archiver-zip-encryptable'));
```

あとは、archiver の API 仕様に沿って利用すれば良い (パスワードのオプションは追加で必要だが)。

```js
var output = fs.createWriteStream(__dirname + '/example.zip');

var archive = archiver('zip-encryptable', {
    zlib: { level: 9 },
    forceLocalTime: true,
    password: 'test'
});
archive.pipe(output);

archive.append(Buffer.from('Hello World'), { name: 'test.txt' });
archive.append(Buffer.from('Good Bye'), { name: 'test2.txt' });

archive.finalize();
```

実装するにあたり、実はほとんどが archiver に含まれる ZIP の実装と同じなのだが、それ自体は拡張されることを意図した構成にはなっていなかったため、既存のクラスを継承して必要な function をオーバーライドするようにした。

ZIP 形式そのものの理解ができていなかったため、実行してはバイナリエディタでバイナリの中身を確認し、仕様通りになっているかの確認を繰り返すようなデバッグをした。

ファイルの仕様を理解していくのもなかなか面白いというか、今さらではあるが以下のような気付きがあった。

- ZIP のエントリの元サイズを記述するための領域が 4 バイト(符号なし)で固定長で用意されているため、この領域で表現できる最大値＝4GB が通常の(従来の) ZIP ファイルに含められる最大サイズ。
- ZIP の各領域にはシグニチャと呼ばれる固定のバイト列があり、それを目印にして諸々の処理をするため、これを見ればファイルの内容が ZIP なのかどうかを判別することはできそう。

その他の気づき、感想。

- バイナリのバイト列を扱うため、当然ながらリトルエンディアン、ビッグエンディアンを意識しないと実装できない。こういうのを実装しないとなかなかその概念自体触れる機会がないが…
- JavaScript (Node.js) では公式には 64bit の整数値を扱う方法がない模様。これにより計算過程でオーバーフローしていることにしばらく気付かなかった…。

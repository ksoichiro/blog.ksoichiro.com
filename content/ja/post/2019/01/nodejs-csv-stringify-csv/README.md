---
title: "Node.js の csv-stringify で CSV レコード内の改行をダブルクォートで括る"
created: 2019-01-08T22:59:00.001+09:00
tags: ["npm","Node.js"]
---
Node.js で [csv-stringify](https://www.npmjs.com/package/csv-stringify) による CSV 出力をする際、項目(レコード)に何種類かの文字があった場合はダブルクォートで括るようにしたい。

csv-stringify が大体勝手にやってくれるが、現時点の最新版 v5.1.2 では改行の一部の取扱いが期待通りでなかった。

- 行のデリミタが LF なら項目内に LF が含まれているとダブルクォートで括られる。→期待通り
- 行のデリミタが CRLF なら項目内に CRLF が含まれているとダブルクォートで括られる。→期待通り
- 行のデリミタが CRLF なら項目内に LF が含まれていてもダブルクォートで括られない。→期待と異なる
<!--more-->

オプションで何とかできないだろうかと [ドキュメント](https://csv.js.org/stringify/options/) を確認したが、それらしいものが見当たらない。

ソースコードを眺めてみると、 [lib/index.js](https://github.com/adaltas/node-csv-stringify/blob/v5.1.2/lib/index.js) にある `quoted_match` が、 [正規表現でマッチした場合にクォートさせることに使えるように見える](https://github.com/adaltas/node-csv-stringify/blob/v5.1.2/lib/index.js#L395)。

npm には `Test with RunKit` のボタンがついているので、これで動作確認してみた。

まずは、行デリミタを CRLF にして、項目内に CRLF (`\r\n`) が含まれたらダブルクォートされることを確認。

```js
var stringify = require('csv-stringify');
var should = require('should');

input = [ [ '1', '2\r\nx', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ];
stringify(input,
  {
    record_delimiter: 'windows'
  },
  function(err, output){
    output.should.eql('1,"2\r\nx",3,4\r\na,b,c,d\r\n');
  });
```

次に、問題である項目内に LF (`\n`) が含まれる場合にクォートされないことを確認。

```js
input = [ [ '1', '2\r\nx', '3\ny', '4' ], [ 'a', 'b', 'c', 'd' ] ];
stringify(input,
  {
    record_delimiter: 'windows'
  },
  function(err, output){
    output.should.eql('1,"2\r\nx","3\ny",4\r\na,b,c,d\r\n');
  });
```

これは期待通り失敗した。
いよいよ `quoted_match` を使って LF が含まれたときにのみクォートさせるようにする。
LF の前に CR がなければ LF にマッチする、という否定後読みで実装してみる。

```js
input = [ [ '1', '2\r\nx', '3\ny', '4' ], [ 'a', 'b', 'c', 'd' ] ];
stringify(input,
  {
    record_delimiter: 'windows',
    quoted_match: /(?<!\r)\n/
  },
  function(err, output){
    output.should.eql('1,"2\r\nx","3\ny",4\r\na,b,c,d\r\n');
  });
```

成功。
ただ、 [クォートされる条件の部分](https://github.com/adaltas/node-csv-stringify/blob/v5.1.2/lib/index.js#L399) を見れば、いくつかのクォートされる条件のうちのいずれかに合致したらクォートされるという実装なので、行デリミタが CRLF であろうと `quoted_match` では CRLF へのマッチを回避する必要はなかった。
単純に以下で良かった。

```js
input = [ [ '1', '2\r\nx', '3\ny', '4' ], [ 'a', 'b', 'c', 'd' ] ];
stringify(input,
  {
    record_delimiter: 'windows',
    quoted_match: /\n/
  },
  function(err, output){
    output.should.eql('1,"2\r\nx","3\ny",4\r\na,b,c,d\r\n');
  });
```

というわけで、場合によってはプルリクエストだそうかなと考えたが、やりたかったことは提供されている機能で実現できることがわかった。

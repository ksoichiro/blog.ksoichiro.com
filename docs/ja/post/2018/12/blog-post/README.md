---
title: "フォーマッタの自動適用"
created: 2018-12-31T18:22:00.001+09:00
tags: ["Java","フォーマッタ","Prettier"]
---
前のエントリでも紹介した [node-archiver-zip-encryptable](https://github.com/ksoichiro/node-archiver-zip-encryptable) の開発では [Prettier](https://prettier.io) を適用したが、フォーマットの統一に注意を払わなくて済むのは非常に快適だった。
ルーツが何かは調べられていないが、過去の自分の経験の中で似たようなものには Golang の gofmt があった。
Java のプロジェクトでも適用できないものかと思ったが、 [prettier-java](https://github.com/jhipster/prettier-java) は現在 Work in Progress の状態。
<!--more-->
Eclipse など IDE でもフォーマッタはあるが、これがバージョン管理やビルドシステムと統合されて自動的に実行されるようになると、人による修正やチェックが不要になるはず。

探してみると、Google のフォーマッタ [google-java-format](https://github.com/google/google-java-format/blob/master/README.md) がメジャーなようだった。

IntelliJ や Eclipse のプラグインの他、Gradle や Maven との統合もできる模様。

あとは保存や pre-commit のタイミングで対象ファイルのみフォーマットすることができるかどうかだが、IntelliJ の場合は Reformat Code を実行しないと作動しないように見える。

pre-commitに関しては、npm を導入して Prettier と同様に husky などと組み合わせるか、上記のライブラリからもリンクされている
[google-style-precommit-hook](https://github.com/maltzj/google-style-precommit-hook) を使うのが良さそう。

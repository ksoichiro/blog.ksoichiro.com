---
title: "Spockで複数ステップのテストを書く"
noEnglish: true
originalCreatedAt: 2016-12-31T17:29:00.001+09:00
tags: ["Groovy","Spock"]
---
Spockでテストを書くとき、`setup:`, `when:`, `then:` という流れで書けば良いが複数の処理を実行し、最後の結果だけでなく途中の経過も含めてassertする場合にどうすればいいか。

単純に `when:` と `then:` を繰り返して書けばいい。
`and:` などが一見それっぽいもののようにも思えてしまうが、`and:` はこの用途ではないので注意。

```groovy
def ...() {
    setup:
    // 初期設定

    when:
    // 最初の処理

    then:
    // 最初の処理の結果をassert

    when:
    // 2つ目の処理

    then:
    // 2つ目の処理の結果をassert
}
```
<!--more-->

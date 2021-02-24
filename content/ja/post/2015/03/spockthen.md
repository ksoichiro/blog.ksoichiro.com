---
title: "Spockのthenで使える表現"
noEnglish: true
originalCreatedAt: 2015-03-28T21:40:00.001+09:00
tags: ["Spock Framework","Groovy"]
---
Groovyのテスティングフレームワーク[Spock Framework](https://code.google.com/p/spock/)ではthenの部分に合格条件を記述するが、一行で一つのbooleanを表現する必要がある。
JUnitのようにテストケース内に何を書いても良いフレームワークに慣れていると、どう書いていいかわからなかったりする。

以下に、thenに使えそうな表現をいくつか挙げてみる。
<!--more-->

#### リストに条件を満たす要素が1つ以上存在する

```groovy
list.any { 条件 }
または
list.find { 条件 } != null
```

#### リストに条件を満たす要素が1つもない

```groovy
!list.any { 条件 }
または
list.find { 条件 } == null
```

#### リストAの各要素のxの値はリストBに含まれる値のみである

```groovy
listA.every { it.x in listB }
```

#### リストの要素がすべて条件を満たす

```groovy
list.every { 条件 }
```

#### ファイルが存在する

```groovy
new File("パス").exists()
```

これは書くまでもないか…

#### ファイルの内容が文字列に一致する

```groovy
new File("パス").text === """1行目
2行目
3行目
:
"""
```

`""" """`でくくられた部分はGroovyのGStringなので、`${変数名}`の形で変数も入れられる。
注意したいのは、文字列の開始部分。
`"""\`とすると次の行から1行目の文字列を書いても最初の改行は無視されるのだが、これだとエラーがあった時にSpockがエラーを起こす。
つまり、

```groovy
new File("パス").text === """\
1行目
2行目
3行目
"""
```

とも書けるが、テストが失敗した時にSpockはこの表現を1行に連結して表示しようとするので`"""\1行目2行目3行目"""`のようになってしまい例外が発生してしまう。（そのうち直るとは思うが）

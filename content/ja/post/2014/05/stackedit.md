---
title: "StackEditで投稿してみる"
originalCreatedAt: 2014-05-06T02:57:00.001+09:00
tags: ["StackEdit","Blogger"]
---
[![](/img/2014-05-stackedit_1.png)](/img/2014-05-stackedit_1.png)

Bloggerへの投稿でMarkdownを使えたら良いな、と思い調べてみると[StackEdit](https://stackedit.io)が良いというのを見つけたので試してみた。
<!--more-->

Bloggerだとソースコードを貼付けたい場合に「作成」ビューで貼れば問題なく表示はできるが、スペースをすべて&amp;nbsp;に変換したりとかなり無駄ができている。
「HTML」ビューならHTMLコードを書くことで対応できるが非常に面倒。

これがStackEditだとMarkdownなのでインデント(4スペース分下げる)でソースコード表示(というか引用？)になるが、これをBloggerへHTMLとして投稿すると&lt;pre&gt;&lt;code&gt;というタグで囲まれた形に変換されるらしい。
このタグをカスタマイズしたCSS(テンプレートを編集)でデザイン調整すれば良いかもしれない。

コードはこんな感じ：

```java
public static void main(String[] args) {
    System.out.println("Hello, world!");
}
```

Bloggerはともかく、StackEditで編集した内容はDropBoxやGoogle Driveとも連携できるしスタイルがついた状態でPDFに出力したりもできるようなので使い道がいろいろありそう。

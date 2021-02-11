---
title: "StackEditで投稿してみる"
created: 2014-05-06T02:57:00.001+09:00
tags: ["StackEdit","Blogger"]
---
[![](http://3.bp.blogspot.com/-mh9tel09olk/U2i7G93YPJI/AAAAAAAAMvQ/47PTRDs7jSg/s320/2014-05-06+14.00.42.png)](http://3.bp.blogspot.com/-mh9tel09olk/U2i7G93YPJI/AAAAAAAAMvQ/47PTRDs7jSg/s1600/2014-05-06+14.00.42.png)

Bloggerへの投稿でMarkdownを使えたら良いな、と思い調べてみると
[StackEdit](https://stackedit.io)が良いというのを見つけたので試してみた。

Bloggerだとソースコードを貼付けたい場合に「作成」ビューで貼れば問題なく表示はできるが、
スペースをすべて&amp;nbsp;に変換したりとかなり無駄ができている。
「HTML」ビューならHTMLコードを書くことで対応できるが非常に面倒。

これがStackEditだとMarkdownなのでインデント(4スペース分下げる)で
ソースコード表示(というか引用？)になるが、これをBloggerへHTMLとして投稿すると
&lt;pre&gt;&lt;code&gt;というタグで囲まれた形に変換されるらしい。
このタグをカスタマイズしたCSS(テンプレートを編集)でデザイン調整すれば良いかもしれない。

コードはこんな感じ：

    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }

Bloggerはともかく、StackEditで編集した内容はDropBoxやGoogle Driveとも連携できるし
スタイルがついた状態でPDFに出力したりもできるようなので使い道がいろいろありそう。

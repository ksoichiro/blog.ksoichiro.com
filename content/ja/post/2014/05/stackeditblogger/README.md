---
title: "StackEditからのBlogger投稿でラベルを指定"
created: 2014-05-10T14:04:00.001+09:00
tags: ["StackEdit"]
---
[StackEdit](https://stackedit.io/)では[Front-matter](http://jekyllrb.com/docs/frontmatter/)が使えるということで、以下のようにすればBloggerへラベル付きで投稿できる(内容は[前のエントリ](/ja/post/2014/05/android-gradle-pluginresresources/)の冒頭)。

    ---
    tags: ["Android", "Gradle", "Android Studio"]
    ---

    Android Gradle Pluginでは、`sourceSets`として以下のようなものが指定できる。

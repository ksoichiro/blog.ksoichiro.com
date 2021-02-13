---
title: VuePress でドラフト保存できるようにする
tags: ["VuePress"]
---

このブログはまだ移行途中で、VuePress でやりたいことがある程度できるかを確認している。
Blogger でブログを書いていてよく思っていたのは、モバイルでも書きたいということ。
StackEdit を使って Markdown で書いていたのだが、データを下書きしてあとからまたスマホで編集して…ということができていなかった。

VuePress などで自前で用意すると Git リポジトリ上のファイルでしかないので Git で複数端末から共有することはできるのだが、下書きの保存のようなことができないことに気がついた。
<!--more-->
当然だが、Git で解決することもできる。
ブランチを作って commit し、完了したら pull request を使うか直接操作してマージすれば良い。

変更を入れるのは自分ひとりだし、master ブランチ 1 つで操作できたほうが楽だなとも思うので、ここでは VuePress 上で表現する方法を考えてみる。

## TL; DR

1. 標準の `404.vue` という layout ファイルを継承した `Draft.vue` を作り、 frontmatter で `layout: Draft`  と指定する。
1. ページ一覧のフィルタ等で `layout: Draft` を除外する。

## layout ファイルの作成

テーマをカスタマイズしていなければ、デフォルトの "404" がそのまま使えるかもしれない。
`.vuepress/theme` を作ってカスタマイズしている状態においては、`layout: 404` が動作しなかったので、継承して作成することにした。

以下のように、 `404.vue` を `@parent-theme` の指定で import して定義し `.vuepress/theme/layouts/Draft.vue` として作成する。

```vue
<template>
  <ParentLayout />
</template>

<script>
import ParentLayout from '@parent-theme/layouts/404.vue'

export default {
  name: 'Draft',
  components: {
    ParentLayout,
  }
}
</script>
```

そして、下書きの記事では frontmatter でこの layout を指定する。

```md
---
title: ...
layout: Draft
---
```

これで、URL に直接アクセスしても 404 のページが表示されるようになる。

## フィルタ

ページ一覧やタグのページからページをフィルタリングしてリンクしている場合、そちらで下書きを除外する必要がある。

例えば以下のようにページの一覧を作っている部分で `frontmatter.layout` を参照したフィルタを追加すればOK。

```js
const pages = this.$site.pages
  .filter(post => post.path.startsWith(this.$localePath + 'post/'))
  .filter(post => post.frontmatter.layout !== 'Draft')
```

これで一覧上からも辿れなくなる。

もちろん、Git リポジトリが public な場合は下書きであってもインターネット上ではアクセス可能になっているので注意。

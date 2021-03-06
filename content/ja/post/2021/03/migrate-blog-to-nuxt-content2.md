---
title: ブログを nuxt/content に移行 - 2. description の自動生成
tags: ["Blogger", "VuePress", "nuxt/content"]
---

[ブログをnuxt/contentに移行 - 1. 旧記事の移行](/ja/post/2021/03/migrate-blog-to-nuxt-content1/) の続き。

この状態では `description` の frontmatter がないため、一覧上に記事の概要を表示できない。
<!--more-->
以下のような VuePress の plugin を実装して `<!--more-->` のコメントより前の部分を `description` として設定するようにした。

```js
const path = require('path')
const spawn = require('cross-spawn')
const markdownIt = require('markdown-it')

module.exports = (options = {}, context) => ({
  name: 'description',
  extendPageData ($page) {
    let content = $page._strippedContent
    if (!content) {
      // 404.html does not contain _strippedContent
      return
    }
    content = content.split('<!--more-->')[0]
    const md = markdownIt({
      breaks: true,
      linkify: true,
    })
    var result = md.render(content)
    $page.description = result
  }
})
```

このときは [VuePressの.htmlのsuffixを削除しつつ作成日を表示する](/ja/post/2021/02/change-suffix-and-show-created/) ですでに別の plugin を自作していたが、plugin を複数作る場合は `name` プロパティを定義しないと plugin が正しく動作しないので注意。

完成したかと思いbuildしてチェックすると、`description` が二重に出力されていることに気づいた。以下のようなエラーが出ていた。

```
app.dc0221ab.js:3 DOMException: Failed to execute 'appendChild' on 'Node': This node type does not support this method.
```

https://github.com/vuejs/vuepress/issues/1692#issuecomment-632546907 を参考に、`<ClientOnly>` で `<p v-html>` を括ると直った。二重の出力もない。
以下にも説明されている。
https://v1.vuepress.vuejs.org/guide/using-vue.html

以下が問題が発生する最小限のコードで、`v-html` を含むタグの階層に、空ではないテキストを持つタグがあると発生する模様。

```vue
<template>
  <div>
    <p v-html="html"></p>
    <p>a</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      html: '<p>test</p> ',
    }
  },
}
</script>
```

[ブログを nuxt/content に移行 - 3. 一覧が遅すぎる問題、そして nuxt/content へ切り替え](/ja/post/2021/03/migrate-blog-to-nuxt-content3/) に続く。

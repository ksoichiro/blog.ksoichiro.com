---
title: Migrating blog to nuxt/content - 2. generate description automatically
tags: ["Blogger", "VuePress", "nuxt/content"]
---

Continuation of the last post [Migrate blog to nuxt/content - 1. migration of old posts](/post/2021/03/migrate-blog-to-nuxt-content1/).

There is no `description` header in the frontmatter of the posts, so the summary of the posts cannot be displayed in the post list on the top page.
<!--more-->
Therefore I implemented a VuePress plugin like below to set strings before `<!--more-->` comment as `description` frontmatter.

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

At that time, I've already made another plugin as written in [Remove .html suffix on VuePress and show created date](/post/2021/02/change-suffix-and-show-created/). You have to be careful to set  `name` property for the plugin when you create multiple plugins. I struggled with those plugins not working correctly because their names are not set.

I thought I have finally finished the migration, so tried to build and check. Then I found there are multiple `description` in the post. I saw an error like this:

```
app.dc0221ab.js:3 DOMException: Failed to execute 'appendChild' on 'Node': This node type does not support this method.
```

With refrence to https://github.com/vuejs/vuepress/issues/1692#issuecomment-632546907, I fixed it by surrounding `<p v-html>` with `<ClientOnly>`. No duplicate `description`s.
This is explained in the following guide.
https://v1.vuepress.vuejs.org/guide/using-vue.html

The following code is the minimum reproducible code for this issue. It seems that this issue is reproduced when there is a tag with non-empty text as a sibling of the tag that contains `v-html`.

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

Continues to [Migrating blog to nuxt/content - 3. list is too slow, and switch to nuxt/content](/post/2021/03/migrate-blog-to-nuxt-content3/).

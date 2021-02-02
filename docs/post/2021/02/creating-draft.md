---
title: Creating draft with VuePress
description: I'm still migrating my blog, and I'm on my way to confirm that whether or not what I want to do can be achieved with VuePress.
date: 2021-02-02 23:00
tags: ["VuePress"]
---

I'm still migrating my blog, and I'm on my way to confirm that whether or not what I want to do can be achieved with VuePress.
When I was writing my post with Blogger, I often thought that I want to write posts on mobile.
I've used StackEdit to write them in Markdown, but I could not save a draft and edit on my smartphone.

If I write my blog with something like VuePress, each post is just a file in a Git repository, so it's possible to share the file between serveral devices, but I found there is no feature like creating a post as a draft.

Of course, it could be resolved by Git; create a branch, commit a file, and make a pull request when I finish editing or just merge the branch with git command.

But, the committer of my blog repository is just me.
I think it's easy to use just one main branch, and I got an idea to achieve that with VuePress.

## TL; DR

1. Creating a file named `Draft.vue` which inherits `404.vue` in the default theme, then add `layout: Draft` in the frontmatter of the post.
1. Adding a condition to exclude `layout: Draft` in the filters of pages.

## Creating a layout file

If you haven't customize the default theme, you might be able to use the default "404" layout as is.
Otherwise - if you have your own theme with `.vuepress/theme` directory, writing `layout: 404` in the frontmatter won't work, so let's add a file by inheriting a layout file in the default theme.

You can create this file easily by importing `404.vue` in the default theme with the import path which has `@parent-theme` prefix and a name liek `Draft.vue`:

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

If you want to save a post as a draft, you can do it by specifying the layout:

```md
---
title: ...
layout: Draft
---
```

Now you can see 404 page even if you request the URL directly.

## Filtering

If you have links to the draft page in the page list or tag list, then you will also have to exclude draft posts from those list.

For example, if you create a page list like following filters, you just add a filter with `frontmatter.layout`.

```js
const pages = this.$site.pages
  .filter(post => post.path.startsWith(this.$localePath + 'post/'))
  .filter(post => post.frontmatter.layout !== 'Draft')
```

Then all the draft posts will be hidden.

Please note that if your repository is public, there is still a way for others to find your draft article on the Internet.

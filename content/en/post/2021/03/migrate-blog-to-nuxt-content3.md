--- 
title: Migrating blog to nuxt/content - 3. list is too slow, and switch to nuxt/content
tags: ["Blogger", "VuePress", "nuxt/content"]
---

Continuation of [Migrating blog to nuxt/content - 2. generate description automatically](/post/2021/03/migrate-blog-to-nuxt-content2/).
Finally I could migrate past posts and show list like Blogger, and I tested performance with PageSpeed Insight. But it was just 33 points...!
I think the main cause is that the top page has a list of posts with first half of each post by using `v-html` and `ClientOnly`, which causes bad DCL (DOMContentLoaded) and LCP (Largest Contentful Paint).
CLS (Cumulative Layout Shift) was also large; it seems that putting contents with JavaScript later causes layout shift.

I searched VuePress related topics about this issue, but couldn't find it.
It seems difficult to resolve this issue unless I choose the framework that has features so-called SSG.

Then some examples of using nuxt/content catched sight of me. I gave it a shot and felt like very good, so I decided to switch to it after some experiments for features that are needed for my requirements.
<!--more-->
I confirmed that a blog that has page list with excerpt of each pages, and paginations, ...etc. could be implemented with SSG.
I found nuxt/content supports `<!--more-->` notation which I once implemented for VuePress, and nuxt/content handles it as a description of the page[^1], so I thought it would be easy to switch to nuxt/content.

I can explain many things from my commit logs, but will just pick up some important points below.

## Is it possible to generate all things statically?

I could easily write and understand an example that is described in the [nuxt/content](https://content.nuxtjs.org/)'s tutorial. Perhaps it's because I tried Vue.js and VuePress before.
Its structure so differs from VuePress, so I tried installing from scratch and build up one by one instead of switching to it at once.

Aside from the details, the most important point is that nuxt/content can generate edited contents as a static page which was the issue for VuePress.
I wanted to keep each post in the top page has first half of the contents like Blogger. Using `<!--more-->` as written above seems solution for it, but `description` was not an HTML but just a text.

Then I found `excerpt` property.
This is an excerpt extracted using `<!--more-->` notation, but this is not just a text like `description` but JSON AST[^2].
I could be able to display this excerpt by passing `excerpt` property to `<nuxt-content>` tag like we do for the normal Markdown page.

```html
<nuxt-content :document="{body: post.excerpt}" />
```

By running `nuxt generate`, I could successfully generate it with HTML :tada:

By the way, this `excerpt` becomes empty when the page doesn't contain `<!--more-->` comment and the excerpt is not shown on the page list. This can be handled by adding `<!--more-->` comment at the end of file for each files that don't contain `<!--more-->` with following comand.

```bash
for i in $(rg '<!--more-->' --files-without-match content); do echo '<!--more-->' >> $i; done
```

With the basic features I learned from the tutorial and this experiment, I felt like switching to nuxt/content would have no issue, but decided to continue experiments.

## Keeping path structure

I'd like to keep the paths like `/2021/02/slug`, and I confirmed it.
This can be done with reference to the articles like below:
https://qiita.com/125Dal/items/51c4c058256d6b349921#content

The difference from VuePress is that the `slug` part can be either `slug.md` or `slug/README.md` for VuePress, but nuxt/content allows only `slug.md`.
I also converted this with the following commands as well.

```bash
for i in $(rg "title:" --files-with-matches content/ja/post); do mv $i `dirname $i`.md; done
for i in $(rg "title:" --files-with-matches content/ja/post); do rmdir `echo -n $i | sed -e 's/.md//'`; done
```

There was an image file in one of the `slug` directory, so I moved it to the common directory (`static/`), renamed it, and replaced the references with new URL. Fortunately, there was only one case that had this pattern.

## Converting created date and time

Old posts migrated from the old blog expressed creation date and time by having `created` header on the frontmatter, but nuxt/content handles such dates with `createdAt` header, so replaced them. However, they would be replaced to another name later.

```bash
rg "created:" --files-with-matches content | xargs sed -i '' -e "s/created:/createdAt:/g"
```

## Expressing create/update date by git commit dates

VuePress expresses `lastUpdatedAt` using git commit date.
Unfortunately nuxt/content seems not seeing git commit information.
For VuePress, I've also implemented createdAt by git history on my plugin[^3], so I migrated them. 

I made a plugin to get the git log of the target file by using `content:file:beforeInsert` hook and configured to set `createdAt` field to page objects.
However, to make it work correctly, I had to rename `createdAt` which are embedded in the frontmatter of each page to another name. Because when this hook occurs, `createdAt` field of the page already exists regardless of the page having `createdAt` in the frontmatter or not, and we can not distinguish whether it indicates the creation date of the file or the value on the frontmatter.
I decided to rename `createdAt` in the frontmatter to `originalCreatedAt` and if it exists then th plugin respects it, otherwise it searches git history.

```js
hooks: {
  'content:file:beforeInsert': (document) => {
    const filePath = 'content' + document.path + document.extension
    try {
      if (document.originalCreatedAt) {
        document.createdAt = document.originalCreatedAt
        delete document.originalCreatedAt
      } else {
        document.createdAt = parseInt(spawn.sync(
          'git',
          ['log', '-1', '--format=%at', '--follow', '--diff-filter=A', path.basename(filePath)],
          { cwd: path.dirname(filePath) }
        ).stdout.toString('utf-8')) * 1000
      }
    } catch (e) { /* do not handle for now */ }

    try {
      document.updatedAt = parseInt(spawn.sync(
        'git',
        ['log', '-1', '--format=%at', path.basename(filePath)],
        { cwd: path.dirname(filePath) }
      ).stdout.toString('utf-8')) * 1000
    } catch (e) { /* do not handle for now */ }
  },
```

##  Switching languages

Originally my main motivation for migrating my blog was to write blogs in English and it was difficult to implement it on Blogger but was easy to do it by using VuePress. Therefore confirmed nuxt/content can handle this structure as well.

With nuxt/content, Markdown files structure can be like below; just add files to en/ja directories.

```
content/
  en/
    post/
      2021/
        01/
          post1.md
  ja/
    post/
      2021/
        01/
          post1.md
```

To show each page, I originally prepared `.vue` files inside `pages` directory for each languages, but I found that it could be integrated into one.

By using `nuxt-i18n`, it doesn't require locale directory such as `/en/` when the default locale (`en` in this case) is applied[^4].

With this configuration, we can assume that the locale of each displayed page has been already decided. I could get the current locale by accessing `app.i18n.locale` on `asyncData()`.

```js
async asyncData ({ app, $content, params }) {
  const lang = app.i18n.locale
  ...
  const pages = await $content(lang + '/post', { deep: true })
    .sortBy('createdAt', 'desc')
    .fetch()
  ...
  return {
    lang,
    ...
  }
```

nuxt-i18n adds `localePath()` method and we can convert paths to the localized paths, which makes easy to implement language switcher links.

UI components for this purpose such as dropdown list to select language (themes might contain it but I haven't tried it because I'd like to customize the themes) are not included, so I should prepare it by myself.

## Breaking line by new line in the Markdown

I'd like to apply the behavior not to break lines with two trailing spaces but just a new line.
This can be done by adding `remark-breaks` plugin in `nuxt.config.js`.

```js
  content: {
    markdown: {
      remarkPlugins: [
        'remark-breaks',
      ],
```

## Avoiding 404 errors for posts without English version

If there are links for unexistent English page, `nuxt generate` generates errors. To avoid these errors, I added a custom frontmatter `noEnglish: true` for older posts not to generate English page links.

```bash
# Post written in 2010~2020 don't have English version
find content/ja/post/20{10..20} -type f | xargs sed -i '' -e 's,^\(title:.*\),\1\nnoEnglish: true,'
```

If `noEnglish` property is `true` then English version does not exist for the page. Double negation makes it difficult to understand, but if I reverse it, I have to add a frontmatter like `hasEnglish: true` to every future posts. Therefore I chose `noEnglish` to handle just past posts.

```html
<nav-bar :path="toPath(article.path)" :has-english="!article.noEnglish" />
```

## Pagination

Pagination here is the one on the top page.
I couldn't find a convenient library, so I implemented a simple version to link to previous and next pages.

I implemented to get all pages in `asyncData()` and extract posts inside the page with `computed` property. `data` has the current page number.
When the transition to the page completed, I'd like the page to scroll to the top, so added a call for `window.scrollTo`.

```js
export default {
  async asyncData ({ app, $content, params }) {
    const pages = await $content(lang + '/post', { deep: true })
      .sortBy('createdAt', 'desc')
      .fetch()
    return {
      lang,
      pages,
    }
  },
  data () {
    return {
      perPage: 20,
      page: 1
    }
  },
  computed: {
    paginated () {
      return this.pages.slice((this.page - 1) * this.perPage, this.page * this.perPage)
    }
  },
  methods: {
    setPage (page) {
      this.page = page
      window.scrollTo({ top: 0 })
    },
```

Links for previous and next pages has been implemented as `Pagination` compoonent.
It has current page, max page, event handler for page selection.

```html
<div v-for="p of paginated" :key="p.path" class="post">
  <!-- Render the post in the page -->
</div>
<pagination :page="page" :max-page="Math.ceil(pages.length / perPage)" @setPage="setPage" />
```

The content of the `Pagination` component is like below.
With that I can transit to prev/next pages, and if there is no page to transit, links would be disabled.

```vue
<template>
  <div class="pagination">
    <div>
      <a :class="{'is-disabled': prevDisabled}" @click="setPage(page - 1)">
        &lt;
      </a>
    </div>
    <div>
      <a :class="{'is-disabled': nextDisabled}" @click="setPage(page + 1)">
        &gt;
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Number,
      required: true
    },
    maxPage: {
      type: Number,
      required: true
    }
  },
  computed: {
    prevDisabled () {
      return this.page === 1
    },
    nextDisabled () {
      return this.page === this.maxPage
    }
  },
  methods: {
    setPage (page) {
      this.$emit('setPage', page)
    }
  }
}
</script>
```

## sitemap

I added sitemap with `@nuxtjs/sitemap`.
I needed to add paths of the contents with `routes`.
Note that we don't contain `/en/` path for English pages.

```js
sitemap: {
  hostname: baseUrl,
  gzip: true,
  routes: async () => {
    let routes = []
    const { $content } = require('@nuxt/content')
    const langs = ['en', 'ja']
    for (const lang of langs) {
      const posts = await $content(lang, 'post', { deep: true }).fetch()
      for (const post of posts) {
        const path = post.path.startsWith('/en/') ? post.path.replace(/^\/en/, '') : post.path
        routes.push(path + '/')
      }
    }
    return routes
  }
},
```

## RSS

I first tried [@nuxtjs/feed](https://www.npmjs.com/package/@nuxtjs/feed), but it seems not updated appropriately.
[It it released up to v2.0.0 on npm](https://www.npmjs.com/package/@nuxtjs/feed/v/2.0.0) but on GitHub release page versions only [up to v1.1.0 are defined](https://github.com/nuxt-community/feed-module/releases/tag/v1.1.0). In addition, with v2.0.0 I saw an error that says the destination directory does not exist and [the pull request for this issue](https://github.com/nuxt-community/feed-module/pull/87) is already merged, but the new version is not yet released.

I thought it's not good to depend on this module, so just implemented using [feed](https://www.npmjs.com/package/feed) with `generate:done` hook.

I couldn't find a way to include HTML of post body to the `Feed` with not `<nuxt-content>` tag but JavaScript.
I thought generating it from JSON AST is a good way and tried converting using [hast-util-to-html](https://github.com/syntax-tree/hast-util-to-html), but the JSON AST slightly differed from hast: this JSON AST had `tag` property for each element instead of `tagName` property that is required by hast.
Adjusted AST by copying it deeply and replacing `tagName` to make it parsable as hast, then applied `hast-util-to-html` produced the expected HTML.

```js
'generate:done': async () => {
  const { $content } = require('@nuxt/content')
  const langs = ['en', 'ja']
  for (const lang of langs) {
    const posts = await $content(lang, 'post', { deep: true })
      .sortBy('createdAt', 'desc')
      .limit(20)
      .fetch()
    const feed = new Feed({
      id: baseUrl,
      title: 'blog title',
    })
    for (const post of posts) {
      const postPath = post.path.startsWith('/en/') ? post.path.replace(/^\/en/, '') : post.path
      const url = baseUrl + postPath

      const cloned = clonedeep(post.body)
      function processNode(node) {
        if (node.tag) {
            const tag = node.tag
            delete node.tag
            node.tagName = tag
        }
        if (node.children) {
            node.children.map(child => processNode(child))
        }
      }
      cloned.children.map(child => processNode(child))

      feed.addItem({
        title: post.title,
        description: post.description,
        id: url,
        link: url,
        content: toHtml(cloned),
        date: new Date(post.createdAt),
        updated: new Date(post.updatedAt)
      })
    }

    const localePath = lang === 'en' ? '' : '/' + lang
    const dir = __dirname + '/dist' + localePath
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(dir + '/feed.xml', feed.atom1())
  }
}
```

It's been a long journey but finally I could migrate my entire blog keeping almost the same behavior as old one.
By the way, the performance score of PageSpeed Insight is now about 70...it's much better than before, but needs to be improved :sweat_smile:

[^1]: Actually this extracts not as HTML but as text, so it was not the one I expected.
[^2]: As I continue to understand, I thought once it was the [hast](https://github.com/syntax-tree/hast) but it wasn't because it's edited a little bit. Maybe calling it just JSON AST is appropriate I think...
[^3]: [Remove .html suffix on VuePress and show created date](/post/2021/02/change-suffix-and-show-created/)
[^4]: [defaultLocale](https://i18n.nuxtjs.org/options-reference#defaultlocale)

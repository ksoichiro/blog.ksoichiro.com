---
title: Make my nuxt/content blog full-static
tags: ["nuxt/content", "Nuxt.js", "Lighthouse", "PageSpeed Insight"]
---
![](/img/2021-03-make-blog-full-static_1.png)

[I've been created my blog with nuxt/content](/post/2021/03/migrate-blog-to-nuxt-content3/), but I couldn't have improved the Performance score of Lighthouse (or PageSpeed Insight) from about 80 points.
It seemed TTB (Total Blocking Time) was bad and I found that loading JavaScript files is the cause, and this time I dealt with this and finally improved the Performance score to 100 points!
<!--more-->
## Disabling injecting JavaScript

I tried to confirm whether there is unused files or not by setting `build.analyze` to `false` in `nuxt.config.js`, but couldn't find such things.
Then I searched the Nuxt.js issues around static builds, and I found the following issue.
[Lots of unnecessary JavaScript in generated Nuxt static build #5260](https://github.com/nuxt/nuxt.js/issues/5260)

In this issue, there is [a comment saying that we can disable JavaScript by setting `render.injectScripts` to `false`](https://github.com/nuxt/nuxt.js/issues/5260#issuecomment-787722343). I tried it and it had a tremendous effect.
I have been doubted that loading Web fonts or firebase-analytics files might be the cause, but even when those files are untouched, the Performance score became incredably improved to 100 points.

By doing this, some JavaScript files are not embedded anymore and it became faster, but it seemed that some of the features I've added before disabled.
Client side JavaScript seemded not working.
I finally understood that with Nuxt.js v2.14 (or v2.15.3 which is the latest version at the time of writing this), `nuxt generate` with `target: static` does not mean fully static build.

The following is a list of affected features. They all handle click events by implementing `@click`.

- For mobile devices, the hamburger menu does not react to click
- Caret in the archive list does not react to click
- Pagination link does not react to click

By the way, development features such as hot reloading or live editing also became disabled.

Although I coundn't find the pending PR that is mensioned in the comment above, I think it should be implemented in the near future. However, even if it's implemented, the result will the same - if it's full-static, then client-side JavaScript might be disabled as well, so I gave it up and started to think about replacing current Vue.js implementation to raw JavaScript implementation.

I've searched whether there is a way of keeping client-side JavaScript without relying on `render.injectScripts`, but couldn't find except deleting the generated script tags as described in [Preload tag still added with injectScripts:false & resourceHints:false #8178](https://github.com/nuxt/nuxt.js/issues/8178), which didn't work for my case.

Finally I decided to replace implementation for those 3 issues.

As you may have already notice, those 3 points are just for my blog and your blog would have another issue, but I'm going to write about them for someone's reference.

## Hamburger menu

This is easy to resolve. You just have to add a listener for click event of the element of hamburger menu and toggle a class in the listener.

First, remove the methods which is set on `@click`.

```html
<div class="menu" @click="toggleMenu">
  <div class="bar1" />
  <div class="bar2" />
  <div class="bar3" />
```

Instead, embed an `id` to identify in `document.getElementById`.

```html
<div id="toggleMenu" class="menu">
  <div class="bar1" />
  <div class="bar2" />
  <div class="bar3" />
```

You can delete the code that toggles data fields like below.

```vue
<template>
  <div id="nav" :class="{'is-open': isMenuOpen }">
  <!-- ... -->
</template>

<script>
export default {
  data () {
    return {
      isMenuOpen: false
    }
  },
  methods: {
    toggleMenu () {
      this.isMenuOpen = !this.isMenuOpen
    }
  }
  // ...
}
```

This JavaScript with `toggleMenu` might be written in the Component of the navigation bar, but this navigation bar that includes the hamburger menu is used in all pages, so I've just embedded it in the `nuxt.config.js`.
You can optimize this script such as minifying but I thought it doesn't affect to performance so much, so left it as is.

```js:nuxt.config.js
export default {
  // ...
  head: {
    // ...
    script: [
      {
        innerHTML: `
          (function(d) {
            d.addEventListener('DOMContentLoaded', function() {
              d.getElementById('toggleMenu').addEventListener('click', function() {
                d.getElementById('nav').classList.toggle('is-open');
              });
            });
          })(document);
        `
      },
      // ...
    ],
    __dangerouslyDisableSanitizers: ['script'],
```

## Pagination

Pagination can be implemented as explained in the following article.
https://qiita.com/the_fukui/items/a103ff12644457ac4eec

I though it's good because Hugo, which is also a SSG, has the same approach that allocates a path for each page.
https://gohugo.io/templates/pagination/#additional-information

Note that this is SSG, so without disabling links to nonexisitent pages cause generating routes inifinitely by crawling links in `nuxt generate`, or many `Error generating route` errors.
Especially for this blog, it has Japanese and English pages to be switched mutually, there could be an issue that page 10 exists for Japanese page but does not exist for English page for example.

In the beginning, I implemented to not disable the language switcher links but to redirect to the top page when showing the nonexistent page.

```js
async asyncData ({ app, $content, params, redirect }) {
  // ...
  const perPage = process.env.perPage
  const maxPage = Math.ceil(pages.length / perPage)
  if (page < 1 || maxPage < page) {
    return redirect(302, app.localePath('/'))
  }
```

At first glance, it seems working without issues, but when executing `nuxt generate && firebase serve` and switching to nonexistent English page, it returned HTTP status 200 with empty body.

I couldn't understand why it didn't redirect, but I guess the route is assumed to be valid because it doesn't return errors like 404 and it returns successful response when executed as a static site.

Thus, I modified to check max pages for both Japanese and English pages in `asyncData` and when there is no English page, do not generate English switcher link.
The `asyncData` is only executed once in `nuxt generate` and not executed on loading page, so loading large data in this method doesn't affect to the performance of loading page.

And finally, I could make the Performance score of my blog 100 points! :tada:

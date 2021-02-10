---
title: Show valid lastUpdated with VuePress
description: When I was building this blog on my local environment, there was no issue around date, but after I changed the workflow to deploy the blog from local to GitHub Actions, it seems last updated date became current date, so I fixed it.
date: 2021-02-10 00:00
tags: ["VuePress", "GitHub Actions"]
---
When I was building this blog on my local environment, there was no issue around date, but after I changed the workflow to deploy the blog from local to GitHub Actions, it seems last updated date became current date, so I fixed it.

## What happend?

I found that date on my blog was strange after I deployed my blog.
On top page, all dates were the same.
I first guessed that it was because I updated page list component, but each page also had the issue.

It worked on my local environment, so I thought there is something wrong around build process.

## Confirm @vuepress/plugin-last-updated

I checked the [source code of @vuepress/plugin-last-updated](https://github.com/vuejs/vuepress/blob/master/packages/%40vuepress/plugin-last-updated/index.js) and I found that `lastUpdated` comes from `git log -1 --format="%at"`.

However, there seems to be no explanation in document like git [pretty formats](https://git-scm.com/docs/pretty-formats) or some related articles that this command produces current date.

## Confirm actions/checkout

Then I thought that git repository might be different from my local environment, and checked `actions/checkout` action, and I found that `fetch-depth` is `1` by default.
This means that git histories are not fetched, and it seems that I couldn't get the author date (`%ai`) from the article Markdown file due to this.

This issue was resolved by [using `0` to `fetch-depth` to get histories](https://github.com/marketplace/actions/checkout#fetch-all-history-for-all-tags-and-branches).

```yaml
steps:
  - uses: actions/checkout@v2
    with:
      fetch-depth: 0
```

If this repository gets bigger, perhaps build time could be an issue, but I don’t have to handle it now.

## Modify date format

Additionally, it seems that my blog was shown with strange date format - I write my blog in Japan, but the timezone was not JST - because the pages are built on CI and the timezone was not `Asia/Tokyo`, so I've also updated this to specify the format with timezone.

I have chosen [dayjs](https://github.com/iamkun/dayjs) this time and configured `@vuepress/plugin-last-updated` in `.vuepress/config.js` like this:

```js
[
  '@vuepress/last-updated',
  {
    transformer: (timestamp, lang) => {
      const dayjs = require('dayjs')
      const utc = require('dayjs/plugin/utc')
      const timezone = require('dayjs/plugin/timezone')
      dayjs.extend(utc)
      dayjs.extend(timezone)
      return dayjs(timestamp).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mmZ')
    }
  }
],
```

With this update, last updated dates are shown like `2021/02/05 00:28+09:00`.
It specifies the timezone, so it is always shown with JST timezone regardless of the selected language or runtime environment.
(It is too detailed format to be a blog, though :innocent:)

<template>
  <div>
    <nav-bar :path="toPath(article.path)" :has-english="!article.noEnglish" />
    <div class="content">
      <h1>{{ article.title }}</h1>
      <page-attributes :page="article" />
      <nuxt-content :document="article" />
      <div class="nav-pages">
        <NuxtLink v-if="prev" :to="{path: toPath(prev.path)}" class="prev" :title="prev.title">
          &leftarrow;
          <span class="title">
            {{ prev.title }}
          </span>
        </NuxtLink>
        <div v-else class="prev" />
        <NuxtLink v-if="next" :to="{path: toPath(next.path)}" class="next" :title="next.title">
          <span class="title">
            {{ next.title }}
          </span>
          &rightarrow;
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
import Meta from '@/components/Meta.vue'
import MetaNoCache from '@/components/MetaNoCache.vue'
import WebFont from '@/components/WebFont.vue'
const merge = require('deepmerge')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)

export default {
  mixins: [
    Meta,
    MetaNoCache,
    WebFont
  ],
  async asyncData ({ app, $content, params, error }) {
    const { year, month, slug } = params
    const lang = app.i18n.locale
    const article = await $content(lang, 'post', year, month, slug)
      .fetch()
      .catch(() => {
        error({ statusCode: 404 })
      })
    let prev, next
    if (article) {
      [prev, next] = await $content(lang, 'post', { deep: true })
        .only(['title', 'slug'])
        .sortBy('createdAt', 'desc')
        .surround(article.path)
        .fetch()
        .catch(() => {
          error({ statusCode: 404 })
        })
    }
    return {
      lang,
      article,
      prev,
      next
    }
  },
  head () {
    return merge.all([
      this.meta(),
      this.metaNoCache(),
      this.webFontScripts(),
      {
        title: this.article.title,
        titleTemplate: '%s | memorandum',
        meta: [
          { hid: 'og:title', property: 'og:title', content: this.article.title },
          { hid: 'og:type', property: 'og:type', content: 'article' },
          { hid: 'og:updated_time', property: 'og:updated_time', content: this.modifiedTime() },
          { hid: 'article:published_time', property: 'article:published_time', content: this.publishedTime() },
          { hid: 'article:modified_time', property: 'article:modified_time', content: this.modifiedTime() }
        ]
      }
    ])
  },
  methods: {
    toPath (path) {
      if (path.startsWith('/en/')) {
        return path.replace(/^\/en/, '') + '/'
      }
      return path + '/'
    },
    publishedTime () {
      if (!this.article.createdAt) {
        return null
      }
      return dayjs(this.article.createdAt).tz('Asia/Tokyo').format('YYYY-MM-DDTHH:mm:ssZ')
    },
    modifiedTime () {
      if (!this.article.updatedAt) {
        return null
      }
      return dayjs(this.article.updatedAt).tz('Asia/Tokyo').format('YYYY-MM-DDTHH:mm:ssZ')
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-pages {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: .5rem;
  grid-gap: .5rem;
  margin-top: 2rem;
  border-top: 1px solid $borderColor;
  padding-top: 2rem;
  a {
    display: flex;
    .title {
      display: block;
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    &.next {
      text-align: right;
    }
  }
}

@media screen and (max-width: 600px) {
  .nav-pages {
    display: block;
    a.next {
      margin-top: 1rem;
    }
  }
}
</style>

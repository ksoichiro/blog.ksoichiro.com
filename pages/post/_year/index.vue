<template>
  <div>
    <nav-bar :path="toPath($route.path)" :has-english="hasEnglish" />
    <div class="content mx-auto mt-16 p-4 max-w-2xl">
      <h1>{{ year }}</h1>
      <p>
        {{ $tc('posts', pages.length ) }}
      </p>
      <ul v-if="pages.length > 0">
        <li v-for="page in pages" :key="page.path">
          <NuxtLink :to="toPath(page.path)">
            {{ page.title }}
          </NuxtLink>
        </li>
      </ul>
      <p v-else>
        {{ $t('postNotFound') }}
      </p>
    </div>
  </div>
</template>

<script>
import Meta from '@/components/Meta.vue'
import MetaNoCache from '@/components/MetaNoCache.vue'
import WebFont from '@/components/WebFont.vue'
const merge = require('deepmerge')

export default {
  mixins: [
    Meta,
    MetaNoCache,
    WebFont
  ],
  async asyncData ({ app, $content, params, error }) {
    const { year } = params
    const lang = app.i18n.locale
    const pages = await $content(lang, 'post', year, { deep: true })
      .only(['title', 'path'])
      .sortBy('createdAt', 'desc')
      .fetch()
      .catch(() => {
        error({ statusCode: 404 })
      })

    let hasEnglish = true
    if (lang !== 'en') {
      await $content('en', 'post', year, { deep: true })
        .only(['path'])
        .fetch()
        .catch(() => {
          hasEnglish = false
        })
    }

    return {
      lang,
      pages,
      year,
      hasEnglish
    }
  },
  head () {
    return merge.all([
      this.meta(),
      this.metaNoCache(),
      this.webFontScripts(),
      {
        title: this.year,
        titleTemplate: '%s | memorandum',
        meta: [
          { hid: 'og:title', property: 'og:title', content: this.year },
          { hid: 'og:type', property: 'og:type', content: 'article' }
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
    }
  }
}
</script>

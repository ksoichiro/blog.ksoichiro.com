<template>
  <div>
    <nav-bar :path="localePath('/tags')" />
    <div class="content tags">
      <h1>{{ $t('tags') }}</h1>
      <tags :pages="pages" :lang="lang" />
    </div>
  </div>
</template>

<script>
import Meta from '@/components/Meta.vue'
import MetaNoCache from '@/components/MetaNoCache.vue'
const merge = require('deepmerge')

export default {
  mixins: [
    Meta,
    MetaNoCache
  ],
  async asyncData ({ app, $content, params }) {
    const lang = app.i18n.locale
    const pages = await $content(lang + '/post', { deep: true })
      .only(['path', 'createdAt', 'title', 'draft', 'tags'])
      .fetch()
    return {
      lang,
      pages
    }
  },
  head () {
    return merge.all([
      this.meta(),
      this.metaNoCache(),
      {
        title: this.$t('tags'),
        titleTemplate: '%s | memorandum',
        meta: [
          { hid: 'og:title', property: 'og:title', content: this.$t('tags') },
          { hid: 'og:type', property: 'og:type', content: 'article' }
        ]
      }
    ])
  }
}
</script>

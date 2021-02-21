<template>
  <div>
    <nav-bar :path="toPath(article.path)" />
    <div class="content">
      <h1>{{ article.title }}</h1>
      <page-attributes :page="article" />
      <nuxt-content :document="article" />
    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ app, $content, params }) {
    const { year, month, slug } = params
    const lang = app.i18n.locale
    const article = await $content(lang, 'post', year, month, slug).fetch()
    return {
      lang,
      article
    }
  },
  head () {
    return {
      htmlAttrs: {
        lang: this.lang
      },
      title: this.article.title,
      titleTemplate: '%s | memorandum',
      meta: [
        { hid: 'description', name: 'description', content: this.$t('description') },
        { hid: 'og:title', property: 'og:title', content: this.article.title },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:url', property: 'og:url', content: this.$route.path },
        { hid: 'og:description', property: 'og:description', content: this.article.description }
      ]
    }
  },
  methods: {
    toPath (path) {
      if (path.startsWith('/en/')) {
        return path.replace(/^\/en/, '')
      }
      return path
    }
  }
}
</script>

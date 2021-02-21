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
      }
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

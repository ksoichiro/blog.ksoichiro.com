<template>
  <div>
    <nav-bar :path="toPath(article.path)" :locale-path="localePath" />
    <h1>{{ article.title }}</h1>
    <page-attributes :page="article" />
    <nuxt-content :document="article" />
  </div>
</template>

<script>
export default {
  async asyncData ({ $content, params }) {
    const { year, month, slug } = params
    const lang = params.lang || 'en'
    const localePath = lang === 'en' ? '/' : '/' + lang + '/'
    const article = await $content(lang, 'post', year, month, slug).fetch()
    return {
      lang,
      localePath,
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

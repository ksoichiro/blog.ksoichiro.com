<template>
  <div>
    <nav-bar :path="article.path" locale-path="/ja/" />
    <h1>{{ article.title }}</h1>
    <page-attributes :page="article" />
    <nuxt-content :document="article" />
  </div>
</template>

<script>
export default {
  async asyncData ({ $content, params }) {
    const { year, month, slug } = params
    const article = await $content('ja', 'post', year, month, slug).fetch()
    return {
      article
    }
  },
  head () {
    return {
      htmlAttrs: {
        lang: 'ja'
      }
    }
  }
}
</script>

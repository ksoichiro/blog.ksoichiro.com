<template>
  <div>
    <nav-bar :path="article.path" locale-path="/" />
    <h1>{{ article.title }}</h1>
    <page-attribute :page="article" />
    <nuxt-content :document="article" />
  </div>
</template>

<script>
export default {
  async asyncData ({ $content, params }) {
    const { year, month, slug } = params
    const article = await $content('post', year, month, slug).fetch()
    return {
      article
    }
  }
}
</script>

<template>
  <div>
    <nav-bar :path="localePath('/tags')" />
    <div class="content">
      <h1>Tags</h1>
      <tags :pages="pages" :lang="lang" />
    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ app, $content, params }) {
    const lang = app.i18n.locale
    // const localePath = lang === 'en' ? '/' : '/' + lang + '/'
    const pages = await $content(lang + '/post', { deep: true })
      .only(['path', 'createdAt', 'title', 'draft', 'tags'])
      .fetch()
    return {
      lang,
      pages
    }
  }
}
</script>

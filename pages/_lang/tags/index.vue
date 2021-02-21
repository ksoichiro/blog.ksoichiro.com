<template>
  <div>
    <nav-bar :path="path" :locale-path="localePath" />
    <tags :pages="pages" :lang="lang" :locale-path="localePath" />
  </div>
</template>

<script>
export default {
  async asyncData ({ $content, params }) {
    let { lang } = params
    if (!lang) {
      lang = 'en'
    }
    const localePath = lang === 'en' ? '/' : '/' + lang + '/'
    const pages = await $content(lang + '/post', { deep: true })
      .only(['path', 'createdAt', 'title', 'draft', 'tags'])
      .fetch()
    return {
      lang,
      localePath,
      path: localePath + 'tags',
      pages
    }
  }
}
</script>

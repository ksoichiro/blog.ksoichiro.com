<template>
  <div>
    <nav-bar :path="path" locale-path="/ja/" />
    <tags :pages="pages" locale-path="/ja/" />
  </div>
</template>

<script>
export default {
  async asyncData ({ $content }) {
    const pages = await $content('ja/post', { deep: true })
      .only(['path', 'createdAt', 'title', 'draft', 'tags'])
      .fetch()
    return {
      path: '/ja/tags',
      pages
    }
  }
}
</script>

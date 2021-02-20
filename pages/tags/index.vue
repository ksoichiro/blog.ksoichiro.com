<template>
  <div>
    <nav-bar :path="path" locale-path="/" />
    <tags :pages="pages" locale-path="/" />
  </div>
</template>

<script>
export default {
  async asyncData ({ $content }) {
    const pages = await $content('post', { deep: true })
      .only(['path', 'createdAt', 'title', 'draft', 'tags'])
      .fetch()
    return {
      path: '/tags',
      pages
    }
  }
}
</script>

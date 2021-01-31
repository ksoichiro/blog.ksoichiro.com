<template>
  <div>
    <div v-for="post in posts">
      <h2><a v-bind:href="post.path">{{post.title}}</a></h2>
      <p>{{post.frontmatter.description}}</p>
      <a v-bind:href="post.path">{{ $themeConfig.locales[$localePath].readMore }}</a>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    posts () {
      return this.$site.pages
        .filter(post => post.path.startsWith(this.$localePath + 'blog/'))
        .sort((a, b) => a.path > b.path)
    }
  }
}
</script>

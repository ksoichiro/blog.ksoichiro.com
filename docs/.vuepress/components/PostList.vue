<template>
  <div>
    <div v-for="post in posts">
      <h2><a v-bind:href="post.path">{{post.title}}</a></h2>
      <PageAttributes :page="post" />
      <p>{{post.frontmatter.description}}</p>
      <a class="read-more" v-bind:href="post.path">{{ $themeConfig.locales[$localePath].readMore }}</a>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.read-more
  font-size smaller
</style>

<script>
import PageAttributes from './PageAttributes.vue'

export default {
  components: {
    PageAttributes,
  },
  computed: {
    posts () {
      return this.$site.pages
        .filter(post => post.path.startsWith(this.$localePath + 'post/'))
        .filter(post => post.frontmatter.layout !== 'Draft')
        .sort((a, b) => new Date(a.frontmatter.date) > new Date(b.frontmatter.date))
    }
  }
}
</script>

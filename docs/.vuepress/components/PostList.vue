<template>
  <div>
    <div v-for="post in posts">
      <h2><a v-bind:href="post.path">{{post.title}}</a></h2>
      <div class="last-updated">
        <TimeOutlineIcon />
        <span>{{$themeConfig.locales[$localePath].lastUpdated}}:</span>
        <span>{{$page.lastUpdated}}</span>
      </div>
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
import TimeOutlineIcon from 'vue-ionicons/dist/md-time.vue'

export default {
  components: {
    TimeOutlineIcon,
  },
  computed: {
    posts () {
      return this.$site.pages
        .filter(post => post.path.startsWith(this.$localePath + 'blog/'))
        .sort((a, b) => a.path > b.path)
    }
  }
}
</script>

<template>
  <div>
    <div v-for="post in posts">
      <h2><a v-bind:href="post.path">{{post.title}}</a></h2>
      <PageAttributes :page="post" />
      <p>{{post.frontmatter.description}}</p>
      <a class="read-more" v-bind:href="post.path">{{ $themeConfig.locales[$localePath].readMore }}</a>
    </div>
    <Paginate
      v-if="pageCount > 1"
      :page-count="pageCount"
      :click-handler="onClickPage"
      :prev-text="'&lt;'"
      :next-text="'&gt;'"
      :container-class="'pagination'"
      :page-class="'page-item'">
    </Paginate>
  </div>
</template>

<style lang="stylus" scoped>
.read-more
  font-size smaller
</style>

<script>
import PageAttributes from './PageAttributes.vue'
// To provide with Firebase Hosting: https://github.com/lokyoung/vuejs-paginate/issues/110#issuecomment-656046800
import Paginate from 'vuejs-paginate/src/components/Paginate.vue'

export default {
  components: {
    PageAttributes,
    Paginate,
  },
  data () {
    return {
      perPage: 20,
      page: 1,
      allPages: []
    }
  },
  created () {
    const pages = this.$site.pages
      .filter(post => post.path.startsWith(this.$localePath + 'post/'))
      .filter(post => post.frontmatter.layout !== 'Draft')
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    for (let page of pages) {
      this.allPages.push(page)
    }
  },
  computed: {
    posts () {
      const end = this.page * this.perPage
      const start = end - this.perPage
      return this.allPages.slice(start, end)
    },
    pageCount () {
      return Math.ceil(this.allPages.length / this.perPage)
    },
  },
  methods: {
    onClickPage (pageNum) {
      this.page = Number(pageNum)
    }
  }
}
</script>

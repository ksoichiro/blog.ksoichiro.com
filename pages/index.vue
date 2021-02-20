<template>
  <div>
    <nav-bar path="/" locale-path="/" />
    <div v-for="page of paginated" :key="page.slug" class="page">
      <article>
        <h2>
          <NuxtLink :to="page.path">
            {{ page.title }}
          </NuxtLink>
        </h2>
        <nuxt-content :document="{body: page.excerpt}" />
      </article>
    </div>
    <div class="pagination">
      <ul>
        <li>
          <a @click="setPage(page - 1)" :class="{'is-disabled': prevDisabled}">
            &lt;
          </a>
        </li>
        <li>
          <a @click="setPage(page + 1)" :class="{'is-disabled': nextDisabled}">
            &gt;
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ $content }) {
    const pages = await $content('post', { deep: true }).fetch()
    return {
      pages
    }
  },
  data () {
    return {
      perPage: 1,
      page: 1
    }
  },
  computed: {
    paginated () {
      return this.pages.slice((this.page - 1) * this.perPage, this.page * this.perPage)
    },
    prevDisabled () {
      return this.page === 1
    },
    nextDisabled () {
      return this.page === this.pages.length
    }
  },
  methods: {
    setPage (page) {
      this.page = page
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  margin-top: 2em;
}
.page .nuxt-content-container h2 {
  font-size: 1.3em;
}
.is-disabled {
  pointer-events: none;
  opacity: .5;
}
</style>

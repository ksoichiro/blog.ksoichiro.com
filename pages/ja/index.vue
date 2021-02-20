<template>
  <div>
    <nav-bar path="/ja/" locale-path="/ja/" />
    <div v-for="p of paginated" :key="p.path" class="page">
      <article>
        <h2>
          <NuxtLink :to="p.path">
            {{ p.title }}
          </NuxtLink>
        </h2>
        <nuxt-content :document="{body: p.excerpt}" />
      </article>
    </div>
    <div class="pagination">
      <ul>
        <li>
          <a :class="{'is-disabled': prevDisabled}" @click="setPage(page - 1)">
            &lt;
          </a>
        </li>
        <li>
          <a :class="{'is-disabled': nextDisabled}" @click="setPage(page + 1)">
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
    const pages = await $content('ja/post', { deep: true })
      .sortBy('createdAt', 'desc')
      .fetch()
    return {
      pages
    }
  },
  data () {
    return {
      perPage: 20,
      page: 1
    }
  },
  head () {
    return {
      htmlAttrs: {
        lang: 'ja'
      }
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

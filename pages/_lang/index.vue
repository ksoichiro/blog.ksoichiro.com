<template>
  <div>
    <nav-bar :path="localePath" :locale-path="localePath" />
    <div v-for="p of paginated" :key="p.path" class="page">
      <article>
        <h2>
          <NuxtLink :to="toPath(p.path)">
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
  async asyncData ({ $content, params }) {
    let { lang } = params
    if (!lang) {
      lang = 'en'
    }
    const localePath = lang === 'en' ? '/' : '/' + lang + '/'
    const pages = await $content(lang + '/post', { deep: true })
      .sortBy('createdAt', 'desc')
      .fetch()
    return {
      lang,
      localePath,
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
        lang: this.lang
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
    },
    toPath (path) {
      if (path.startsWith('/en/')) {
        return path.replace(/^\/en/, '')
      }
      return path
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

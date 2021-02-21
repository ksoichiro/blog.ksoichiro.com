<template>
  <div>
    <nav-bar :path="localePath('/')" />
    <div class="content">
      <header class="hero">
        <h1>memorandum</h1>
        <p>{{ $t('description') }}</p>
      </header>
      <div v-for="p of paginated" :key="p.path" class="post">
        <article>
          <h2>
            <NuxtLink :to="toPath(p.path)">
              {{ p.title }}
            </NuxtLink>
          </h2>
          <page-attributes :page="p" />
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
  </div>
</template>

<script>
export default {
  async asyncData ({ app, $content, params }) {
    const lang = app.i18n.locale
    const pages = await $content(lang + '/post', { deep: true })
      .sortBy('createdAt', 'desc')
      .fetch()
    return {
      lang,
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
.hero {
  text-align: center;
  h1 {
    font-size: 3rem;
  }
}
.post:not(:first-of-type) {
  margin-top: 4rem;
}
.post .nuxt-content-container h2 {
  font-size: 1.3em;
}
.is-disabled {
  pointer-events: none;
  opacity: .5;
}
</style>

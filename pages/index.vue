<template>
  <div>
    <nav-bar :path="localePath('/')" @setPage="setPage" />
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
          <p class="read-more">
            <NuxtLink :to="toPath(p.path)">
              {{ $t('readMore') }}
            </NuxtLink>
          </p>
        </article>
      </div>
      <pagination :page="page" :max-page="Math.ceil(pages.length / perPage)" @setPage="setPage" />
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
      },
      meta: [
        { hid: 'description', name: 'description', content: this.$t('description') },
        { hid: 'og:title', property: 'og:title', content: 'memorandum' },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:url', property: 'og:url', content: process.env.baseUrl + this.$route.path },
        { hid: 'og:description', property: 'og:description', content: this.$t('description') }
      ]
    }
  },
  computed: {
    paginated () {
      return this.pages.slice((this.page - 1) * this.perPage, this.page * this.perPage)
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
.read-more {
  font-size: smaller;
}
</style>

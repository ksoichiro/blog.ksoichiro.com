<template>
  <div>
    <nav-bar :path="toPath($route.path)" />
    <div class="content">
      <h1>{{ year }}</h1>
      <p>
        {{ $tc('posts', pages.length ) }}
      </p>
      <ul v-if="pages.length > 0">
        <li v-for="page in pages" :key="page.path">
          <NuxtLink :to="toPath(page.path)">
            {{ page.title }}
          </NuxtLink>
        </li>
      </ul>
      <p v-else>
        {{ $t('postNotFound') }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ app, $content, params, error }) {
    const { year } = params
    const lang = app.i18n.locale
    const pages = await $content(lang, 'post', year, { deep: true })
      .only(['title'])
      .sortBy('createdAt', 'desc')
      .fetch()
      .catch(() => {
        error({ statusCode: 404 })
      })
    return {
      lang,
      pages,
      year
    }
  },
  methods: {
    toPath (path) {
      if (path.startsWith('/en/')) {
        return path.replace(/^\/en/, '') + '/'
      }
      return path + '/'
    }
  }
}
</script>

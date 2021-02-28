<template>
  <div>
    <nav-bar :path="localePath('/tags')" />
    <div class="content">
      <h1>{{ $t('tags') }}</h1>
      <tags :pages="pages" :lang="lang" />
    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ app, $content, params }) {
    const lang = app.i18n.locale
    const pages = await $content(lang + '/post', { deep: true })
      .only(['path', 'createdAt', 'title', 'draft', 'tags'])
      .fetch()
    return {
      lang,
      pages
    }
  },
  head () {
    return {
      htmlAttrs: {
        lang: this.lang
      },
      title: this.$t('tags'),
      titleTemplate: '%s | memorandum',
      meta: [
        { hid: 'description', name: 'description', content: this.$t('description') },
        { hid: 'og:title', property: 'og:title', content: this.$t('tags') },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:url', property: 'og:url', content: process.env.baseUrl + this.$route.path },
        { hid: 'og:description', property: 'og:description', content: this.$t('description') }
      ],
      link: [
        { rel: 'alternate', type: 'application/atom+xml', title: 'Atom1.0', href: this.localePath('/feed.xml') }
      ]
    }
  }
}
</script>

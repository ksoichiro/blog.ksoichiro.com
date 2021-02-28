<script>
export default {
  methods: {
    meta () {
      return {
        htmlAttrs: {
          lang: this.lang
        },
        meta: [
          { hid: 'description', name: 'description', content: this.$t('description') },
          { hid: 'og:url', property: 'og:url', content: process.env.baseUrl + this.$route.path },
          { hid: 'og:description', property: 'og:description', content: this.$t('description') }
        ],
        link: [
          { rel: 'alternate', type: 'application/atom+xml', title: 'Atom1.0', href: this.localePath('/feed.xml') }
        ]
      }
    }
  }
}
</script>

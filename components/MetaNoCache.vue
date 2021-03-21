<script>
export default {
  methods: {
    metaNoCache () {
      return {
        meta: [
          { hid: 'pragma', 'http-equiv': 'Pragma', content: 'no-cache' },
          { hid: 'cache-control', 'http-equiv': 'Cache-Control', content: 'no-cache' },
          { hid: 'expires', 'http-equiv': 'Expires', content: '0' }
        ]
      }
    }
  }
}
</script>

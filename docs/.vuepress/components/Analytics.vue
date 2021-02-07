<template>
  <div />
</template>

<script>
export default {
  async mounted () {
    // The core Firebase JS SDK is always required and must be listed first
    await this.insertScript('/__/firebase/8.2.6/firebase-app.js')
    // Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
    await this.insertScript('/__/firebase/8.2.6/firebase-analytics.js')
    // Initialize Firebase
    await this.insertScript('/__/firebase/init.js')
    if (typeof firebase !== "undefined") {
      firebase.analytics();
    }
  },
  methods: {
    insertScript (src) {
      return new Promise(resolve => {
        let externalScript = document.createElement('script')
        externalScript.src = src
        externalScript.defer = true
        document.head.appendChild(externalScript)
        externalScript.onload = function () {
          resolve()
        }
      })
    }
  }
}
</script>

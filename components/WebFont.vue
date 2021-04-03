
<script>
export default {
  methods: {
    webFontScripts () {
      const families = [
        'Inter:400,500',
        'Roboto Mono:300,500'
      ]
      if (this.lang === 'ja') {
        families.push('M PLUS 1p:400,500')
      }
      families[families.length - 1] += '&display=swap'

      const webFontConfig = {
        google: {
          families
        },
        active () {
          sessionStorage.fonts = true
        }
      }
      return {
        script: [
          {
            hid: 'webfont',
            innerHTML: `
              WebFontConfig = ${JSON.stringify(webFontConfig)};
              (function(d) {
                var wf = d.createElement('script'), s = d.scripts[0];
                wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
                wf.async = true;
                s.parentNode.insertBefore(wf, s);
              })(document);
            `
          }
        ],
        __dangerouslyDisableSanitizers: ['script']
      }
    }
  }
}
</script>

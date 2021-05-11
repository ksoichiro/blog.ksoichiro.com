<script>
export default {
  methods: {
    webFontScripts () {
      let styles = [
        {
          hid: 'style-inter-regular',
          innerHTML: `
            @font-face {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 400;
              font-display: optional;
              src: url('/font/20210403/Inter-Regular.woff2') format('woff2');
            }
          `,
        },
        {
          hid: 'style-inter-medium',
          innerHTML: `
            @font-face {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 500;
              font-display: optional;
              src: url('/font/20210403/Inter-Medium.woff2') format('woff2');
            }
          `
        },
        {
           hid: 'style-roboto-mono-regular',
           innerHTML: `
             @font-face {
               font-family: 'Roboto Mono';
               font-style: normal;
               font-weight: 400;
               font-display: optional;
               src: url('/font/20210403/RobotoMono-Regular.woff2') format('woff2');
             }
           `,
        },
        {
          hid: 'style-roboto-mono-medium',
          innerHTML: `
            @font-face {
              font-family: 'Roboto Mono';
              font-style: normal;
              font-weight: 500;
              font-display: optional;
              src: url('/font/20210403/RobotoMono-Medium.woff2') format('woff2');
            }
          `
        }
      ]
      const families = []
      if (this.lang === 'ja') {
        families.push('M PLUS 1p:400,500')
      }
      families[families.length - 1] += '&display=swap'

      let scripts = []
      if (families.length > 0) {
        const webFontConfig = {
          google: {
            families
          },
          active () {
            sessionStorage.fonts = true
          }
        }
        scripts = [
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
        ]
      }
      return {
        script: scripts,
        style: styles,
        __dangerouslyDisableSanitizers: ['script', 'style']
      }
    }
  }
}
</script>

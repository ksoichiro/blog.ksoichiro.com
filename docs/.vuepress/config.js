module.exports = {
  head: [
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1' }],
    ['script', {}, `
      WebFontConfig = {
        google: {
          families: [
            'Rubik:400,500',
            'Roboto Mono:300,500',
            'M PLUS 1p:400,500&display=swap',
          ]
        },
        active: function() {
          sessionStorage.fonts = true;
        }
      };
      (function(d) {
        var wf = d.createElement('script'), s = d.scripts[0];
        wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
        wf.async = true;
        s.parentNode.insertBefore(wf, s);
      })(document);
    `],
    // favicon
    ['link', {rel: 'apple-touch-icon', type: 'image/png', href: '/apple-touch-icon-180x180.png'}],
    ['link', {rel: 'icon', type: 'image/png', href: '/icon-192x192.png'}],
  ],
  locales: {
    '/': {
      lang: 'en-US',
      title: 'memorandum',
      description: 'Blog of notes on IT, with a focus on web application development and other topics.'
    },
    '/ja/': {
      lang: 'ja-JP',
      title: 'memorandum',
      description: 'Webアプリ開発などを中心としたITに関するメモのブログです。',
    }
  },
  plugins: [
    [
      '@vuepress/last-updated'
    ],
    [
      '@vuepress/google-analytics',
      {
        'ga': '' // UA-00000000-0
      }
    ]
  ],
  themeConfig: {
    lastUpdated: true,
    sidebar: 'auto',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        ariaLabel: 'Languages',
        nav: [
          { text: 'Tags', link: '/tags/' }
        ],

        // Custom messages
        readMore: 'Read more...',
        lastUpdated: 'Last Updated',
      },
      '/ja/': {
        label: '日本語',
        selectText: '言語',
        ariaLabel: '言語',
        nav: [
          { text: 'タグ', link: '/ja/tags/' }
        ],

        // Custom messages
        readMore: '続きを読む...',
        lastUpdated: '最終更新',
      }
    }
  },
  markdown: {
    extendMarkdown: md => {
      md.set({
        breaks: true,
        linkify: true,
      })
    }
  }
}

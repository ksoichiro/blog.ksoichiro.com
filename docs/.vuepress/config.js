module.exports = {
  head: [
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1' }],
    ['script', {}, `
      WebFontConfig = {
        google: { families: ['Noto Sans JP:400,700&display=swap'] },
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
    `]
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

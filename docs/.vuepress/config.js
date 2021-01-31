module.exports = {
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
  themeConfig: {
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        ariaLabel: 'Languages',

        // Custom messages
        readMore: 'Read more...',
      },
      '/ja/': {
        label: '日本語',
        selectText: '言語',
        ariaLabel: '言語',

        // Custom messages
        readMore: '続きを読む...',
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

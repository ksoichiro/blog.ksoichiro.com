const path = require('path')
const spawn = require('cross-spawn')
const baseUrl = 'https://blog.ksoichiro.com'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  env: {
    baseUrl: baseUrl
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'memorandum',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'memorandum' },
    ],
    link: [
      { rel: 'apple-touch-icon', type: 'image/png', href: '/apple-touch-icon-180x180.png' },
      { rel: 'icon', type: 'image/png', href: '/icon-192x192.png' },
    ],
    script: [
      {
        innerHTML: `
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
        `
      }
    ],
    __dangerouslyDisableSanitizers: ['script'],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/index',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    [
      'nuxt-i18n',
      {
        locales: [
          { code: 'en', iso: 'en-US' },
          { code: 'ja', iso: 'ja-JP' }
        ],
        defaultLocale: 'en',
        vueI18n: {
          fallbackLocale: 'en',
          messages: {
            en: {
              description: 'Blog of notes on IT, with a focus on web application development and other topics.',
              language: 'Language',
              tags: 'Tags',
              created: 'Created',
              updated: 'Updated',
              readMore: 'Read more...'
            },
            ja: {
              description: 'Webアプリ開発などを中心としたITに関するメモのブログです。',
              language: '言語',
              tags: 'タグ',
              created: '作成',
              updated: '更新',
              readMore: '続きを読む...'
            }
          }
        },
        vueI18nLoader: true
      }
    ],
    '@nuxtjs/sitemap'
  ],

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
    markdown: {
      remarkPlugins: [
        'remark-breaks',
        'remark-emoji'
      ],
      rehypePlugins: [
        'rehype-plugin-image-native-lazy-loading'
      ],
      prism: {
        theme: 'prism-themes/themes/prism-nord.css'
      },
      remarkExternalLinks: {
        content: {
          type: "element",
          tagName: "icon-external-link"
        },
        contentProperties: {
          className: ["icon-external-link"],
        },
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  styleResources: {
    scss: [
      '~assets/css/_var.scss'
    ]
  },

  sitemap: {
    hostname: baseUrl,
    gzip: true,
    routes: async () => {
      let routes = []
      const { $content } = require('@nuxt/content')
      const langs = ['en', 'ja']
      for (const lang of langs) {
        const posts = await $content(lang, 'post', { deep: true }).fetch()
        for (const post of posts) {
          const path = post.path.startsWith('/en/') ? post.path.replace(/^\/en/, '') : post.path
          routes.push(path)
        }
      }
      return routes
    }
  },

  hooks: {
    'content:file:beforeInsert': (document) => {
      const filePath = 'content' + document.path + document.extension
      try {
        if (document.originalCreatedAt) {
          // nuxt already has a feature to honor the original createdAt frontmatter,
          // but it's impossible to distinguish where did the createdAt comes from in this hook,
          // so I use another custom frontmatter instead.
          document.createdAt = document.originalCreatedAt
          delete document.originalCreatedAt
        } else {
          document.createdAt = parseInt(spawn.sync(
            'git',
            ['log', '-1', '--format=%at', '--follow', '--diff-filter=A', path.basename(filePath)],
            { cwd: path.dirname(filePath) }
          ).stdout.toString('utf-8')) * 1000
        }
      } catch (e) { /* do not handle for now */ }

      try {
        document.updatedAt = parseInt(spawn.sync(
          'git',
          ['log', '-1', '--format=%at', path.basename(filePath)],
          { cwd: path.dirname(filePath) }
        ).stdout.toString('utf-8')) * 1000
      } catch (e) { /* do not handle for now */ }
    }
  }
}

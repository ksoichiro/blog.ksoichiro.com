<template>
  <div>
    <nav-bar :path="localePath('/')" :has-english="hasEnglish" />
    <header class="text-nord4 text-center pt-16">
      <h1 class="text-5xl my-8">memorandum</h1>
      <p class="text-sm font-light px-8 my-4">
        {{ $t('description') }}
      </p>
    </header>
    <div class="container flex mx-auto my-0 justify-center lg:flex-col">
      <main class="content m-0 ml-auto max-w-2xl w-full lg:mr-auto">
        <div v-for="p of paginated" :key="p.path" class="post mt-16 first:mt-0">
          <article>
            <h2 class="post-title mt-0">
              <NuxtLink :to="toPath(p.path)">
                {{ p.title }}
              </NuxtLink>
            </h2>
            <page-attributes :page="p" />
            <nuxt-content :document="{body: p.excerpt}" />
            <p class="text-sm">
              <NuxtLink :to="toPath(p.path)">
                {{ $t('readMore') }}
              </NuxtLink>
            </p>
          </article>
        </div>
        <pagination :page="page" :max-page="maxPage" />
      </main>
      <aside class="sidebar text-sm w-80 p-4 mr-auto lg:border-t lg:border-nord1 lg:mx-auto lg:my-0 lg:max-w-2xl lg:w-full">
        <h3 class="text-lg">{{ $t('archives') }}</h3>
        <ul v-for="y in sortKeys(archives)" :key="y" class="archive-years list-none pl-0">
          <li>
            <span :id="'archive-year-' + y" class="caret cursor-pointer archive-year-caret" :data-year="y">
              <icon-arrow-dropright :class="'archive-year-caret-' + y" class="inline" />
              <icon-arrow-dropdown :class="'archive-year-caret-' + y" class="hidden" />
            </span>
            <NuxtLink :to="localePath(`/post/${y}`)">
              {{ y }} ({{ archives[y].count }})
            </NuxtLink>
            <ul v-for="m in sortKeys(archives[y].months)" :key="m" class="archive-months list-none pl-5 hidden">
              <li>
                <span :id="'archive-month-' + y + '-' + m" class="caret cursor-pointer archive-month-caret" :data-year="y" :data-month="m">
                  <icon-arrow-dropright :class="'archive-month-caret-' + y + '-' + m" class="inline" />
                  <icon-arrow-dropdown :class="'archive-month-caret-' + y + '-' + m" class="hidden" />
                </span>
                <NuxtLink :to="localePath(`/post/${y}/${m}`)">
                  {{ m }} ({{ archives[y].months[m].posts.length }})
                </NuxtLink>
                <ul v-for="p of sortPosts(archives[y].months[m].posts)" :key="p.path" class="archive-posts hidden">
                  <li>
                    <NuxtLink :to="toPath(p.path)">
                      {{ p.title }}
                    </NuxtLink>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script>
import Meta from '@/components/Meta.vue'
import MetaNoCache from '@/components/MetaNoCache.vue'
import WebFont from '@/components/WebFont.vue'
const merge = require('deepmerge')

export default {
  mixins: [
    Meta,
    MetaNoCache,
    WebFont
  ],
  async asyncData ({ app, $content, params, error }) {
    const lang = app.i18n.locale
    const getYear = (dir) => {
      return dir.split('/')[3]
    }
    const getMonth = (dir) => {
      return dir.split('/')[4]
    }
    let page = 1
    if (typeof params.page !== 'undefined') {
      page = parseInt(params.page)
    }
    const pages = await $content(lang + '/post', { deep: true })
      .only(['title', 'path', 'dir', 'excerpt', 'createdAt', 'updatedAt', 'tags'])
      .sortBy('createdAt', 'desc')
      .fetch()
    const perPage = process.env.perPage
    const maxPage = Math.ceil(pages.length / perPage)
    if (page < 1 || maxPage < page) {
      error({ statusCode: 404 })
    }
    let hasEnglish = true
    if (lang === 'ja') {
      const pages = await $content('en/post', { deep: true })
        .only(['path'])
        .fetch()
      const maxPage = Math.ceil(pages.length / perPage)
      if (page < 1 || maxPage < page) {
        hasEnglish = false
      }
    }
    const paginated = pages.slice((page - 1) * perPage, page * perPage)
    const groupBy = (xs, key, keyfn1, keyfn2) => {
      return xs.reduce((rv, x) => {
        const value = x[key]
        const prop = keyfn1(value)
        const prop2 = keyfn2(value)
        const r = rv[prop] = rv[prop] || { months: {} }
        r.months[prop2] = r.months[prop2] || { posts: [] }
        r.months[prop2].posts.push(x)
        rv[prop].count = rv[prop].count ? rv[prop].count + 1 : 1
        return rv
      }, {})
    }
    const archives = groupBy(pages, 'dir', getYear, getMonth)
    return {
      lang,
      page,
      maxPage,
      hasEnglish,
      pages,
      paginated,
      archives
    }
  },
  data () {
    return {
      perPage: process.env.perPage
    }
  },
  head () {
    return merge.all([
      this.meta(),
      this.metaNoCache(),
      this.webFontScripts(),
      {
        meta: [
          { hid: 'og:title', property: 'og:title', content: 'memorandum' },
          { hid: 'og:type', property: 'og:type', content: 'website' }
        ],
        script: [
          {
            innerHTML: `
              (function(d) {
                d.addEventListener('DOMContentLoaded', function() {
                  Array.from(d.getElementsByClassName('archive-year-caret')).forEach(function(e) {
                    if (!e) {
                      return
                    }
                    const y = e.dataset.year
                    e.addEventListener('click', function() {
                      Array.from(e.parentNode.getElementsByClassName('archive-months')).forEach(function(e) {
                        e.classList.toggle('hidden')
                        e.classList.toggle('block')
                      })
                      Array.from(e.getElementsByClassName('archive-year-caret-' + y)).forEach(function(e2) {
                        e2.classList.toggle('hidden')
                        e2.classList.toggle('inline')
                      })
                    })
                    Array.from(e.parentNode.getElementsByClassName('archive-month-caret')).forEach(function(e) {
                      if (!e) {
                        return
                      }
                      const m = e.dataset.month
                      e.addEventListener('click', function() {
                        Array.from(e.parentNode.getElementsByClassName('archive-posts')).forEach(function(e) {
                          e.classList.toggle('hidden')
                          e.classList.toggle('block')
                        })
                        Array.from(e.getElementsByClassName('archive-month-caret-' + y + '-' + m)).forEach(function(e2) {
                          e2.classList.toggle('hidden')
                          e2.classList.toggle('inline')
                        })
                      })
                    })
                  })
                })
              })(document)
            `
          }
        ]
      }
    ])
  },
  methods: {
    toPath (path) {
      if (path.startsWith('/en/')) {
        return path.replace(/^\/en/, '') + '/'
      }
      return path + '/'
    },
    sortKeys (obj) {
      const keys = Object.keys(obj).sort((a, b) => {
        return Number(b) - Number(a)
      })
      const removeKey = (keys, key) => {
        const idx = keys.indexOf(key)
        if (idx > -1) {
          keys.splice(idx, 1)
        }
      }
      removeKey(keys, 'opened')
      return keys
    },
    sortPosts (posts) {
      return posts
    }
  }
}
</script>

<style lang="scss" scoped>
.post .nuxt-content-container h2 {
  // generated class
  font-size: 1.3em;
}
.container {
  .sidebar {
    // generated class
    h3:first-of-type {
      margin-top: 0;
    }
  }
}
.sidebar {
  .caret {
    // There is no class on TailwindCSS
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
}
</style>

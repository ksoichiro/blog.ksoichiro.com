<template>
  <div>
    <nav-bar :path="localePath('/')" @setPage="setPage" />
    <header class="hero">
      <h1>memorandum</h1>
      <p class="description">{{ $t('description') }}</p>
    </header>
    <div class="container">
      <main class="content">
        <div v-for="p of paginated" :key="p.path" class="post">
          <article>
            <h2 class="post-title">
              <NuxtLink :to="toPath(p.path)">
                {{ p.title }}
              </NuxtLink>
            </h2>
            <page-attributes :page="p" />
            <nuxt-content :document="{body: p.excerpt}" />
            <p class="read-more">
              <NuxtLink :to="toPath(p.path)">
                {{ $t('readMore') }}
              </NuxtLink>
            </p>
          </article>
        </div>
        <pagination :page="page" :max-page="Math.ceil(pages.length / perPage)" @setPage="setPage" />
      </main>
      <aside class="sidebar">
        <h3>{{ $t('archives') }}</h3>
        <ul v-for="y in sortKeys(archives)" :key="y" class="archive-years">
          <li>
            <span class="caret archive-year-caret" @click="archives[y].opened = !archives[y].opened" :data-year="y" :id="'archive-year-' + y">
              <span :class="{'caret-right': !archives[y].opened, 'caret-down': archives[y].opened}" :id="'archive-year-caret-' + y" />
            </span>
            <NuxtLink :to="localePath(`/post/${y}`)">
              {{ y }} ({{ archives[y].count }})
            </NuxtLink>
            <ul v-for="m in sortKeys(archives[y].months)" :key="m" class="archive-months" :class="{'is-opened': archives[y].opened }">
              <li>
                <span class="caret archive-month-caret" @click="archives[y].months[m].opened = !archives[y].months[m].opened" :data-year="y" :data-month="m" :id="'archive-month-' + y + '-' + m">
                  <span :class="{'caret-right': !archives[y].months[m].opened, 'caret-down': archives[y].months[m].opened}" :id="'archive-month-caret-' + y + '-' + m" />
                </span>
                <NuxtLink :to="localePath(`/post/${y}/${m}`)">
                  {{ m }} ({{ archives[y].months[m].posts.length }})
                </NuxtLink>
                <ul v-for="p of sortPosts(archives[y].months[m].posts)" :key="p.path" class="archive-posts" :class="{'is-opened': archives[y].months[m].opened }">
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
const merge = require('deepmerge')

export default {
  mixins: [
    Meta
  ],
  async asyncData ({ app, $content, params }) {
    const lang = app.i18n.locale
    const getYear = (dir) => {
      return dir.split('/')[3]
    }
    const getMonth = (dir) => {
      return dir.split('/')[4]
    }
    const pages = await $content(lang + '/post', { deep: true })
      .only(['title', 'path', 'dir', 'excerpt', 'createdAt', 'updatedAt', 'tags'])
      .sortBy('createdAt', 'desc')
      .fetch()
    const groupBy = (xs, key, keyfn1, keyfn2) => {
      return xs.reduce((rv, x) => {
        const value = x[key]
        const prop = keyfn1(value)
        const prop2 = keyfn2(value)
        const r = rv[prop] = rv[prop] || { opened: false, months: {} }
        r.months[prop2] = r.months[prop2] || { opened: false, posts: [] }
        r.months[prop2].posts.push(x)
        rv[prop].count = rv[prop].count ? rv[prop].count + 1 : 1
        return rv
      }, {})
    }
    const archives = groupBy(pages, 'dir', getYear, getMonth)
    return {
      lang,
      pages,
      archives
    }
  },
  data () {
    return {
      perPage: process.env.perPage,
      page: 1
    }
  },
  head () {
    return merge(
      this.meta(),
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
                    const y = e.dataset.year
                    e.addEventListener('click', function() {
                      Array.from(e.parentNode.getElementsByClassName('archive-months')).forEach(function(e) {
                        e.classList.toggle('is-opened')
                      })
                      const c = d.getElementById('archive-year-caret-' + y)
                      c.classList.toggle('caret-right')
                      c.classList.toggle('caret-down')
                    })
                    Array.from(e.parentNode.getElementsByClassName('archive-month-caret')).forEach(function(e) {
                      const m = e.dataset.month
                      e.addEventListener('click', function() {
                        Array.from(e.parentNode.getElementsByClassName('archive-posts')).forEach(function(e) {
                          e.classList.toggle('is-opened')
                        })
                        const c = d.getElementById('archive-month-caret-' + y + '-' + m)
                        c.classList.toggle('caret-right')
                        c.classList.toggle('caret-down')
                      })
                    })
                  })
                })
              })(document)
            `
          }
        ]
      }
    )
  },
  computed: {
    paginated () {
      return this.pages.slice((this.page - 1) * this.perPage, this.page * this.perPage)
    }
  },
  methods: {
    setPage (page) {
      this.page = page
      window.scrollTo({ top: 0 })
    },
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
.hero {
  color: $homeDescriptionTextColor;
  text-align: center;
  padding-top: 57px;
  h1 {
    font-size: 3rem;
  }
  .description {
    font-size: 0.8em;
    font-weight: 300;
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
.post {
  h2.post-title {
    margin-top: 0;
  }
}
.post:not(:first-of-type) {
  margin-top: 4rem;
}
.post .nuxt-content-container h2 {
  font-size: 1.3em;
}
.read-more {
  font-size: smaller;
}
.container {
  display: flex;
  margin: 0 auto;
  justify-content: center;
  .content {
    margin: 0;
    width: calc(680px - 4rem);
    max-width: calc(100% - 4rem);
    margin-left: auto;
  }
  .sidebar {
    width: calc(260px - 4rem);
    padding: 2rem;
    margin-right: auto;
    h3:first-of-type {
      margin-top: 0;
    }
  }
}
.sidebar {
  font-size: 0.8em;
  .archive-years {
    list-style: none;
    padding-left: 1.2rem;
  }
  .archive-months {
    list-style: none;
    padding-left: 1.2rem;
    &.is-opened {
      display: block;
    }
    &:not(.is-opened) {
      display: none;
    }
  }
  .archive-posts {
    padding-left: 1.2rem;
    &.is-opened {
      display: block;
    }
    &:not(.is-opened) {
      display: none;
    }
  }
  .caret {
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  .caret-right {
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 15%;
      right: 6px;
      border-left: 6px solid $listBulletColor;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
    }
  }
  .caret-down {
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 40%;
      right: 6px;
      border-top: 6px solid $listBulletColor;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
    }
  }
}

@media screen and (max-width: 980px) {
  .container {
    flex-direction: column;
    .content {
      margin-right: auto;
    }
    .sidebar {
      border-top: 1px solid $borderColor;
      width: calc(100% - 4rem);
      max-width: calc(680px - 4rem);
      margin: 0 auto;
    }
  }
}
</style>

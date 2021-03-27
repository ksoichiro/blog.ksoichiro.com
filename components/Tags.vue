<template>
  <div>
    <span v-for="tag in Object.keys(tags)" :key="tag">
      <h2 :id="tag">
        <router-link :to="{path: localePath('/tags#' + tag)}" class="icon-link"></router-link>{{ tag }}
      </h2>
      <ul>
        <li v-for="page in tags[tag]" :key="page.path">
          <NuxtLink :to="toPath(page.path)">{{ page.title }}</NuxtLink>
        </li>
      </ul>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    pages: {
      type: Array,
      required: true
    },
    lang: {
      type: String,
      required: true
    }
  },
  computed: {
    tags () {
      const pages = this.pages
        .filter(post => post.path.startsWith('/' + this.lang + '/post/'))
        .filter(post => post.draft !== true)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      const tags = {}
      for (const page of pages) {
        for (const index in page.tags) {
          const tag = page.tags[index]
          if (tag in tags) {
            tags[tag].push(page)
          } else {
            tags[tag] = [page]
          }
        }
      }
      return tags
    }
  },
  methods: {
    toPath (path) {
      if (path.startsWith('/en/')) {
        return path.replace(/^\/en/, '') + '/'
      }
      return path + '/'
    }
  }
}
</script>

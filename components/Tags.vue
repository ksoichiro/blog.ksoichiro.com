<template>
  <div>
    <span v-for="tag in Object.keys(tags)" :key="tag">
      <h2 :id="tag">
        <router-link :to="{path: `${localePath}tags/#${tag}`}" class="header-anchor">#</router-link>
        {{tag}}
      </h2>
      <ul>
        <li v-for="page in tags[tag]" :key="page.path">
          <router-link :to="{path: page.path}">{{page.title}}</router-link>
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
    localePath: {
      type: String,
      required: true
    }
  },
  computed: {
    tags () {
      const pages = this.pages
        .filter(post => post.path.startsWith(this.localePath + 'post/'))
        .filter(post => post.draft !== true)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      let tags = {}
      for (let page of pages) {
        for (let index in page.tags) {
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
  }
}
</script>

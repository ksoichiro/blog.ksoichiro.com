<template>
  <div>
    <span v-for="tag in Object.keys(tags)">
      <h2 :id="tag">
        <router-link :to="{path: `${$localePath}tags/#${tag}`}" class="header-anchor">#</router-link>
        {{tag}}
      </h2>
      <ul>
        <li v-for="page in tags[tag]">
          <router-link :to="{path: page.path}">{{page.title}}</router-link>
        </li>
      </ul>
    </span>
  </div>
</template>

<script>
export default {
  computed: {
    tags () {
      const pages = this.$site.pages
        .filter(post => post.path.startsWith(this.$localePath + 'blog/'))
        .sort((a, b) => new Date(a.frontmatter.date) > new Date(b.frontmatter.date))
      let tags = {}
      for (let page of pages) {
        for (let index in page.frontmatter.tags) {
          const tag = page.frontmatter.tags[index]
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

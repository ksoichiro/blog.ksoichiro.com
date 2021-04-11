<template>
  <div class="pagination flex mt-8 pl-0">
    <div class="navigation cursor-pointer">
      <NuxtLink v-if="!prevDisabled" :to="localePath('/page/' + (page - 1))" class="block rounded px-3 py-2 text-sm hover:bg-nord1 hover:no-underline">
        &lt;
      </NuxtLink>
      <span v-else class="is-disabled opacity-50 block rounded px-3 py-2 text-sm">
        &lt;
      </span>
    </div>
    <div class="pages text-nord5">
      <span class="block rounded px-3 py-2 text-sm">{{ page }} / {{ maxPage }}</span>
    </div>
    <div class="navigation cursor-pointer">
      <NuxtLink v-if="!nextDisabled" :to="localePath('/page/' + (page + 1))" class="block rounded px-3 py-2 text-sm hover:bg-nord1 hover:no-underline">
        &gt;
      </NuxtLink>
      <span v-else class="is-disabled opacity-50 block rounded px-3 py-2 text-sm">
        &gt;
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Number,
      required: true
    },
    maxPage: {
      type: Number,
      required: true
    }
  },
  computed: {
    prevDisabled () {
      return this.page === 1
    },
    nextDisabled () {
      return this.page === this.maxPage
    }
  }
}
</script>

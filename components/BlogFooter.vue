<template>
  <div class="footer">
    <p class="copyright">
      &copy; 2021 ksoichiro
    </p>
    <p class="links">
      <a href="https://github.com/ksoichiro" aria-label="GitHub Profile" target="_blank" rel="noopener">
        <LogoGitHubIcon />
      </a>
    </p>
    <Analytics />
  </div>
</template>

<script>
import LogoGitHubIcon from 'vue-ionicons/dist/logo-github.vue'

export default {
  components: {
    LogoGitHubIcon
  }
}
</script>

<style lang="scss" scoped>
.footer {
  text-align: center;
}
</style>

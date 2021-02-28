<template>
  <div class="footer">
    <p class="copyright">
      &copy; 2010 ksoichiro
    </p>
    <div class="links">
      <a href="https://github.com/ksoichiro" aria-label="GitHub Profile" target="_blank" rel="noopener">
        <LogoGitHubIcon />
      </a>
    </div>
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
  border-top: 1px solid $borderColor;
  padding: 2.5rem;
}
</style>

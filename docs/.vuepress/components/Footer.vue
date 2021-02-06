<template>
  <div class="footer">
    <p class="copyright">&copy; 2021 ksoichiro</p>
    <p class="links">
      <a href="https://github.com/ksoichiro" target="_blank">
        <LogoGitHubIcon />
      </a>
    </p>
    <Analytics />
  </div>
</template>

<style scoped>
.footer {
  text-align: center;
}
</style>

<script>
import LogoGitHubIcon from 'vue-ionicons/dist/logo-github.vue'
import Analytics from './Analytics.vue'

export default {
  components: {
    LogoGitHubIcon,
    Analytics,
  }
}
</script>

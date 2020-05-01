<template>
 <div class="container">
 </div>
</template>

<script>
  import apiConfig from '../../config/api.config'
  export default {
    name: 'login-index',
    created () {
      process.server ? this.$router.push('/') : location.href = apiConfig.mainDomain + 'manage/login?position=' + apiConfig.otcDomain
    }
  }
</script>

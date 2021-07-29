<template>
  <div class="redirect-page">
    You are logged in and shall be redirected shortly...
  </div>
</template>

<script>
export default {
  name: 'done',
  created(){
    if (location.search) {
      location.replace('/')
    } else {
      setTimeout(() => {
        this.$router.push('/')
      }, 5000);
    }
  }
}
</script>

<style lang="scss">
</style>
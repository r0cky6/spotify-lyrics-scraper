<template>
  <div class="home-page">
    <div class="container">
      Home Page
    <hr>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{}
  },
  computed: {
    user(){
      return this.$store.getters.getCurrentUser 
    }
  },
}
</script>

<style lang="scss">

</style>
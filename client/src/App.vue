<template>
  <div id='app'>
    <header class='header'>
      <div class="container">
        <router-link to="/">home</router-link>
        <router-link to="/user">user</router-link>
        <router-link to="/login">login</router-link>
        <router-link to="/signup">signup</router-link>
        <router-link to="/logout">logout</router-link>
        <button @click='logout'>Logout</button>
        <button @click='curUser'>curUser</button>
      </div>
      
    </header>
    
    <router-view :key='$route.path'/>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    created(){
      if (!this.user?.username) this.$store.dispatch('setCurrentUser')
    },
    computed: {
      user(){ return this.$store.getters.getCurrentUser },
    },
    methods: {
      async logout(){
        axios.post("/api/logout")
        this.$store.dispatch('clearCurrentUser')
        location.reload()
      }
    }
  }
</script>

<style lang="scss">
  @import './scss/app.scss'
</style>

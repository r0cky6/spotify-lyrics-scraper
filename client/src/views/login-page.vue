<template>
  <div class='login'>
    <div class='container'>
      <div class='form login__form'>
        <input  class='login__input login__name'      type='text'     placeholder='name'     v-model='form.username'  v-if='!login'>
        <input  class='login__input login__email'     type='email'    placeholder='email'    v-model='form.email'>
        <input  class='login__input login__password'  type='password' placeholder='password' v-model='form.password'>
        <button class='login__submit-btn' @click='submitForm'>{{login ? `Login` : `Signup`}}</button>
        <div    class='login__form-bottom-row'>
          <label  class='login__label' for='remember'>
            <input  class='login__remember' name='remember' type='checkbox' v-model='form.remember'> Remember me
          </label>
          <button class='login__toggle-btn' @click='(e)=>{e.preventDefault(); login = !login}'>{{!login ? 'Login' : 'Signup'}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'login',

  data(){
    return {
      msg: '',
      login: this.$route.path.includes('login'),
      form: {}
    }
  },

  computed: {
    user(){
      return this.$store.getters.getCurrentUser 
    }
  },

  created(){
    if (this.user?._id) this.$router.push('/redirect')
  },

  watch: {
    login: {
      handler(newVal){
        this.$router.push(newVal ? '/login' : '/signup')
      }
    }
  }, 

  methods: {
    async submitForm(){
      const res = await axios.post(this.login ? `/api/login` : `/api/signup`, { form: this.form })
      this.form = {}
      this.$store.dispatch('setCurrentUser')
      this.msg = res.data // TODO : send msg to the store to display as a pop up later on
      this.$router.push('/redirect?r')
    }
  }
}
</script>

<style lang='scss'>
  @import '../scss/login.scss';
</style>
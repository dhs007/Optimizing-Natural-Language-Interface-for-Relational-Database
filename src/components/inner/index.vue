<template>
  <v-app>
    <div>
      <!-- <sidebar style="float:left"></sidebar> -->
      <router-view></router-view>
    </div>
  </v-app>
</template>
<script>
import axios from 'axios'
export default {
  name: 'inner',
  created () {
    if(window.localStorage.getItem('token')) {
      let token = window.localStorage.getItem('token')
      console.log('Token is present')
    }
    else {
      console.log('Token not present')
      this.$store.commit('createSnackbar', {
        color: 'red',
        content: 'Login Required'
      })
      this.$router.push({path: '/auth/login'})
    }
  }
}
</script>
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
      var config = {
          headers: {'Authorization': "Bearer " + token}
      };
      axios.get(this.$store.getters.getBaseUrl+'/tokenCheck', config)
      .then((res) => {
        if(res.data.success == false) {
          localStorage.removeItem('token')
          console.log('Wrong Token')
              this.$store.commit('createSnackbar', {
            color: 'red',
            content: 'Session Expired Login Again'
          })
          this.$router.push({path: '/auth/login'})
        } else {
          console.log('Token verified')
        }
      })
      .catch((err) => {
        console.log(err)
      })
      //console.log('Token is present')
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
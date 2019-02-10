<template>
  <v-app></v-app>
</template>
<script>
import axios from 'axios'
export default {
  name: 'emailverify',
  data () {
    return {
      token: ''
    }
  },
  created () {
    this.token = this.$route.query.id
    let obj = {
        token: this.token
      }
    axios.post(this.$store.getters.getBaseUrl+'/verify', obj)
      .then((res)=> {
        console.log('Printing Data');
        console.log(res.data)
        if(res.data == "Email Verified") {
          this.$store.commit('createSnackbar', {
                color: 'green',
                content: 'Email verified'
          })
          this.$router.push('/auth/login')
        } else {
          this.$store.commit('createSnackbar', {
                color: 'red',
                content: 'Email not verified'
          })
          this.$router.push('/auth/login')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
</script>


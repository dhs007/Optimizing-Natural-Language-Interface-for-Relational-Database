<template>
  <v-app>
    <div>
      <hello-world></hello-world>
    </div>
  </v-app>
</template>
<script>
import axios from 'axios'
import HelloWorld from './utils/HelloWorld'
export default {
  name: 'home',
  components: {
    'hello-world' : HelloWorld
  },
  created () {
    let token = window.localStorage.getItem('token')
    var config = {
        headers: {'Authorization': "Bearer " + token}
    };
    console.log(token)
    axios.get(this.$store.getters.getBaseUrl+'/test', config)
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
</script>
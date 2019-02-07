<template>
  <v-app>
    <div>
      <router-view/>
    </div>
  </v-app>
</template>
<script>
export default {
  name: 'outer',
  created () {
    let token = window.localStorage.getItem('token')
    if(token) {
      this.$router.push('/app/home')
    }
  }
}
</script>
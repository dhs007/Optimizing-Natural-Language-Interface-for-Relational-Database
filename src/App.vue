<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <v-snackbar
      v-model="$store.getters.getSnack.state"
      :color="$store.getters.getSnack.color"
      top
      :timeout=1500
      >
      {{$store.getters.getSnack.content}}
    </v-snackbar>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

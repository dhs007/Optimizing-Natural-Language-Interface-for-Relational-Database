<template>
  <v-app>
    <v-layout justify-center>
      <v-flex xs12 sm6>
        <v-card class="pa-4">
          <v-card-title primary-title class="headline mb-0">
            Login
          </v-card-title>
          <div>
            <v-form v-model="valid">
              <v-container fluid>
                <v-layout row wrap>
                  <v-flex md10 offset-md1>
                    <v-text-field
                      v-model="email"
                      :rules="emailRules"
                      label="Email"
                    ></v-text-field>
                  </v-flex>
                  <v-flex md10 offset-md1>
                    <v-text-field
                      :rules="[rules.required, rules.min]"
                      v-model="password"
                      label="Password"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout justify-end @click="redirSignup">
                  <v-btn flat small color="primary">New User Login Now</v-btn>
                </v-layout>
              </v-container>
            </v-form>
          </div>
          <v-card-actions>
            <v-layout justify-center>
              <v-btn :disabled="!valid" @click="login" :loading="loading" color="orange">Login</v-btn>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
import axios from 'axios'
export default {
  name: 'login',
  data () {
    return {
      email: '',
      password: '',
      loading: false,
      valid: true,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters'
      }
    }
  },
  methods: {
    redirSignup () {
      this.$router.push('/signup')
    },
    login () {
      this.loading = true
      let obj = {
        email: this.email,
        password: this.password
      }
      console.log(obj)
      axios.post(this.$store.getters.getBaseUrl+'/login', obj)
        .then((res) => {
          if(res.data.status == 'success') {
            if(res.data.token) {
              console.log(res.data.token)
              this.$store.commit('createSnackbar', {
                color: 'green',
                content: 'Login Successfull'
              })
              localStorage.setItem('token', res.data.token)
              this.$router.push({path: '/app/home'})
            } else {
              this.$store.commit('createSnackbar', {
                color: 'red',
                content: 'Try Again'
              })
              this.loading = false
            }
          } else {
            this.$store.commit('createSnackbar', {
                color: 'red',
                content: res.data.error
              })
              this.loading = false
          }
        })
        .catch(() => {
          this.$store.commit('createSnackbar', {
              color: 'red',
              content: 'Server Error'
            })
          this.loading = false
        })
    }
  }
}
</script>
<template>
  <v-app>
    <v-layout justify-center>
      <v-flex xs12 sm6>
        <v-card class="pa-4">
          <v-card-title primary-title class="headline mb-0">
            Set New Password
          </v-card-title>
          <div>
            <v-form v-model="valid">
              <v-container fluid>
                <v-layout row wrap>
                  <v-flex md10 offset-md1>
                    <v-text-field
                      :rules="[rules.required, rules.min]"
                      v-model="password"
                      label="Password"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex md6>
                     <v-layout justify-start @click="redirLogin">
                        <v-btn flat small color="primary">Go back to login</v-btn>
                      </v-layout>
                  </v-flex>
                  <v-flex md6>
                    <v-layout justify-end @click="redirSignup">
                      <v-btn flat small color="primary">New User Register Now</v-btn>
                    </v-layout>
                  </v-flex>
                </v-layout>                
              </v-container>
            </v-form>
          </div>
          <v-card-actions>
            <v-layout justify-center>
              <v-btn :disabled="!valid" @click="forgetPassFunc" :loading="loading" color="orange">Set New Password</v-btn>
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
  name: 'setPassword',
  data () {
    return {
      token: '',
      password: '',
      loading: false,
      valid: true,
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
    redirLogin () {
      this.$router.push('/auth/login')
    },
    forgetPassFunc () {
      this.loading = true
      let obj = {
        password: this.password,
        token: this.token
      }
      axios.post(this.$store.getters.getBaseUrl+'/resetPass2', obj)
        .then((res) => {
          console.log(res.data)
          if(res.data.success) {
             this.$store.commit('createSnackbar', {
              color: 'green',
              content: res.data.message
            })
            this.$router.push('/auth/login')
          } else {
            this.$store.commit('createSnackbar', {
              color: 'red',
              content: res.data.message
            })
          }
          this.loading = false
        })
        .catch(() => {
          this.$store.commit('createSnackbar', {
              color: 'red',
              content: 'Server Error'
            })
          this.loading = false
        })
    }
  },
  created () {
    this.token = this.$route.query.id
    let obj = {
      token: this.token
    }
    axios.post(this.$store.getters.getBaseUrl+'/resetPass1', obj)
      .then((res) => {
        if(!res.data.success) {
          this.$store.commit('createSnackbar', {
            color: 'red',
            content: res.data.message
          })
        }
      })
  }
}
</script>
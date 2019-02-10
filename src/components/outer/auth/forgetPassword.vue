<template>
  <v-app>
    <v-layout justify-center>
      <v-flex xs12 sm6>
        <v-card class="pa-4">
          <v-card-title primary-title class="headline mb-0">
            Forget Password
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
              <v-btn :disabled="!valid" @click="forgetPassFunc" :loading="loading" color="orange">Submit</v-btn>
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
  name: 'ForgetPassword',
  data () {
    return {
      email: '',
      loading: false,
      valid: true,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ]
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
        email: this.email,
      }
      console.log(obj)
      axios.post(this.$store.getters.getBaseUrl+'/forgetPassword', obj)
        .then((res) => {
          console.log(res.data)
          if(res.data.success) {

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
  }
}
</script>
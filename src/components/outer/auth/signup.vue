<template>
  <v-app>
    <v-layout justify-center>
      <v-flex xs12 sm6>
        <v-card class="pa-4">
           <v-card-title primary-title class="headline mb-0">
            Register
          </v-card-title>
          <v-card-text>
            <v-form v-model="valid">
              <v-container fluid>
                <v-layout row wrap>
                  <v-flex md10 offset-md1>
                    <v-text-field
                      v-model="name"
                      :rules="[rules.required]"
                      label="Name"
                    ></v-text-field>
                  </v-flex>
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
                <v-layout justify-end @click="redirLogin">
                  <v-btn flat small color="primary">Already Registered Login Now</v-btn>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-layout justify-center>
              <v-btn :disabled="!valid" @click="signup" :loading="loading" color="orange">Login</v-btn>
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
  name: 'signup',
  data () {
    return {
      name: '',
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
    redirLogin () {
      this.$router.push('/auth/login')
    },
    signup () {
      this.loading = true
      let obj = {
        name: this.name,
        email: this.email,
        password: this.password
      }
      console.log(obj)
      axios.post(this.$store.getters.getBaseUrl+'/signup', obj)
        .then((res) => {
          console.log(res)
          if(res.data.status == 'success') {
            this.$store.commit('createSnackbar', {
              color: 'green',
              content: 'Registration Successfull'
            })
            this.$router.push({path: '/auth/login'})
          }
          else {
            this.$store.commit('createSnackbar', {
              color: 'red',
              content: res.data.error
            })
            this.loading = false
          }
        })
        .catch(() => {
          this.$store.commit('networkError')
          this.loading = false
        })
    }
  }
}
</script>
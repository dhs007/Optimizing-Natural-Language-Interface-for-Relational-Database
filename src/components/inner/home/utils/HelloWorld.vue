<template>
  <v-app id="inspire">
    <v-container fluid>
      <v-layout row wrap justify-center class="mt-4">
        <v-flex xs12 sm10 text-xs-center>
          <v-textarea outline
            label="The text"
            v-model="text"
            textarea
          ></v-textarea>
        </v-flex>
        <v-flex xs12 sm8 md4 text-xs-center>
          <speech-to-text :text.sync="text" @speechend="speechEnd"></speech-to-text>
        </v-flex>
        <v-flex xs12 text-xs-center class="mt-4">
          {{sentences}}
        </v-flex>
        <v-flex xs12 text-xs-center class="mt-4">
          <v-btn color="primary" dark @click="submit">Submit</v-btn>
        </v-flex>
        <v-textarea v-if="complete" outline
            label="Output"
            v-model="output"
            textarea
          ></v-textarea>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import speechToText from './speechToText'
import axios from 'axios'

export default {
  name: 'HelloWorld',
  components: {
    'speech-to-text' : speechToText
  },
  data () {
    return {
      complete: 0,
      output: '',
      text: '',
      sentences: null,
      baseUrl: "https://api.api.ai/v1/",
      outputVariables: ["population", "birthday"],
      endpoint: "http://dbpedia.org/sparql?format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&query=",
      queries: ["SELECT ?city ?population WHERE { ?city rdfs:label '@@@placeholder@@@'@en. ?city <http://dbpedia.org/ontology/populationTotal> ?population} LIMIT 10", "SELECT ?birthday WHERE { ?person rdfs:label '@@@placeholder@@@'@en. ?person <http://dbpedia.org/ontology/birthDate> ?birthday } LIMIT 10"],
      accessToken: "845fd3a89eba4ede94d90cd74825d007"
    }
  },
  methods: {
    speechEnd ({sentences, text}) {
      console.log('text', text)
      console.log('sentences', sentences)
      this.sentences = sentences
    },
    submit() {
      this.complete = 1
      console.log(this.text)
      let headers = {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': "Bearer " + this.accessToken
        }
      let obj = JSON.stringify({query: this.text, lang: "en", sessionId: "somerandomthing"})
      axios.post(this.baseUrl + "query?v=20150910", obj,{headers: headers})
        .then((res) => {
          console.log(res.data)
          let intentNum = null
          let placeholder = null
          if(res.data.result.action == "show.population") {
            intentNum = 0
            placeholder = res.data.result.parameters.city
          }
          String.prototype.replaceAll = function (str1, str2, ignore)
          {
            return this.replace(new RegExp(str1.replace(/([\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, function (c) {
                return "\\" + c;
            }), 'g' + (ignore ? 'i' : '')), str2)
          }
          let queryComplete = this.queries[intentNum].replaceAll("@@@placeholder@@@", placeholder)
          // console.log(queryComplete)
          // console.log(this.endpoint + queryComplete)
          axios.post(this.endpoint + queryComplete,{headers: {}})
            .then((res) => {
              // console.log(res.data)
              // console.log(res.data.results.bindings[0].population.value)
              var bindings = res.data.results.bindings;
              let output = bindings[0][this.outputVariables[intentNum]].value;
              this.output = this.text+" = "+res.data.results.bindings[0].population.value
              this.output +=  "\nThe query used for this output was:\n" + queryComplete.replaceAll("<", "&lt;")
              console.log(output)
            })
            .catch((err)=> {
              console.log(err)
            })
          // if(res.data.result.action == "show.birthday") {
          //   intentNum = 1
          //   placeholder = val.result.parameters.givenname + " " + val.result.parameters.lastname
          // }
          // console.log(intentNum)
          // console.log(placeholder)
          // if(res.data.result.action == "show.persons") {
            
          // }
        })
        .catch((err)=> {
          console.log(err)
        })
    }
  }
}
</script>

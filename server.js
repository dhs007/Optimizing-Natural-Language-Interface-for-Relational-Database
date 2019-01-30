require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV; // development
const stage = require('./config')[environment];

const connection = require('./backend/db/connect');
//const path = require('path');


const app = express();

const routes = require('./backend/routes/index');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

if (environment !== 'production') {
  app.use(logger('dev'));
}

app.use('/',express.static(__dirname + "/dist"));
app.use('/api/v1', routes);

app.listen(`${stage.port}`, () => {
  console.log(`Server started on port ${stage.port}`);
});

module.exports = app;
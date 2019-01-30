

var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: ''
})

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
})


let query = "CREATE DATABASE if not exists majorproject";
connection.query(query, function (error) {
  if (error) throw error;
  console.log('Database created');
});

query = "Use majorproject";
connection.query(query, function (error) {
  if (error) throw error;
  console.log('Using Database majorproject');
});

query = "Create table if not exists users("+
  "userId Integer Unsigned NOT NULL AUTO_INCREMENT,"+
  "name VARCHAR(255)  NOT NULL,"+
  "email VARCHAR(255)  NOT NULL,"+
  "password VARCHAR(255)  NOT NULL ,"+
  "status TINYINT Unsigned NOT NULL ,"+
  "created Timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP,"+
  "lastUpdated Timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,"+
  "PRIMARY KEY(userId))";
connection.query(query, function (error) {
  if (error) throw error;
  console.log('user table created');
});

module.exports = {connection};


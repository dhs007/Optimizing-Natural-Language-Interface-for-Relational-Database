const db = require('../db/connect');
const mysql = require('mysql');
const  bcrypt = require('bcryptjs');

 let createUser =  (name,email,password) => {

  return new Promise((resolve,reject) => {
    let result = {};
    checkEmailExits(email)
      .then((res) => {
        if(res>0) {
          result.status = false;
          result.error = 'Email already exists';
          resolve(result);
        } else {
          bcrypt.genSalt(10,(err,salt) => {
            if(err) console.log(err);
            bcrypt.hash(password,salt, (err,hash) => {
              if(err) console.log(err);
              password = hash;
              console.log('password');
              console.log(password);
              let query = 'INSERT INTO users (name, email, password) VALUES ?';
              let value = [[name,email,password]];
              db.connection.query(query,[value], (error) => {
                if(error) reject(error);
                else {
                  result.status = true;
                  resolve(result);
                }
              })
            })
          })
        }
      })
      .catch((err) => {
        console.log(err);
      })
  })
};

let checkEmailExits = (email) => {
  return new Promise((resolve,reject) => {
    let query = 'Select email from users WHERE email ='+ mysql.escape(email);
    db.connection.query(query,(error, rows,fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows.length);
      }
    })
  })
}

function authenticate(email,password) {
  return new Promise ((resolve,reject) => {
    let query = 'Select userId,name,email,status,password from users WHERE email ='+ mysql.escape(email);
    db.connection.query(query,(error, rows,fields) => {
      if (error) {
        reject(error);
      } else {
        bcrypt.compare(password,rows[0].password,(err, res) => {
          if(err) {
            console.log('err');
            let test = [];
            resolve(test);
          }
          else if(res) {
            console.log('res');
            resolve(rows);
          } else {
            console.log('else');
            resolve([]);
          }
        })
      }

    })
 });
}






module.exports = {
  createUser,
  authenticate,
  checkEmailExits
};
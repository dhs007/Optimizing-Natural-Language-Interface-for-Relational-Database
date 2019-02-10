const db = require('../db/connect');
const mysql = require('mysql');
const  bcrypt = require('bcryptjs');

 let createUser =  (name,email,password) => {

  return new Promise((resolve,reject) => {
    let result = {};
    checkEmailExits(email)
      .then((res) => {
        if(res.length>0) {
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
    let query = 'Select email,status from users WHERE email ='+ mysql.escape(email);
    db.connection.query(query,(error, rows) => {
      if (error) {
        reject(error);
      } else {
        // console.log('Printing data')
        // console.log(rows.length);
        resolve(rows);
      }
    })
  })
}

let verifyEmail = (email) => {
  return new Promise((resolve,reject) => {
    console.log(email)
    let query = 'Update users SET status = 1 WHERE email ='+ mysql.escape(email);
    db.connection.query(query,(error, rows,fields) => {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    })
  })
}

function authenticate(email,password) {
  console.log(password)
  return new Promise ((resolve,reject) => {
    let query = 'Select userId,name,email,status,password from users WHERE email ='+ mysql.escape(email);
    db.connection.query(query,(error, rows,fields) => {
      if (error) {
        reject(error);
      } else {
        if(rows.length > 0) {
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
        } else {
          let test = [];
          resolve(test);
        }
      }

    })
 });
}

let changePassword = (email,password) => {
  return new Promise((resolve,reject) => {
    bcrypt.genSalt(10,(err,salt) => {
      if(err) console.log(err);
      bcrypt.hash(password,salt, (err,hash) => {
        if(err) console.log(err);
        password = hash;
        let query = 'Update users SET password = '+ mysql.escape(password) +' WHERE email ='+ mysql.escape(email);
        db.connection.query(query,(error, rows,fields) => {
          if(error) {
            resolve(false)
          } else {
            resolve(true)
          }
        })
      })
    })
  })
}




module.exports = {
  createUser,
  authenticate,
  checkEmailExits,
  verifyEmail,
  changePassword
};
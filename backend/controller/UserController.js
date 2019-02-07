const model = require('../Model/Users');
const jwt    = require('jsonwebtoken');
var nodemailer = require('nodemailer');

let create = (req,res) => {
  let output = {};
  if(req.body.name && req.body.email && req.body.password) {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    model.createUser(name,email,password)
      .then((response) => {
        console.log(response)
        console.log('Email sending')
        if(response.status) {

          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                   user: process.env.email,
                   pass: process.env.password
               }
           });

           const payload = {
            name: name,
            email: email,
          };
          let token = jwt.sign(payload, process.env.JWT_SECRET_FOR_EMAIL, {
            expiresIn : 60*60*24
          });
          let link="http://"+req.get('host')+"/#/auth/email/verify?id="+token;
          //let link = "http://localhost:8080/#/auth/email/verify?id="+token
           
           const mailOptions = {
            from: process.env.email, // sender address
            to: email, // list of receivers
            subject: 'Email Verification', // Subject line
            html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
          };

          transporter.sendMail(mailOptions, function (err, info) {
            if(err)
              console.log(err)
            else
              console.log(info);
         });

          output.status = 'success';
          res.status(200).send(output);
        } else {
          output.status = 'fail';
          output.error = response.error;
          res.status(200).send(output);
        }
      })
      .catch((error)=> {
        console.log(error);
        output.status = 'Server Problem';
        res.status(200).send(output);
      })
  } else {
      output.status = 'Parameters missing'
      res.status(200).send(output);
  }
}


function login(req,res) {
  //let output = {};
  console.log('In controller');
  model.authenticate(req.body.email,req.body.password)
    .then((response) => {
      console.log(response);
      let output = {};
      if(response.length == 0) {
        output.status = 'fail';
        output.error = 'Wrong username or password';
      } else {
        let userData = response[0];
        if(userData.status == 0) {
          output.status = 'fail';
          output.error = 'Email verification pending';
        } else {

          const payload = {
            userId: userData.userId,
            name: userData.name,
            email: userData.email,
            status: userData.status   
          };
          let token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn : 60*60*24
          });
          output.token = token;
          output.status = 'success';
        }
      }
      res.status(200).send(output);
    })
    .catch((err) => {
      console.log(err);
      let output = {};
      output.status = 'fail';
      output.error = 'Server Error';
      res.status(200).send(output);
    })
}

let verify = (req,res) => {
  var token = req.body.token;
  if(token) {
    jwt.verify(token, process.env.JWT_SECRET_FOR_EMAIL, (err, decoded) => {
      if (err) {
        console.log(err)
      } else {
        let email = decoded.email
        model.verifyEmail(email)
          .then((response) => {
            if(response) {
              res.send('Email Verified')
            } else {
              res.send('Error')
            }
          })
          .catch((err) => {
            console.log(err)
          })
        //res.send(email)
      }
    })
  }
}

let checkToken = (req,res) => {
  let output = {};
  output.success = true;
  output.message = 'Token is Valid';
  res.status(200).json(output);
}

let test = (req,res)=> {
  let output = {};
  output.data = req.decoded;
  output.status = 'success';
  res.status(200).json(output);
}

module.exports = {
  create,
  login,
  test,
  verify,
  checkToken
};
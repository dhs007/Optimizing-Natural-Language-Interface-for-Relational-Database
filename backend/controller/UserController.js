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

          output.success = true
          output.message = 'Registeration success verify email to login'
          res.status(200).send(output);
        } else {
          output.success = false
          output.message = response.error;
          res.status(200).send(output);
        }
      })
      .catch((error)=> {
        console.log(error);
        output.success = false
        output.message = 'Server Problem';
        res.status(200).send(output);
      })
  } else {
      output.success = false
      output.message = 'Parameters missing'
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
        output.success = false;
        output.message = 'Wrong username or password';
      } else {
        let userData = response[0];
        if(userData.status == 0) {
          output.success = false;
          output.message = 'Email verification pending';
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
          output.success = true;
          output.token = token;
          output.message = "Enjoy your token"
        }
      }
      res.status(200).send(output);
    })
    .catch((err) => {
      console.log(err);
      let output = {};
      output.success = false;
      output.message = 'Server Error';
      res.status(200).send(output);
    })
}

let verifyEmailToken = (req,res) => {
  var token = req.body.token;
  let output = {}
  if(token) {
    jwt.verify(token, process.env.JWT_SECRET_FOR_EMAIL, (err, decoded) => {
      if(err) {
        output.success = false
        output.message = 'Password Reset Link expired'
      } else {
        output.success = true
        output.message = 'Valid Token'
      }
    })
  } else {
    output.success = false
    output.message = 'Invalid Link'
  }
  res.status(200).json(output)
}

let resetPass = (req,res) => {
  let token = req.body.token
  let password = req.body.password
  let output = {}
  if(token) {
    jwt.verify(token, process.env.JWT_SECRET_FOR_EMAIL, (err, decoded) => {
      if(err) {
        output.success = false
        output.message = 'Password Reset Link expired'
        res.status(200).json(output)
      } else {
        model.changePassword(decoded.email,password)
          .then((response) => {
            if(response) {
              output.success = true
              output.message = 'Password Reset Success'
              res.status(200).json(output)
            } else {
              output.success = false
              output.message = 'Password Reset Fail'
              res.status(200).json(output)
            }
          })
          .catch((err) => {
            output.success = false
            output.message = 'Password Reset Fail'
            res.status(200).json(output)
          })
      }
    })
  } else {
    output.success = false
    output.message = 'Invalid Link'
  }
  
}

let verify = (req,res) => {
  var token = req.body.token;
  if(token) {
    jwt.verify(token, process.env.JWT_SECRET_FOR_EMAIL, (err, decoded) => {
      if (err) {
        console.log(err)
        res.send('Error')
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

let checkEmail = (req,res) => {
  let email = req.body.email
  let output = {}
  model.checkEmailExits(email)
    .then((response) => {
      if(response.length == 0) {
        output.success = false;
        output.message = 'Email does not exist';
      } else {

        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
                 user: process.env.email,
                 pass: process.env.password
             }
         });
        const payload = {
          email: email,
        };
        let token = jwt.sign(payload, process.env.JWT_SECRET_FOR_EMAIL, {
          expiresIn : 60*60*24
        });
        //let link="http://"+req.get('host')+"/#/auth/forgetPassword?id="+token;
        let link="http://localhost:8080/#/auth/setPassword?id="+token;
        const mailOptions = {
          from: process.env.email, // sender address
          to: email, // list of receivers
          subject: 'Forget Password', // Subject line
          html : "Hello,<br> Please Click on the link to recover your password.<br><a href="+link+">Click here to recove password</a>" 
        };

        transporter.sendMail(mailOptions, function (err, info) {
          if(err)
            console.log(err)
          else
            console.log(info);
       });
        output.success = true;
        output.message = 'Email exist';
      }
      res.status(200).json(output)
    })
    .catch((err) => {
      console.log(err)
    })
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
  checkToken,
  checkEmail,
  verifyEmailToken,
  resetPass
};
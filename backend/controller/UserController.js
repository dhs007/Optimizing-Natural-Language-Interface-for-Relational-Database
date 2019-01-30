const model = require('../Model/Users');
const jwt    = require('jsonwebtoken');

let create = (req,res) => {
  let output = {};
  if(req.body.name && req.body.email && req.body.password) {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    model.createUser(name,email,password)
      .then((response) => {
        console.log(response)
        if(response.status) {
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
  // if(model.authenticate(req.body.email && req.body.password))
  //   res.status(200).send('yes');
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


let test = (req,res)=> {
  let output = {};
  output.data = req.decoded;
  output.status = 'success';
  res.status(200).json(output);
}

module.exports = {
  create,
  login,
  test
};
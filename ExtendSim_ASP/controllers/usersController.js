var db = require('../models');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var axios = require("axios");
var fs = require("fs");
var reader = require('filereader');
const dotenv = require('dotenv');

const saltRounds = 10;

// Heroku IP address
var IPaddress = "184.171.246.58";
// var IPaddress = "192.168.1.149";
// var IPaddress = "172.31.98.29";
// var IPaddress = "192.168.1.149";

// UC Davis Extension IP address
// var IPaddress = "10.0.20.228";
var scenarioFolderPathname;
var scenarioFilenames = ['Resource Classes.txt',
                         'Model Parameters.txt',
                         'Pools.txt',
                         'Process Route.txt',
                         'Resource Requirement Expressions.txt',
                         'Resources.txt'];

const c_ExtendSimModelPath = "C:/Users/Administrator/Documents/ExtendSim10ASP_Prod/ASP/ASP Servers/ExtendSim Models/ASP example model (GS).mox"

// Routes
// =============================================================
module.exports = {
  validateToken: function(req, res) {
    return jwt.verify(req.body.token, 'shhhhh', function(err, decoded) {
      if (err) {
        return res.status(400).send({ msg: 'The token is bad!' });
      }
      return res.status(200).send({ msg: 'The token is good!' });
    });
  },
  login: function(req, res) {
    console.log("Login: entry - req.username=" + req.body.username);
    db.user.findOne(
    { 
      where: { username: req.body.username } 
    }).
    then(dbresult => {
      if (!dbresult) {
        return res.status(400).send({ msg: 'Username="' + req.body.username + '" is not a registered username'});
      } else {
        bcrypt.compare(req.body.password, dbresult.password, function(err, bRes) 
        {
          if (!bRes) {
            res.status(400).send({ msg: 'Invalid  Password' });
          } else {
            var token = jwt.sign({ username: dbresult.bRes }, process.env.TOKEN_SECRET);
            var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/LoginToServer";
            myMethod = "POST"   
            var myheaders = { 
              accept: "application/json", 
            }; 
            var options_textPOST = {
              method : "POST",
              accept : "application/json",
              contentType: "application/json;charset=utf-8",
              headers : myheaders,
              muteHttpExceptions : false
            };
            console.log('Login: Logging into ExtendSim server ' + queryURL + " for username=" + req.body.username);
            axios({
              url: queryURL,
              method: 'post',
              accept : 'application/json',
              contentType: 'application/json;charset=utf-8',
              headers : myheaders,
              params: {
                  username: req.body.username,
                  password: req.body.password
              }
            }).
            then(function(response) {
              console.log('ExtendSimASP_login: ' + response.data);
              const { _id: id } = dbresult;
              return res.json({ userLoginSessionID: response.data,
                                id: id,
                                username: req.body.username,
                                token: token });
            });
          };
        });
      };
    });
  },
  signup: function(req, res) {
    const password = bcrypt.hashSync(req.body.password, 10);
    const username = req.body.username;
    console.log("signup: username=" + req.body.username);
    db.user.findOne(
      { 
        where: { username: req.body.username } 
      }).
      then(dbresult => {
        console.log("signup: dbresult=" + JSON.stringify(dbresult));
        if (dbresult != null) {
            console.log("Username exists already");
          return res.status(400).send({ msg: 'Username="' + req.body.username + '" has already been registered' });
        } else {
          db.user
            .create({ username, password })
            .then(function(dbResponse) {
              console.log("dbResponse=" + JSON.stringify(dbResponse));
              console.log('TOKEN_SECRET=' + process.env.TOKEN_SECRET);
              var token = jwt.sign({ username: dbResponse.bRes }, process.env.TOKEN_SECRET);
              const { _id: id} = dbResponse;
              return res.json({response: dbResponse,
                               id: id,
                               username: username,
                               token: token});
            })
            .catch(function(err) {
              console.log("Error: " + err);
              return res.status(422).json({error: err})
            });
        }
      });
  }
};

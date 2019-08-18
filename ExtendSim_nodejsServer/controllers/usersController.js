var axios = require("axios");
// Heroku IP address
var IPaddress = "184.171.246.58";
// var IPaddress = "192.168.1.149";
// var IPaddress = "172.31.98.29";
// var IPaddress = "192.168.1.149";

// UC Davis Extension IP address
// var IPaddress = "10.0.20.228";
// Routes
// =============================================================
module.exports = {

  login: function(req, res) {
    console.log("Login: entry - req.username=" + JSON.stringify(req.body));
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
      return res.json({ userLoginSessionID: response.data,
                        username: req.body.username 
                      });
    });
  },
};

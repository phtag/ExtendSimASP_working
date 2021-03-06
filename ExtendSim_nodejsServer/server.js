// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require('express');
const routes = require('./routes');
// const dotenv = require('dotenv').config(); 
var cors = require("cors");
global.atob = require("atob");
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3001;

app.use(express.json({limit: '50000mb'}));
app.use(express.urlencoded({limit: '50000mb', extended: true}));
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//  TESTING (temporary...)
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); 
// Requiring our models for syncing
// var db = require('./models');

// Sets up the Express app to handle data parsing

console.log('Server starting...');
// Static directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}
app.use(cors({ credentials: true, origin: true }));
app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
// Add routes, both API and view
app.use(routes);
// var winax = require('winax');
// var ExtendSimApp = new winax.Object('Extendsim.Application', {
//   Arguments: '-platform offscreen'
// });


// ExtendSimApp.Execute('OpenExtendFile("C:\\Users\\peter\\Desktop\\ExtendSim ASP License\\ExtendSim ASP server\\ExtendSim models\\ASP v10 models\\ASP example model (GS).mox")');

// Syncing our sequelize models and then starting our Express app
// =============================================================
// db.sequelize.sync({ force: false }).then(function() {
  
app.listen(PORT, function() {
  console.log('App listening on PORT ' + PORT);
});
// });

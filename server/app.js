// var mongo = require('mongodb')
const config = require("./config.js");
const rateLimit = require("express-rate-limit");

var express = require('express');
var https = require('https');
var fs = require('fs');
// var bodyParser = require('body-parser')
// var schedule_service = require('./schedule_service')
// var service_instance = new schedule_service();
var app = express();

app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
 
const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 20 // limit each IP to 20 requests per windowMs
});
 
//  apply to all requests
app.use(limiter);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var router = require('./router');
app.use(router);

var port = process.argv[2] || 4000;

var options = {
  key: fs.readFileSync(config.key),
  cert: fs.readFileSync(config.cert),
};

var server = https.createServer(options, app).listen(port, function(){
  console.log('Honorable app listening on port ' + port);
});

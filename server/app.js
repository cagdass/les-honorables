// var mongo = require('mongodb')
var express = require('express');
// var bodyParser = require('body-parser')
// var schedule_service = require('./schedule_service')
// var service_instance = new schedule_service();
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var router = require('./router');
app.use(router);

var port = process.argv[2];

app.listen(port, function () {
  console.log('Honorable app listening on port ' + port);
});

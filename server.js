'use strict';

// set up variables
var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var port = process.env.PORT || 3000;

// load resources from the distribution folder on the production
if (!process.env.PRODUCTION) {
  app.use(express.static(__dirname + '/public'));
} else {
  app.use(express.static(__dirname + '/public/dist'));
}

app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

// listen (start app with node server.js)
server.listen(port);
console.log("App listening on port " + port);

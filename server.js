'use strict';

// set up variables
const path = require('path');

const express = require('express');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const request = require('request');

const authSecurity = require("./app/routes/authSecurity");

const RequestQueue = require('node-request-queue');
const requestQueue = new RequestQueue(40, 100000);

// load resources from the distribution folder on the production
var publicFolder = '/public';
if (process.env.PRODUCTION) {
  publicFolder = '/public/dist';
}

app.use(express.static(__dirname + publicFolder));

app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

app.use(bodyParser.json());

// listen (start app with node server.js)
server.listen(port);
console.log("App listening on port " + port);

// application
require("./app/routes/application.route")(path, app);

// route to redirect user after authentication
require("./app/routes/authRedirect.route")(app, request, authSecurity);

// route to hide sign in button at successful authentication
require("./app/routes/authCheck.route")(app, authSecurity);

// route to get files
require("./app/routes/filesList.route")(app, authSecurity, request);

// route to delete files one by one
require("./app/routes/delete.route")(app, authSecurity, request);

// router to delete multiple files
require("./app/routes/massDelete.route")(app, authSecurity, requestQueue);

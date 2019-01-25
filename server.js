'use strict';

// set up variables
var express = require('express');
var request = require('request');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var path = require('path');
var port = process.env.PORT || 3000;

var code = "";
var token = "";

// load resources from the distribution folder on the production
if (!process.env.PRODUCTION) {
  app.use(express.static(__dirname + '/public'));
} else {
  app.use(express.static(__dirname + '/public/dist'));
}

app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

app.use(bodyParser.json());

// listen (start app with node server.js)
server.listen(port);
console.log("App listening on port " + port);

// application
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + 'index.html'));
});

// route to redirect user after authentication
app.get("/authRedirect", function (req, res) {
  code = req.query.code;

  var options = {
    url: 'https://slack.com/api/oauth.access',
    qs: {
      code: req.query.code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI
    },
    method: 'GET'
  };

  request(options, function (error, response, body) {
    var jsonResponse = JSON.parse(body);

    if (!jsonResponse.ok) {
      console.log(jsonResponse);
      res.send("Error encountered: \n" + JSON.stringify(jsonResponse)).status(200).end();
    } else {
      console.log(jsonResponse);
      token = jsonResponse.access_token;
      res.redirect("/");
    }
  });
});

// route to hide sign in button at successful authentication
app.get("/checkAuthentication", function (req, res) {
  var responseStatus = {
    "success": true
  };

  if (!code) {
    responseStatus = {
      "success": false
    };
  }

  res.json(responseStatus);
});

// route to get files
app.get("/filesList", function (req, res) {

  if (token) {
    var options = {
      url: 'https://slack.com/api/files.list',
      qs: {
        token: token
      },
      method: "GET"
    };

    request(options, function (error, response, body) {
      var jsonResponse = JSON.parse(body);

        if (error) {
          console.log(error);
        } else {
          var files = [];
          for (var i = 0; i < jsonResponse.files.length; i++) {
            var file = jsonResponse.files[i];

            if (!file.state) {
              files.push({
                id: file.id,
                name: file.name,
                type: file.filetype,
                thumb: file.thumb_64
              })
            }
          }

          res.json({
            results: files,
            total: files.length
          });
        }
      });
  }
});

// route to delete files
app.post("/delete/:fileId", function (req, res) {
  var fileId = req.params.fileId;

  var options = {
    url: 'https://slack.com/api/files.delete',
    qs: {
      token: token,
      file: fileId
    },
    method: "POST"
  };

  request(options, function (error, response, body) {
    var jsonResponse = JSON.parse(body);

    if (error) {
      console.log(error);
    } else {
      res.json(jsonResponse);
    }
  })
});

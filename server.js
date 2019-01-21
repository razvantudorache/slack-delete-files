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
    uri: 'https://slack.com/api/oauth.access?code='
      + req.query.code +
      '&client_id=' + process.env.CLIENT_ID +
      '&client_secret=' + process.env.CLIENT_SECRET +
      '&redirect_uri=' + process.env.REDIRECT_URI,
    method: 'GET'
  };
  request(options, function (error, response, body) {
    var JSONresponse = JSON.parse(body);
    if (!JSONresponse.ok) {
      console.log(JSONresponse);
      res.send("Error encountered: \n" + JSON.stringify(JSONresponse)).status(200).end();
    } else {
      console.log(JSONresponse);
      // res.send("Success!");
      res.redirect("/");
    }
  });
});

// res.redirect("http://www.google.ro");
// request({
//   url: "https://slack.com/oauth/authorize",
//   qs: {
//     scope: "identity.basic,identity.email",
//     client_id: process.env.CLIENT_ID
//   }
// }, function (error, response, body) {
//   debugger;
// });

// // This route handles GET requests to our root ngrok address and responds with the same "Ngrok is working message" we used before
// app.get('/files', function (req, res) {
//     if (!req.query.token) {
//       res.status(500);
//       console.log("Token is missing");
//     } else {
//       request({
//         url: 'https://slack.com/api/files.list', //URL to hit
//         qs: {token: req.query.token}, //Query string data
//         method: 'GET' //Specify the method
//
//       }, function (error, response, body) {
//         if (error) {
//           console.log(error);
//         } else {
//           res.json(body);
//         }
//       });
//     }
//   }
// );

// app.get('/auth', function (req, res) {
//   request({
//     url: "https://slack.com/oauth/authorize?scope=incoming-webhook&client_id=101540185972.527491816113",
//     qs: {
//       client_id: process.env.CLIENT_ID,
//       client_secret: process.env.CLIENT_SECRET
//     } //Query string data
//   });
//   // res.sendFile(__dirname + '/add_to_slack.html')
// });

// // This route handles get request to a /oauth endpoint. We'll use this endpoint for handling the logic of the Slack oAuth process behind our app.
// app.get('/oauth', function(req, res) {
//   // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
//   if (!req.query.code) {
//     res.status(500);
//     res.send({"Error": "Looks like we're not getting code."});
//     console.log("Looks like we're not getting code.");
//   } else {
//     // If it's there...
//
//     // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
//     request({
//       url: 'https://slack.com/api/oauth.access', //URL to hit
//       qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
//       method: 'GET' //Specify the method
//
//     }, function (error, response, body) {
//       if (error) {
//         console.log(error);
//       } else {
//         res.json(body);
//
//       }
//     })
//   }
// });

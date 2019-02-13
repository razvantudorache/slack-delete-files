'use strict';
var session = require('express-session');

module.exports = function (app) {
  //use sessions for tracking login
  app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true,
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: null
    }
  }));
};
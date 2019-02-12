"use strict";

module.exports = function (app, authSecurity) {
  // remove the user from the session
  app.get('/signOut', function (request, response) {
    request.session.destroy();

    authSecurity.setCode("");
    authSecurity.setToken("");

    response.json({success: true});
  });
};
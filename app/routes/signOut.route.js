"use strict";

module.exports = function (app) {
  // remove the user from the session
  app.get('/signOut', function (request, response) {
    request.session.destroy();

    response.json({success: true});
  });
};
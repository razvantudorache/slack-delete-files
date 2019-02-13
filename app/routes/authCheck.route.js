"use strict";

module.exports = function (app, authSecurity) {
  app.get("/authCheck", function (req, res) {
    var responseStatus = {
      "success": true
    };

    if (!req.session.code) {
      responseStatus = {
        "success": false
      };
    }

    res.json(responseStatus);
  });
};

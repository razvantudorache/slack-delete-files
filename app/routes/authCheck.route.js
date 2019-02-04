"use strict";

module.exports = function (app, authSecurity) {
  app.get("/authCheck", function (req, res) {
    var responseStatus = {
      "success": true
    };

    if (!authSecurity.getCode()) {
      responseStatus = {
        "success": false
      };
    }

    res.json(responseStatus);
  });
};

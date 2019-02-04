"use strict";

module.exports = function (app, authSecurity, request) {
  app.post("/delete/:fileId", function (req, res) {
    var fileId = req.params.fileId;

    var options = {
      url: 'https://slack.com/api/files.delete',
      qs: {
        token: authSecurity.getToken(),
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
    });
  });
};

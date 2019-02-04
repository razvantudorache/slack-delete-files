"use strict";

module.exports = function (app, authSecurity, request) {
  app.get("/filesList", function (req, res) {

    if (authSecurity.getToken()) {
      var options = {
        url: 'https://slack.com/api/files.list',
        qs: {
          token: authSecurity.getToken(),
          count: req.query.limit,
          page: (req.query.start / req.query.limit) + 1,
          types: "images,zips,pdfs"
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
            files.push({
              id: file.id,
              name: file.name,
              type: file.filetype,
              thumb: file.thumb_64
            });
          }

          res.json({
            results: files,
            total: files.length
          });
        }
      });
    }
  });
};

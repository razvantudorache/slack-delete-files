"use strict";

const mimeTypeMap = {
  "images": [],
  "video": [],
  "audio": [],
  "docs": [],
  "archives": []
};

module.exports = function (app, authSecurity, request) {
  app.get("/filesList", function (req, res) {

    if (authSecurity.getToken()) {
      var filters = JSON.parse(req.query.filters);
      var options = {
        url: 'https://slack.com/api/files.list',
        qs: {
          token: authSecurity.getToken(),
          count: req.query.limit,
          page: (req.query.start / req.query.limit) + 1
        },
        method: "GET"
      };

      request(options, function (error, response, body) {
        var jsonResponse = JSON.parse(body);

        if (error) {
          console.log(error);
        } else {
          var files = [];
          var filesToBeExcluded = 0;

          for (var i = 0; i < jsonResponse.files.length; i++) {
            var file = jsonResponse.files[i];

            if (file.mode === "hosted") {
              files.push({
                id: file.id,
                name: file.name,
                type: file.filetype,
                thumb: file.thumb_64 || file.thumb_video
              });
            } else {
              filesToBeExcluded++;
            }
          }

          res.json({
            results: files,
            total: jsonResponse.paging.total - filesToBeExcluded
          });
        }
      });
    }
  });
};

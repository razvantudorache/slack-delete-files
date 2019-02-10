"use strict";

module.exports = function (app, authSecurity, request) {
  app.get("/channelsList", function (req, res) {
    var channels = [];

    if (authSecurity.getToken()) {
      var options = {
        url: 'https://slack.com/api/channels.list',
        qs: {
          token: authSecurity.getToken()
        },
        method: "GET"
      };

      request(options, function (error, response, body) {
        var jsonResponse = JSON.parse(body);

        if (error) {
          console.log(error);
        } else {
          for (var i = 0; i < jsonResponse.channels.length; i++) {
            var channel = jsonResponse.channels[i];

            channels.push({
              "text": channel.name,
              "value": channel.id
            });
          }

          options.url = "https://slack.com/api/groups.list";

          request(options, function (error, response, body) {
            var jsonResponse = JSON.parse(body);

            if (error) {
              console.log(error);
            } else {
              for (var i = 0; i < jsonResponse.groups.length; i++) {
                var group = jsonResponse.groups[i];

                channels.push({
                  "text": group.name,
                  "value": group.id
                });
              }
            }

            res.json({
              results: channels
            });
          });
        }
      });
    }

  });
};
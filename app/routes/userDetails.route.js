"use strict";

module.exports = function (app, authSecurity, request) {
  app.get("/userDetails", function (req, res) {

    var options = {
      url: 'https://slack.com/api/users.info',
      method: 'GET',
      qs: {
        token: req.session.token,
        user: req.session.user
      }
    };

    request(options, function (error, response, body) {
      var jsonResponse = JSON.parse(body);
      var user = null;

      if (error) {
        console.log(error);
      } else {
        if (jsonResponse.ok) {
          user = {
            name: jsonResponse.user.profile.real_name,
            avatar: jsonResponse.user.profile.image_48
          };
        }
      }

      res.json({
        ok: jsonResponse.ok,
        user: user
      });
    });

  });
};

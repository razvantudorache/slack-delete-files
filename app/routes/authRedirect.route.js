"use strict";

module.exports = function (app, request, authSecurity) {
  app.get("/authRedirect", function (req, res) {
    authSecurity.setCode(req.query.code);

    var options = {
      url: 'https://slack.com/api/oauth.access',
      method: 'GET',
      qs: {
        code: req.query.code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI
      }
    };

    request(options, function (error, response, body) {
      var jsonResponse = JSON.parse(body);

      if (!jsonResponse.ok) {
        console.log(jsonResponse);
        res.send("Error encountered: \n" + JSON.stringify(jsonResponse)).status(200).end();
      } else {
        console.log(jsonResponse);
        authSecurity.setToken(jsonResponse.access_token);
        res.redirect("/");
      }
    });
  });
};

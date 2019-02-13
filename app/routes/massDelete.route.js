"use strict";

module.exports = function (app, requestQueue) {
  app.post("/massDelete", function (req, response) {
    var filesId = req.body.filesId;
    var numberOfFileProcessed = 0;
    var responses = [];
    var requests = [];

    for (var i = 0; i < filesId.length; i++) {
      var requestOption = {
        url: 'https://slack.com/api/files.delete',
        qs: {
          token: req.session.token,
          file: filesId[i]
        },
        method: "POST"
      };

      requests.push(requestOption);
    }

    requestQueue.pushAll(requests);

    // Handle successful response
    var callbackSuccessHandler = function (res) {
      numberOfFileProcessed++;
      responses.push(JSON.parse(res));

      if (numberOfFileProcessed === filesId.length) {
        requestQueue.removeListener('resolved', callbackSuccessHandler);
        requestQueue.removeListener('rejected', callbackRejectedHandler);

        response.json({
          ok: true,
          results: responses
        });
      }
    };

    // Handle rejected response
    var callbackRejectedHandler = function (err) {
      console.log(JSON.parse(err));

      requestQueue.removeListener('resolved', callbackSuccessHandler);
      requestQueue.removeListener('rejected', callbackRejectedHandler);
    };

    // Events
    requestQueue.on('resolved', callbackSuccessHandler);
    requestQueue.on('rejected', callbackRejectedHandler);
  });
};

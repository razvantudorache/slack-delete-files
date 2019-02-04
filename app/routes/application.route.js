"use strict";

module.exports = function (path, app) {
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + 'index.html'));
  });
};

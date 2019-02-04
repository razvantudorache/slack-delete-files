"use strict";

var code = "";
var token = "";

module.exports = {
  setCode: function (value) {
    code = value;
  },

  getCode: function () {
    return code;
  },

  setToken: function (value) {
    token = value;
  },

  getToken: function () {
    return token;
  }
};

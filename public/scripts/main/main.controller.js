'use strict';

(function () {
  angular.module("slackDeleteFiles")
    .controller('mainController', mainController);

  mainController.$inject = ['$scope', '$http', '$state', 'notificationMessage'];

  function mainController($scope, $http, $state, notificationMessage) {
    var me = this;

    me.$onInit = function () {
      $http.get("/auth", {
      }, function () {
        debugger
      })
    };
  }
})();

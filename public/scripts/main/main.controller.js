'use strict';

(function () {
  angular.module("slackDeleteFiles")
    .controller('mainController', mainController);

  mainController.$inject = ['$scope', '$http', '$state', 'notificationMessage'];

  function mainController($scope, $http, $state, notificationMessage) {
    var me = this;

    me.$onInit = function () {
      $scope.signInWithSlack = signInWithSlack;
    };

    function signInWithSlack() {
      location.href = "https://slack.com/oauth/authorize?scope=identity.basic,identity.team&client_id=101540185972.527491816113";
    }
  }
})();

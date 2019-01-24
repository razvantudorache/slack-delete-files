'use strict';

(function () {
  angular.module("slackDeleteFiles")
    .controller('mainController', mainController);

  mainController.$inject = ['$scope', '$http', '$state', 'notificationMessage'];

  function mainController($scope, $http, $state, notificationMessage) {
    var me = this;

    me.$onInit = function () {
      $scope.showSignInButton = true;

      checkAuthentication();

      $scope.signInWithSlack = signInWithSlack;
    };

    /**
     * Sign in action
     * @return {void}
     */
    function signInWithSlack() {
      location.href = "https://slack.com/oauth/authorize?scope=files:read&client_id=101540185972.527491816113";
    }

    /**
     * Show/hide sign in button based of the authentication value
     * @return {void}
     */
    function checkAuthentication() {
      $http.get("/checkAuthentication").then(function (response) {
        $scope.showSignInButton = !response.data.success;

        if (!$scope.showSignInButton) {
          $http.get("/getFilesList").then(function () {
          });
        }
      });
    }
  }
})();

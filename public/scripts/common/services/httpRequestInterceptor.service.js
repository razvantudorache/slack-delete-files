'use strict';

(function () {
  angular.module("slackFileBuster")
    .factory('httpRequestInterceptor', httpRequestInterceptor);

  httpRequestInterceptor.$inject = ["$q", "notyMessageService"];

  function httpRequestInterceptor($q, notyMessageService) {
    return {
      'responseError': function (rejection) {
        // do something on error
        if (rejection.status) {
          notyMessageService.showNotificationMessage("An error occurred due to some Slack API limitations!", "error");
        }
        return $q.reject(rejection);
      }
    };
  }
})();
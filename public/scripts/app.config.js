'use strict';

(function () {
  angular.module('slackFileBuster')
    .config(stateConfig)
    .config(httpConfig);

  /**
   * State config injection + method
   * @type {string[]}
   */
  stateConfig.$inject = ['$urlRouterProvider', '$stateProvider'];

  function stateConfig($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('main');

    $stateProvider
      .state('main', {
        url: '/main',
        templateUrl: 'scripts/main/main.template.html',
        controller: 'mainController',
        controllerAs: "main"
      });
  }

  httpConfig.$inject = ['$httpProvider'];

  function httpConfig($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');

    $httpProvider.defaults.headers.common = {
      'Content-Type': 'application/json; charset=utf-8',
      'Response-Type': 'json'
    };
  }
})();


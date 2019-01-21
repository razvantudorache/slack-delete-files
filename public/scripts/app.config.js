'use strict';

(function () {
  angular.module('slackDeleteFiles')
    .config(stateConfig)
    .config(httpConfig)
    .config(progressbarConfig);

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
        controller: 'mainController'
      });
  }

  httpConfig.$inject = ['$httpProvider'];

  function httpConfig($httpProvider) {
    $httpProvider.defaults.headers.common = {
      'Content-Type': 'application/json; charset=utf-8',
      'Response-Type': 'json'
    };
  }

  progressbarConfig.$inject = ['cfpLoadingBarProvider'];

  function progressbarConfig(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.parentSelector = '.topBarContainer';
  }
})();


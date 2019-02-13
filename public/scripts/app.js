'use strict';
(function () {
  agGrid.initialiseAgGridWithAngular1(angular);
  angular
    .module('slackFileBuster', [
      'ngAnimate',
      'ngCookies',
      'ngMessages',
      'ngResource',
      'ngSanitize',
      'ui.router',
      'ngMaterial',
      'angular-loading-bar',
      'agGrid'
    ])

    .run(applicationRun);

  applicationRun.$inject = ['$transitions', '$state', 'loadingMaskService'];

  function applicationRun($transitions, $state, loadingMaskService) {
  }

})();

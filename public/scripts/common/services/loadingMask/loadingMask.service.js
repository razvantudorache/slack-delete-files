'use strict';

(function () {
  angular.module('slackDeleteFiles')
    .service('loadingMaskService', loadingMaskService);

  loadingMaskService.$inject = ['$rootScope'];

  function loadingMaskService($rootScope) {
    var $loadingMask = null,
      $mainContainer = null;

    init();

    function init() {
      $loadingMask = angular.element('<div class="loadingMask"></div>');
      $mainContainer = angular.element('.applicationContainer');

      $mainContainer.after($loadingMask);

      initEvents();
    }

    function initEvents() {
      // the loading bar broadcasts the following events over $rootScope

      // triggered upon each XHR request that is not already cached
      $rootScope.$on('cfpLoadingBar:loading', function () {
        $loadingMask.show();
      });

      // triggered once when the all XHR requests have returned (either successfully or not)
      $rootScope.$on('cfpLoadingBar:completed', function () {
        $loadingMask.hide();
      });
    }
  }
})();

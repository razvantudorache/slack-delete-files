"use strict";

angular.module('slackDeleteFiles')
    .directive("selectize", selectizeDirective);

function selectizeDirective() {
    return {
        restrict: 'A',
        scope: {
          configuration: "<"
        },
        link: function ($scope, element) {
            angular.element(element).selectize($scope.configuration);
        }
    };

}
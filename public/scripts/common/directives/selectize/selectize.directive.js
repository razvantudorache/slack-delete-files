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
            var $element = angular.element(element);
            var selectizeInstance = $element.selectize($scope.configuration)[0].selectize;

            $element.data("selectize", selectizeInstance);
        }
    };

}
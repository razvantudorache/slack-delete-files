"use strict";

angular.module('slackDeleteFiles')
    .directive("selectize", selectizeDirective);

function selectizeDirective() {
    return {
        restrict: 'A',
        link: function ($scope, element) {
            angular.element(element).selectize();
        }
    };

}
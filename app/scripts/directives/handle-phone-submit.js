'use strict';

/**
 * @ngdoc function
 * @name Oss.directive:handlePhoneSubmit
 * @description
 * # handlePhoneSubmit
 */

 angular.module('Oss')
 .directive('handlePhoneSubmit', function ($window) {
   return function (scope, element, attr) {
    var textFields = element.find('input');
      element.bind('submit', function() {
      textFields[0].focus();
      textFields[0].blur();
      $window.scrollTo(0, 0);
      });
    };
 });

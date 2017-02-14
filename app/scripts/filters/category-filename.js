'use strict';

/**
 * @ngdoc function
 * @name Oss.filter:categoryFilename
 * @description
 * # categoryFilename
 */

angular.module('Oss')
.filter('categoryFilename', function () {
	return function (input) {
	  return input.replace(/[ \/]/g, '-').toUpperCase();
	};
});
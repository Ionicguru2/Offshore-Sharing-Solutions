'use strict';

/**
 * @ngdoc function
 * @name Oss.service:UserService
 * @description
 * # UserService
 */

 angular.module('Oss')
    .factory('UserService', function($http, $timeout, $q, ApiService, LoginService, CONSTANTS) {

      var currentUser = null;

      var _endpoint = ApiService.getEndpoint() + 'user/';

      // Accept terms
      var acceptTerms = function() {
        //http://ossapi.dev.kpd-i.com/api/v1/user/read_terms
        var _url = _endpoint + 'read_terms';
        return $http({
          url: _url,
          params: {
            _rest_token: LoginService.getRestToken()
          },
          timeout: CONSTANTS.TIMEOUT_VALUE,
          method: 'GET'
        })
        .success(function(data) {
          console.log("Terms accepted!")
          console.log(data);
        })
        .error(function(error) {
        })
      }

      // Verify Pin
      var verifyPin = function(pin) {
        //http://ossapi.dev.kpd-i.com/api/v1/user/verify_pin
        var _url = _endpoint + 'verify_pin';
        return $http({
          url: _url,
          params: {
            _rest_token:  LoginService.getRestToken(),
            pin:          pin
          },
          timeout: CONSTANTS.TIMEOUT_VALUE,
          method: 'POST'
        })
        .success(function(data) {
          console.log("Pin verified!")
          console.log(data);
        })
        .error(function(error) {
        })
      }

      return {
        acceptTerms:    acceptTerms,
        verifyPin:      verifyPin
      }
    });

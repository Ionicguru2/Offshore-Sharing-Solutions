'use strict';

/**
 * @ngdoc function
 * @name Oss.service:AlertService
 * @description
 * # AlertService
 */
angular.module('Oss')
  // use factory for services
  .factory('AlertService', function($http, $timeout, $q, ApiService, CONSTANTS, LoginService) {

    //Get all alerts
    var getAllAlerts = function() {
      //http://ossapi.dev.kpd-i.com/api/v1/alert
      var _url = ApiService.getEndpoint() + CONSTANTS.API_ALERT;
      return $http({
          url: _url,
          params: { 
            _rest_token: LoginService.getRestToken() 
          },
          timeout: CONSTANTS.TIMEOUT_VALUE,
          method: 'GET'
        })
        .success(function(data) {
        })
        .error(function(error) {
        });
    };

    //Set alert as seen
    var setAlertAsSeen = function(alert_id) {
      //http://ossapi.dev.kpd-i.com/api/v1/alert/{alert_id}/seen"
      var _url = ApiService.getEndpoint() + CONSTANTS.API_ALERT +'/'+ alert_id +'/seen';
      return $http({
          url:      _url,
          params:   { 
            _rest_token: LoginService.getRestToken() 
          },
          timeout: CONSTANTS.TIMEOUT_VALUE,
          method:   'GET'
        })
        .success(function(data) { 
        })
        .error(function(error) { 
        });
    };

    // public api
    return {
      getAllAlerts:       getAllAlerts,
      setAlertAsSeen:     setAlertAsSeen,
    };
  });


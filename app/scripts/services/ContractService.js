'use strict';

/**
 * @ngdoc function
 * @name Oss.service:ContractService
 * @description
 * # ContractService
 */
angular.module('Oss')
  // use factory for services
  .factory('ContractService', function($http, $timeout, $q, ApiService, CONSTANTS, LoginService) {

    //Get all contracts
    var getContracts = function() {
      //http://ossapi.dev.kpd-i.com/api/contract
      var _url = ApiService.getEndpoint() + CONSTANTS.API_CONTRACT;
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


    // public api
    return {
      getContracts:       getContracts,
    };
  });


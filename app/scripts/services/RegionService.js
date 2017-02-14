'use strict';

/**
 * @ngdoc function
 * @name Oss.service:RegionService
 * @description
 * # RegionService
 */
angular.module('Oss')
  // use factory for services
  .factory('RegionService', function($http, $timeout, ApiService, CONSTANTS, LoginService) {

    //Get all regions
    var getAllRegions = function() {
      //http://ossapi.dev.kpd-i.com/api/v1/region
      var _url = ApiService.getEndpoint() + CONSTANTS.API_REGION;
      return $http({
          url: _url,
          params: {
              _rest_token: LoginService.getRestToken()
          },
          timeout: CONSTANTS.TIMEOUT_VALUE,
          method: 'GET'
        })
        .success(function(result) { 
        })
        .error(function(error) { 
        });
    };

    //Set region
    var setRegion = function(id) {
      //http://ossapi.dev.kpd-i.com/api/v1/region/set"
    var _url = ApiService.getEndpoint() + CONSTANTS.API_REGION_SET;
    return $http({
        url: _url,
        params: {
            _rest_token:  LoginService.getRestToken(),
            id:           id
        },
        timeout: CONSTANTS.TIMEOUT_VALUE,
        method: 'POST'
      })
      .success(function(data) { 
      })
      .error(function(error) { 
      });
    };

    //Get all countries
    var getAllCountries = function() {
      //http://ossapi.dev.kpd-i.com/api/v1/region/0/countries"
      var _url = ApiService.getEndpoint() + CONSTANTS.API_REGION + '/0/' + CONSTANTS.API_COUNTRY;
      return $http({
          url: _url,
          params: {
              _rest_token: LoginService.getRestToken()
          },
          timeout: CONSTANTS.TIMEOUT_VALUE,
          method: 'GET'
        })
        .success(function(result) { 
        })
        .error(function(error) { 
        });
    };

    // public api
    return {
      getAllRegions:    getAllRegions,
      setRegion:        setRegion,
      getAllCountries:  getAllCountries
    };
  });

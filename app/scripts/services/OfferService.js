'use strict';

/**
 * @ngdoc function
 * @name Oss.service:OfferService
 * @description
 * # OfferService
 */
angular.module('Oss')
  // use factory for services
  .factory('OfferService', function($http, $timeout, $q, ApiService, CONSTANTS, LoginService) {

    //Create offer
    var createOffer = function(product_id) {
      //http://ossapi.dev.kpd-i.com/api/v1/offer/create/{product_id}
      var _url = ApiService.getEndpoint() + CONSTANTS.API_OFFER_CREATE +'/'+ product_id;
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

    //Get offer detail
    var getOfferDetail = function(offer_id) {
      //http://ossapi.dev.kpd-i.com/api/v1/offer/{offer_id}"
      var _url = ApiService.getEndpoint() + CONSTANTS.API_OFFER +'/'+ offer_id;
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

    //Approve offer
    var approveOffer = function(offer_id) {
      //http://ossapi.dev.kpd-i.com/api/v1/offer/approve/{offer_id}"
      var _url = ApiService.getEndpoint() + CONSTANTS.API_OFFER_APPROVE +'/'+ offer_id;
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

    //Deny offer
    var denyOffer = function(offer_id) {
      //http://ossapi.dev.kpd-i.com/api/v1/offer/deny/{offer_id}"
      var _url = ApiService.getEndpoint() + CONSTANTS.API_OFFER_DENY +'/'+ offer_id;
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

    var requestValidation = function(id) {
      var _url = ApiService.getEndpoint() + CONSTANTS.API_REQUEST_VALIDATION + '/' + id;
      return $http({
        url: _url,
        params: {
            _rest_token: LoginService.getRestToken()
        },
        timeout: CONSTANTS.TIMEOUT_VALUE,
        method: 'GET'
      })
    }

    // public api
    return {
      createOffer:        createOffer,
      getOfferDetail:     getOfferDetail,
      approveOffer:       approveOffer,
      denyOffer:          denyOffer,
      requestValidation: requestValidation
    };
  });

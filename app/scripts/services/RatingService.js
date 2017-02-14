'use strict';

/**
 * @ngdoc function
 * @name Oss.service:RatingService
 * @description
 * # RatingService
 */
angular.module('Oss')
  // use factory for services
  .factory('RatingService', function($http, $timeout, $q, $filter, ApiService, CONSTANTS, LoginService) {

    //Set rating
    var setRating = function(transaction_id, rating_number) {
      //http://ossapi.dev.kpd-i.com/api/v1/transaction
      var _url = ApiService.getEndpoint() + CONSTANTS.API_RATING;
      return $http({
          url:            _url,
          params: { 
            _rest_token: LoginService.getRestToken() ,
            transaction_id: transaction_id,
            rating:         rating_number,
          },
          method: 'POST'
        })
        .success(function(data) {
        })
        .error(function(error) {
        });
    };

    // public api
    return {
      setRating:       setRating
    };
  });


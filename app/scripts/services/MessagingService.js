'use strict';

/**
 * @ngdoc function
 * @name Oss.service:MessagingService
 * @description
 * # MessagingService
 */
angular.module('Oss')
  // use factory for services
  .factory('MessagingService', function($http, $timeout, $q, LoginService, CONSTANTS, CHAT_API) {

    var url = CHAT_API.host;

    var channel = {
      list: function() {
        return $http({
          url: url,
          method: 'GET',
          params: {
            _rest_token:  LoginService.getRestToken()
          },
          timeout: CONSTANTS.TIMEOUT_VALUE
        })
      },
      fetch: function(_transaction_id) {
        var _url = CHAT_API.host + '/open';
        return $http({
          url: _url,
          method: 'POST',
          params: {
            _rest_token:  LoginService.getRestToken(),
            transaction_id: _transaction_id
          },
          timeout: CONSTANTS.TIMEOUT_VALUE
        })
      },
      send: function(_transaction_id, msg) {
        var _url = url + '/send' ;
        return $http({
          url: _url,
          method: 'POST',
          params: {
            _rest_token:  LoginService.getRestToken(),
            transaction_id: _transaction_id,
            message: msg
          },
          timeout: CONSTANTS.TIMEOUT_VALUE
        })
      },
      loadMore: function(_transaction_id, _msg_id) {
        var _url = url + '/reload' ;
        return $http({
          url: _url,
          method: 'POST',
          params: {
            _rest_token:  LoginService.getRestToken(),
            transaction_id: _transaction_id,
            message_id: _msg_id
          },
          timeout: CONSTANTS.TIMEOUT_VALUE
        })
      },
      refresh: function(_transaction_id, _msg_id) {
        var _url = url + '/refresh' ;
        return $http({
          url: _url,
          method: 'POST',
          params: {
            _rest_token:  LoginService.getRestToken(),
            transaction_id: _transaction_id,
            message_id: _msg_id
          },
          timeout: CONSTANTS.TIMEOUT_VALUE
        })
      },
      attachment: function(_transaction_id, _contract_id) {

        var _url = url + '/contract' ;
        return $http({
          url: _url,
          method: 'POST',
          params: {
            _rest_token:  LoginService.getRestToken(),
            transaction_id: _transaction_id,
            contract_id: _contract_id
          },
          timeout: CONSTANTS.TIMEOUT_VALUE
        })

      }
    }

    return {
      channel: channel
    };

  });

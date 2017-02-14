'use strict';

/**
 * @ngdoc function
 * @name Oss.service:TransactionService
 * @description
 * # TransactionService
 */
angular.module('Oss')
  // use factory for services
  .factory('TransactionService', function($http, $timeout, $q, $filter, ApiService, CONSTANTS, LoginService) {

    var transactions = null;

    //Get all transactions
    var getAllTransactions = function() {
      //http://ossapi.dev.kpd-i.com/api/v1/transaction
      var _url = ApiService.getEndpoint() + CONSTANTS.API_TRANSACTION;
      return $http({
          url: _url,
          params: { 
            _rest_token: LoginService.getRestToken() 
          },
          timeout: CONSTANTS.TIMEOUT_VALUE,
          method: 'GET'
        })
        .success(function(data) {
          transactions = data;
        })
        .error(function(error) {
        });
    };

    var convertToUIData = function(products, userID)
    {
      if (transactions == null) { return null; }

      var ongoing = [];
      var upcoming = [];

      for (var i = transactions.length - 1; i >= 0; i--) {
        var transaction = transactions[i];

        if (transaction.transaction_flag == null) { continue; }
        if (transaction.users[0].id != userID && transaction.users[1].id != userID) { continue; }

        for (var j = products.length - 1; j >= 0; j--) {
          var product = products[j];
          if (transaction.product_id == product.id) {
            transaction['product'] = product;
            transaction['startDate'] = moment(product.available_from).format('DD-MM-YYYY');
            transaction['endDate'] = moment(product.available_to).format('DD-MM-YYYY');
          }
        }

        if (transaction.transaction_flag.flag == CONSTANTS.TRANSACTION_TYPE.ONGOING) {
          ongoing.push(transaction);
        } else if (transaction.transaction_flag.flag == CONSTANTS.TRANSACTION_TYPE.UPCOMING){
          upcoming.push(transaction);
        }

      }

      return {
        ongoing:  ongoing,
        upcoming: upcoming
      };
    }

    // public api
    return {
      getAllTransactions:       getAllTransactions,
      convertToUIData:          convertToUIData
    };
  });


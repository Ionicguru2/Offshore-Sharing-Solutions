'use strict';

/**
 * @ngdoc function
 * @name Oss.service:ReportService
 * @description
 * # ReportService
 */
angular.module('Oss')
  // use factory for services
  .factory('ReportService', function($http, $timeout, $q, ApiService, CONSTANTS, LoginService) {

    //Create report
    var createReport = function(data) {
      //http://ossapi.dev.kpd-i.com/api/v1/report/create"
    var _url = ApiService.getEndpoint() + CONSTANTS.API_REPORT_CREATE;
    return $http({
        url: _url,
        params: {
            _rest_token:      LoginService.getRestToken(),
            report_type_id:   data.type,
            message:          data.message
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
      createReport:       createReport
    };
  });


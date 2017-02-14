'use strict';

/**
 * @ngdoc constant
 * @name Oss.API_ENDPOINT
 * @description
 * # API_ENDPOINT
 * Defines the API endpoint where our resources will make requests against.
 * Is used inside /services/ApiService.js to generate correct endpoint dynamically
 */


angular.module('Oss')

  // development
  .constant('API_ENDPOINT', {
    host:         'http://ossapi.local',
    path:         '/api/v1/',
    needsAuth:    false
  })
  .constant('CHAT_API', {
    host:         'http://ossapi.local',
  })

'use strict';

/**
 * @ngdoc function
 * @name Oss.service:LoginService
 * @description
 * # LoginService
 */

 angular.module('Oss')
    .factory('LoginService', function($http, $timeout, $q, ApiService, CONSTANTS) {

      var currentUser = null;

      var _endpoint = ApiService.getEndpoint();

      //Login
      var Login = function(email, pass) {
        //http://ossapi.dev.kpd-i.com/api/v1/user/login
        var _url = ApiService.getEndpoint() + CONSTANTS.API_LOGIN;
        return $http({
          url: _url,
          params: {
            username: email,
            password: pass
          },
          timeout: CONSTANTS.TIMEOUT_VALUE,
          method: 'POST'
        })
        .success(function(data) {
          currentUser = data;
        })
        .error(function(error) {
        })
      }

      //Logout
      var Logout = function(email, pass) {
        //http://ossapi.dev.kpd-i.com/api/v1/user/logout
        var _url = ApiService.getEndpoint() + CONSTANTS.API_LOGOUT;
        return $http({
          url: _url,
          params: {
            _rest_token:      currentUser.session.rest_token,
          },
          timeout: CONSTANTS.TIMEOUT_VALUE,
          method: 'POST'
        })
        .success(function(data) {
          currentUser = null;
          return data;
        })
        .error(function(data) {
          return data;
        })
      }

      //Get user info by id
      var getUserInfoByID = function(user_id) {
        //http://ossapi.dev.kpd-i.com/api/v1/user/{id}
        var _url = ApiService.getEndpoint() + CONSTANTS.API_USER +'/'+ user_id;
        return $http({
          url: _url,
          params: {
            _rest_token:      currentUser.session.rest_token,
          },
          timeout: CONSTANTS.TIMEOUT_VALUE,
          method: 'GET'
        })
        .success(function(data) {
        })
        .error(function(data) {
        })
      }

      //Get current user
      var getCurrentUser = function(){
        return currentUser;
      }

      //Get rest token of current user
      var getRestToken = function(){
        return currentUser.session.rest_token;
      }

      return {
        getRestToken:     getRestToken,
        getCurrentUser:   getCurrentUser,
        Login:            Login,
        Logout:           Logout,
        getUserInfoByID:  getUserInfoByID
      }
    });

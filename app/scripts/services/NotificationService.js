'use strict';

/**
 * @ngdoc function
 * @name Oss.service:NotificationService
 * @description
 * # NotificationService
 */
angular.module('Oss')
  // use factory for services
  .factory('NotificationService', function($state, $http, $timeout, $q, ApiService, CONSTANTS, LoginService, CategoryService) {


    var init = function() { 

      if (ionic.Platform.isIOS() && (typeof PushNotification !== 'undefined'))
      {
        var push = PushNotification.init({

            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            }

        });

        push.on('registration', function(data) {
            
          console.log(data);
          var _url = ApiService.getEndpoint() + CONSTANTS.API_PUSH_REGISTER;
          return $http({
              url: _url,
              params: {
                  _rest_token:      LoginService.getRestToken(),
                  type:             'ios',
                  key:              data.registrationId
              },
              method: 'POST'
          }).success(function(data) { 

            // no action needs to be taken

          }).error(function(error) { 

          });

        });

        push.on('notification', function(data) { 

          console.log('----- Received Notification -----');
          console.log(data);
          console.log('----- Navigating to Alert ' + data.additionalData.alertId + ' -----');
          $state.go('app.messages', { tab: 'alerts', alertId: data.additionalData.alertId })

        });
      }
    }

    //Get settings
    var getSettings = function() {
      //http://ossapi.dev.kpd-i.com/api/v1/notificationsettings"
      var _url = ApiService.getEndpoint() + CONSTANTS.API_NOTIFICATION;
      return $http({
          url: _url,
          params: {
              _rest_token:      LoginService.getRestToken()
          },
          method: 'GET'
        })
        .success(function(data) { 
        })
        .error(function(error) { 
        });
    };

    //Get settings
    var setSettings = function(identifier) {
      //http://ossapi.dev.kpd-i.com/api/v1/notificationsettings/{identifier}"
      var _url = ApiService.getEndpoint() + CONSTANTS.API_NOTIFICATION +'/'+ identifier;
      return $http({
          url: _url,
          params: {
              _rest_token:      LoginService.getRestToken(),
          },
          method: 'GET'
        })
        .success(function(data) { 
        })
        .error(function(error) { 
        });
    };

    

    // public api
    return {
      getSettings:      getSettings,
      setSettings:      setSettings,
      init:             init,
    };
  });


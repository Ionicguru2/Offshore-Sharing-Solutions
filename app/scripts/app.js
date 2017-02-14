'use strict';

/**
 * @ngdoc overview
 * @name Oss
 * @description
 * # Initializes main application and routing
 *
 * Main module of the application.
 */


angular.module('Oss', ['ionic', 'ngCordova', 'ngResource', 'ngAnimate', 'ionic-datepicker', 'ionic.ion.imageCacheFactory', 'ngFileUpload', 'ionic-toast'])

  .run(function($ionicPlatform, $ionicTabsDelegate, $timeout, $state, LoginService) {

    $ionicPlatform.ready(function() {

      if (window.plugins == null) return;


      var notificationOpenedCallback = function(jsonData) 
      {
        console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));

        if (LoginService.getCurrentUser() == null) return;

        $state.go('app.messages');
        $timeout(function() {
          $ionicTabsDelegate.select(1);
        }, 0);
      };

      window.plugins.OneSignal.init("6017fb99-0c6e-4fd0-a8d9-e61db7e81aa2",
                                   {googleProjectNumber: "797877163035"},
                                   notificationOpenedCallback);
    
      // Show an alert box if a notification comes in when the user is in your app.
      window.plugins.OneSignal.enableInAppAlertNotification(true);


      // save to use plugins here
    });

    // add possible global event handlers here

  })

  .config(function($httpProvider, 
                    $stateProvider, 
                    $urlRouterProvider, 
                    $ionicConfigProvider, 
                    $cordovaAppRateProvider,
                    ionicDatePickerProvider) {

    document.addEventListener('deviceready', function(){

      var prefs = {
        language: 'en',
        appName: 'Offershoresharing',
        iosURL: '',
        androidURL: '',
        windowsURL: ''
      };
      $cordovaAppRateProvider.setPreferences(prefs);

    }, false);


    var datePickerObj = {
      inputDate: new Date(),
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(2012, 8, 1),
      to: new Date(2018, 8, 1),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);

    
    // register $http interceptors, if any. e.g.
    // $httpProvider.interceptors.push('interceptor-name');
    $ionicConfigProvider.tabs.position('top');

    // Application routing
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/main.html',
        controller: 'MainController'
      })
      .state('app.home', {
        url: '/home',
        cache: true,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/home.html',
            controller: 'HomeController'
          }
        }
      })
      .state('app.post', {
        url: '/post',
        cache: false,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/post.html',
            controller: 'PostController'
          }
        },
        params: {
          categories: null
        }
      })
      .state('app.messages', {
        url: '/inbox',
        cache: true,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/messages.html',
            controller: 'MessageController'
          }
        },
        params: {
          tab: 'alerts',
          alertId: null,
        }
      })
      .state('app.convo', {
        url: '/convo',
        cache: false,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/convo.html',
            controller: 'ConversationController'
          }
        },
        params: {
          channel: null
        }
      })
      .state('app.login', {
        url: '/login',
        cache: true,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/login.html',
            controller: 'LoginController'
          }
        }
      })
      .state('app.category', {
        url: '/category/:category',
        cache: true,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/category.html',
            controller: 'CategoryController'
          }
        },
        params: {
          parent_id: null,
        }
      })
      .state('app.market', {
        url: '/market',
        cache: false,//=============== changed =================
        views: {
          'viewContent': {
            templateUrl: 'templates/views/market.html',
            controller: 'MarketController'
          }
        },
        params: {
          category_id: null,
          subcategory: null,
          action: null
        }
      })
      .state('app.itemDescription', {
        url: '/item/:id/:action',
        cache: false,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/itemDescription.html',
            controller: 'ListingController'
          }
        },
        params: {
          item: null
        }
      })
      .state('app.search', {
        url: '/search',
        cache: true,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/search.html',
            controller: 'SearchController'
          }
        }
      })
      .state('app.ongoing', {
        url: '/ongoing',
        cache: true,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/ongoing.html',
            controller: 'OngoingController'
          }
        }
      })
      .state('app.settings', {
        url: '/settings',
        cache: true,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/settings.html',
            controller: 'SettingsController'
          }
        }
      })


    // redirects to default route for undefined routes
    $urlRouterProvider.otherwise('/app/login');
  });

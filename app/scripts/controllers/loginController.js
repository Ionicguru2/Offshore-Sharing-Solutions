'use strict';

/**
 * @ngdoc function
 * @name Oss.controller:LoginController
 * @description
 * # LoginController
 */

angular.module('Oss')

.controller('LoginController', function($scope,
                                        $rootScope,
                                        $state,
                                        $timeout,
                                        $stateParams,
                                        $ionicPopup,
                                        $ionicPlatform,
                                        $ionicModal,
                                        $ionicHistory,
                                        $ionicLoading,
                                        $ImageCacheFactory,
                                        LoginService,
                                        CategoryService,
                                        RegionService,
                                        ProductService,
                                        NotificationService,
                                        UserService) {

  // Layout functions, please refactor
  $scope.$on('$ionicView.beforeEnter', function() {

    $scope.build_version = '0.0.3';
    $scope.api_version = '0.0.1';

    $scope.$parent.build_version = $scope.build_version;
    $scope.$parent.api_version = $scope.api_version;

    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();

    $scope.creds.pass = null;
    $scope.platformReady = true;

    $scope.$parent.navIcons.allHidden = true;
    $scope.subnavHidden = true;
    $scope.$parent.showHeader = false;
  })
  $scope.creds = {
    user: null,
    pass: null
  }
  $scope.error = {
    username: false,
    password: false
  }
  $scope.reset = function() {
    $scope.error = {
      username: false,
      password: false
    }
  }

  // Everything below should be refactored into LoginService
  $scope.login = function(user, pass) {
    /*if ( typeof cordova !== "undefined" ) {
      console.log("Closing keyboard!");
      $cordovaKeyboard.close();
    }*/
    if (user == null || pass == null)
    {
      $ionicPopup.show({
        template: 'Please complete all fields correctly.',
        cssClass: 'invalid-popup',
        title: 'Invalid Input.',
        scope: $scope,
        buttons: [
          {
            text: 'OK',
            onTap: function(e) {

            }
          }
        ]
      })
      return;
    }

    $ionicLoading.show({ template: 'Loading...'});

    LoginService.Login(user, pass).then(
      function(response){
        $ionicLoading.hide();
        console.log('----- Success login -----');
        console.log(response.data);

        // register this device for notifications
        NotificationService.init();
        
        /*if (typeof cordova !== "undefined") {
          cordova.plugins.Keyboard.close();
        }*/
        if (response.data.error) {
          switch (response.data.error) {
            case 200:
              $scope.error.password = true;
              break;
            case 404:
              $scope.error.username = true;
              break;
          }
        }
        if (response.data.terms_accepted === true) {
          getDataFromBackend();
        }
        else {
          $scope.termsModal.show();
        }
      },
      function(response){
        $ionicLoading.hide();
        console.log('----- Failed login -----');
        console.log(response);
        switch (response.status) {
          case 0:
            $scope.$parent.retryForTimeout(loginProcess);
            break;
          case 400:
            $scope.error.password = true;
            break;
          case 404:
            $scope.error.password = true;

            break;
        }
      });
  }

  $scope.continue = function() {
    $ionicLoading.show({ template: 'Loading...'});
    UserService.acceptTerms()
      .then(function() {
        getDataFromBackend();
      })
  }

  $scope.focusPosition = function() {
    angular.element(document.querySelectorAll('.wrapper')).css('height', window.innerHeight + 'px');
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }

  $scope.resetPosition = function() {
    angular.element(document.querySelectorAll('.wrapper')).css('height', '');
  }

  //================= Get products, main/sub categories and regions/countries from api =======================
    function getDataFromBackend()
    {
      $scope.isCompletes = [];

      $ionicLoading.show({ template: 'Loading...'});

      // Get all products
      ProductService.getAllProducts().then(
        function(response){
          console.log('----- Success getting all products -----');
          console.log(response.data);

          checkCompleteGettingData(true);
        },
        function(response){
          $ionicLoading.hide();
          console.log('----- Failed getting all products -----');
          console.log(response);
          if (response.status == 0) {
            checkCompleteGettingData(false)
          }
        });

      // Get main categories
      CategoryService.getMainCategories().then(
        function(response){
          console.log('----- Success getting main categories -----');
          console.log(response.data);

          checkCompleteGettingData(true);
        },
        function(response){
          $ionicLoading.hide();
          console.log('----- Failed getting main categories -----');
          console.log(response);
          if (response.status == 0) {
            checkCompleteGettingData(false);
          }
        });

      // Get sub categories
      CategoryService.getAllCategories().then(
        function(response){
          console.log('----- Success getting all categories -----');
          console.log(response.data);

          checkCompleteGettingData(true);
        },
        function(response){
          $ionicLoading.hide();
          console.log('----- Failed getting all categories -----');
          console.log(response);
          if (response.status == 0) {
            checkCompleteGettingData(false);
          }
        });

      //Fetch all regions from backend
      RegionService.getAllRegions().then(
        function(regionsRes){
          console.log('----- Success getting all regions -----');
          console.log(regionsRes.data);
          $scope.regions = regionsRes.data;
          $scope.$parent.regions = $scope.regions;

          $scope.regions = regionsRes.data;

          for (var key in $scope.regions)
          {
            if (key == 'selected') {
              $scope.$parent.region_id = $scope.regions[key];
            }
          }
          checkCompleteGettingData(true);
        },
        function(response){
          $ionicLoading.hide();
          console.log('----- Failed getting all regions -----');
          console.log(response);
          if (response.status == 0) {
            checkCompleteGettingData(false);
          }
        });

      //Fetch all countries from backend
      RegionService.getAllCountries().then(
        function(countriesRes){
          console.log('----- Success getting all countries -----');
          console.log(countriesRes.data);
          $scope.countries = countriesRes.data;
          $scope.$parent.countries = $scope.countries;
          checkCompleteGettingData(true);
        },
        function(response){
          $ionicLoading.hide();
          console.log('----- Failed getting all countries -----');
          console.log(response);
          if (response.status == 0) {
            checkCompleteGettingData(false);
          }
        });
    }

    function checkCompleteGettingData(isComplete)
    {
      $scope.isCompletes.push(isComplete);

      if ($scope.isCompletes.length > 4)
      {
        for (var i = $scope.isCompletes.length - 1; i >= 0; i--) {
          var flag = $scope.isCompletes[i]
          if (!flag) {
            $scope.$parent.retryForTimeout(getDataFromBackend);
            return;
          }
        }
        $scope.categories = CategoryService.convertMainImageURL();
        $scope.$parent.categories = $scope.categories;

        $scope.allcategories = CategoryService.convertAllImageURL();
        $scope.$parent.allcategories = $scope.allcategories;

        $scope.$parent.products = ProductService.convertToUIData($scope.allcategories);

        var images = [];
        for(var i=0; i<$scope.categories.length;i++){
          var category = $scope.categories[i];
          images.push(category.HEADER_image);
          images.push(category.LISTING_image);
          images.push(category.BUY_image);
          images.push(category.SELL_image);
        }

        // Imaage cache
        $ImageCacheFactory.Cache(images).then(function(){
          console.log("Images done loading!");
          $ionicLoading.hide();
          $scope.termsModal.hide();
          $state.go('app.home');
          $timeout(function() {
            $scope.$parent.$broadcast('firstEntry');
          }, 750);
        },function(failed){
          console.log("An image filed: "+failed);
        });
      }
    }

  $ionicModal.fromTemplateUrl('templates/modal/termsModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.termsModal = modal;
  });
  $scope.$on('$destroy', function() {
    $scope.termsModal.remove();
  });

})

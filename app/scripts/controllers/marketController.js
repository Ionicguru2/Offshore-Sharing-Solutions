'use strict';

/**
 * @ngdoc function
 * @name Oss.controller:MarketController
 * @description
 * # MarketController
 */
angular.module('Oss')
  .controller('MarketController', function($scope,
                                            $state,
                                            $sce,
                                            $stateParams,
                                            $ionicScrollDelegate,
                                            $timeout,
                                            $ionicLoading,
                                            $ImageCacheFactory,
                                            $ionicTabsDelegate,
                                            ionicToast,
                                            ProductService,
                                            CONSTANTS) {

    // Layout functions, to be refactored
    $scope.showTopArrow = false;
    $scope.$parent.isActiveTab('app.messaging');

    $scope.categories = $scope.$parent.categories;
    $scope.products = $scope.$parent.products;
    $scope.count = {
      buy: 0,
      sell: 0
    }

    $scope.category_id = $stateParams.category_id || '';
    $scope.subcategory = $stateParams.subcategory || '';
    $scope.action = $stateParams.action || 'buy';
    // Set empty list template for this page.
    $scope.emptyList = {
      buy: {
        enabled: false,
        message: $sce.trustAsHtml('This is where people offer to buy items,<br />try visiting All Categories.'),
        buttonText: 'GO TO CATEGORIES',
        buttonLink: function() {
          $state.go('app.home');
        }
      },
      sell: {
        enabled: false,
        message: $sce.trustAsHtml('This is where people list items to sell,<br />try visiting All Categories.'),
        buttonText: 'GO TO CATEGORIES',
        buttonLink: function() {
          $state.go('app.home');
        }
      }
    }
    $scope.doneLoading = false;
    // Watch for the Products to be done loading, then enable the empty list template.
    $scope.$watch('doneLoading', function() {
      if ($scope.count.buy == 0) {
        $scope.emptyList.buy.enabled = true;
      }
      else $scope.emptyList.buy.enabled = false;
      if ($scope.count.sell == 0) {
        $scope.emptyList.sell.enabled = true;
      }
      else $scope.emptyList.sell.enabled = false;
    })

    $scope.$on('$ionicView.beforeEnter', function() {
      var tabIndex = $scope.action == 'buy' ? 0 : 1;
      $timeout(function(){
        $ionicTabsDelegate.select(tabIndex);
      });
      getAllProductsFromBackend();
    });

    $scope.getScrollPosition = function(){
      var pos = $ionicScrollDelegate.getScrollPosition().top;
      if (pos >= 120) { $scope.$apply(function() {
        $scope.showTopArrow = true;
      }); }
      else { $scope.$apply(function() {
        $scope.showTopArrow = false;
      });  }
    };

    $scope.scrollTop = function() {
      $ionicScrollDelegate.scrollTop(true);
    };

    // Go to item description screen
    $scope.viewItemDescription = function(item, id, action) {
      console.log(id);
      if (typeof item !== 'undefined' && item !== 'null') {

        var images = [];
        for(var i=0; i<item.media.length;i++){
          var image = item.media[i];
          images.push(image.path);
        }

        $ionicLoading.show({ template: 'Loading'});
        // Imaage cache
        $ImageCacheFactory.Cache(images).then(function(){
          $ionicLoading.hide();
          console.log("Images done loading!");
          $state.go('app.itemDescription', { id: item.category.parent_id==1 ? item.category_id : item.category.parent_id, item: item, action: action });
        },function(failed){
          $ionicLoading.hide();
          console.log("An image filed: "+failed);
          $state.go('app.itemDescription', { id: item.category.parent_id==1 ? item.category_id : item.category.parent_id, item: item, action: action });
        });

      }
    }

    function getAllProductsFromBackend()
    {
      // Get all products
      $ionicLoading.show({ template: 'Loading...'});
      ProductService.getAllProducts().then(
        function(response){
          $ionicLoading.hide();
          console.log('----- Success getting all products -----');
          console.log(response.data);

          var products = ProductService.convertToUIData($scope.$parent.allcategories);
          // Filter out Products which have a different category_id
          if ($scope.subcategory == '') {
            $scope.products = products;
          }
          else {
            $scope.products = products.filter(function(x) {
              return (x.category.id == $scope.subcategory || x.category.id == $scope.category_id);
            })
          }
          $scope.count.buy = $scope.products.filter(function(x) {
            return (x.type == 'buy');
          }).length;
          $scope.count.sell = $scope.products.filter(function(x) {
            return (x.type == 'sell');
          }).length;
          $scope.doneLoading = true;
        },
        function(response){
          $scope.doneLoading = true;
          $ionicLoading.hide();
          console.log('----- Failed getting all products -----');
          console.log(response);
          if (response.status == 0) {
            $scope.$parent.retryForTimeout(getAllProductsFromBackend);
          }
        });
    }

    $scope.doRefresh = function()
    {
      ProductService.getAllProducts().then(
        function(response){
          console.log('----- Success getting all products -----');
          console.log(response.data);

          $scope.$broadcast('scroll.refreshComplete');
          ionicToast.show('Loading completed.', 'bottom', false, 2000);
          $scope.products = ProductService.convertToUIData($scope.$parent.allcategories);
        },
        function(response){
          console.log('----- Failed getting all products -----');
          console.log(response);
          $scope.$broadcast('scroll.refreshComplete');
          if (response.status == 0) {
            ionicToast.show('Request timeout. Please retry.', 'bottom', false, 2000);
          }else{
            ionicToast.show('Loading failed.', 'bottom', false, 2000);
          }
        });
    }
  });

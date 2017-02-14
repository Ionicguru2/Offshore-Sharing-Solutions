'use strict';

/**
 * @ngdoc function
 * @name Oss.controller:HomeController
 * @description
 * # HomeController
 */
angular.module('Oss')
  .controller('HomeController', function($scope, 
                                        $stateParams, 
                                        $ionicLoading, 
                                        $ionicPlatform, 
                                        $ionicPopup, 
                                        $ionicHistory, 
                                        $timeout, 
                                        $state, 
                                        LoginService) {

    $scope.$on('$ionicView.beforeEnter', function() {
      //Hide unwanted nav items
      $scope.showTopArrow = false;
      $scope.$parent.isActiveTab('app.home');
      $scope.$parent.setIcon('logo');
      $scope.subnavHidden = true;

      $scope.$parent.currentUser = LoginService.getCurrentUser();
    });

    // Layout functions Part I - clear $ionicHistory and execute animation hooks on menu and navigation items (MVP)
    // Should be refactored to a directive, so as to provide modularity and legibility. (This is currently quite ugly)
    $ionicHistory.clearHistory();
    $scope.subnavHidden = true;

    $scope.goToCategory = function(category) 
    {
      if ( category.identifier == 'all' )
      {
        // Go to market screen if all category
        $state.go('app.market', {category_id: category.id, subcategory: 0, action: 'buy'});
      }
      else {

        if (hasSubCategories(category.id)) {
          $state.go('app.category', {parent_id: category.id});
        }else{
          $state.go('app.market', {category_id: category.id, subcategory: category.id, action: 'buy'});
        }
      }
    }
    
    // Layout functions Part II
    $scope.$on('firstEntry', function() {
      $scope.$parent.navIcons.allHidden = false;
      $scope.$parent.toggleHomeIcons();
      $scope.subnavHidden = false;
      $scope.$parent.showHeader = true;
    })

    function hasSubCategories(category_id)
    {
      for (var i = $scope.allcategories.length - 1; i >= 0; i--) {
        var category = $scope.allcategories[i];
        if (category.parent_id == category_id) {
          return true;
        }
      }
      return false;
    }

    function hasSubCategories(category_id)
    {
      for (var i = $scope.allcategories.length - 1; i >= 0; i--) {
        var category = $scope.allcategories[i];
        if (category.parent_id == category_id) {
          return true;
        }
      }
      return false;
    }

    function hasSubCategories(category_id)
    {
      for (var i = $scope.allcategories.length - 1; i >= 0; i--) {
        var category = $scope.allcategories[i];
        if (category.parent_id == category_id) {
          return true;
        }
      }
      return false;
    }
  });

'use strict';

/**
 * @ngdoc function
 * @name Oss.controller:OngoingController
 * @description
 * # OngoingController
 */

angular.module('Oss')
.controller('OngoingController', function($scope,
                                          $state,
                                          $sce,
                                          $ionicPopup,
                                          $ionicPlatform,
                                          $ionicScrollDelegate,
                                          $ionicTabsDelegate,
                                          $ionicLoading,
                                          ionicToast,
                                          RatingService,
                                          TransactionService,
                                          OfferService,
                                          ProductService,
                                          CONSTANTS) {


  $scope.$on('$ionicView.beforeEnter', function() {
    //Hide unwanted nav items
    $scope.showTopArrow = false;
    $scope.$parent.isActiveTab('app.ongoing');
    $scope.$parent.setIcon('ongoing');
    // Set empty list template for this page.
    $scope.emptyList = {
      ongoing: {
        enabled: false,
        message: $sce.trustAsHtml('When you have started a transaction with another party, they will appear here.<br /><hr><span class="sub"><strong>Visit the marketplace</strong> to view items wanted and for sale.</span>'),
        buttonText: 'GO TO MARKETPLACE',
        buttonLink: function() {
          $state.go('app.market', {category_id: 'all', subcategory: 0, action: 'buy'});
        }
      },
      upcoming: {
        enabled: false,
        message: $sce.trustAsHtml('When you have any upcoming transactions, they will appear here.<br /><hr><span class="sub"><strong>Visit the marketplace</strong> to view items wanted and for sale.</span>'),
        buttonText: 'GO TO MARKETPLACE',
        buttonLink: function() {
          $state.go('app.market', {category_id: 'all', subcategory: 0, action: 'buy'});
        }
      }
    }
    $scope.doneLoading = false;
    // Watch for the Transactions to be done loading, then enable the empty list template.
    $scope.$watch('doneLoading', function() {
      if ($scope.transactions == null) {
        $scope.emptyList.ongoing.enabled = true;
        $scope.emptyList.ongoing.upcoming = true;
        return;
      }
      if ($scope.transactions.ongoing.length <= 0) {
        $scope.emptyList.ongoing.enabled = true;
      }
      else $scope.emptyList.ongoing.enabled = false;
      if ($scope.transactions.upcoming.length <= 0) {
        $scope.emptyList.upcoming.enabled = true;
      }
      else $scope.emptyList.upcoming.enabled = false;
    })

    $scope.currentUser = $scope.$parent.currentUser;
    $scope.products = $scope.$parent.products;

    getAllTransactions();
  });

  // This functionality is not wanted by the client.
  // Instead, they would like for the top tab-nav to be fixed position while the user scrolls down.
  $scope.getScrollPosition = function(){
    var pos = $ionicScrollDelegate.getScrollPosition().top;
    if (pos >= 120) { $scope.$apply(function() {
      $scope.showTopArrow = true;
    }) }
    else { $scope.$apply(function() {
      $scope.showTopArrow = false;
    })  }
  }

  $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop(true);
  }


  $scope.viewOngoing = function(transaction_id) {
    // Can probably be offloaded to a separate modal/popup service
    var myPopup = $ionicPopup.show({
       template: CONSTANTS.MODEL_RATING,
       title: 'Job Completed',
       cssClass: 'ratingspopup',
       subTitle: 'This job period has ended, please rate your buyers/seller.',
       scope: $scope,
       buttons: [
          {
            text: 'Submit',
            onTap: function(e) {
              // Submit rating to server
              $ionicLoading.show({ template: 'Loading...'});
              RatingService.setRating(transaction_id, $scope.rating).then(
                function(response){
                  $ionicLoading.hide();
                  $ionicPopup.show({
                    template: 'Your rating helps make Offshore Sharing better.',
                    cssClass: 'confirm-popup',
                    title: 'Success',
                    scope: $scope,
                    buttons: [
                      {
                        text: 'Continue',
                        onTap: function(e) {
                        }
                      }
                    ]
                  });

                  console.log('----- Success rating transaction -----');
                  console.log(response.data);
                },
                function(response){
                  $ionicLoading.hide();
                  $ionicPopup.show({
                    template: 'You have already made a rating on this transaction.',
                    cssClass: 'confirm-popup',
                    title: 'Success',
                    scope: $scope,
                    buttons: [
                      {
                        text: 'Continue',
                        onTap: function(e) {
                        }
                      }
                    ]
                  });
                  console.log('----- Failed rating transaction -----');
                  console.log(response);
                });
            }
          },
          {
            text: 'Cancel',
            onTap: function(e) {  }
          }
        ]
    });
  }

  $scope.viewUpcoming = function(_product_id)
  {
    $ionicLoading.show({ template: 'Loading...'});
    // Get offer detail for getting product_id
    ProductService.getProductByID(_product_id).then(
      function(response){
        $ionicLoading.hide();
        console.log('----- Success getting product detail -----');
        console.log(response.data);

        $scope.product = ProductService.convertDetailToUIData(response.data.id);
        $scope.product_id = response.data.id;

        $state.go('app.itemDescription', { id: $scope.product_id, item: $scope.product, action: $scope.product.type });
      });
  }

  function getAllTransactions()
  {
    $ionicLoading.show({ template: 'Loading'});
    // Get all transactions
    TransactionService.getAllTransactions().then(
      function(response){
        $ionicLoading.hide();
        console.log('----- Success getting transactions -----');
        console.log(response.data);
        $scope.transactions = TransactionService.convertToUIData($scope.products, $scope.currentUser.id);
        $scope.doneLoading = true;
      },
      function(response){
        $scope.doneLoading = true;
        $ionicLoading.hide();
        console.log('----- Failed getting transactions -----');
        console.log(response);
        if (response.status == 0) {
          $scope.$parent.retryForTimeout(getAllTransactions);
        }
      });
  }

  $scope.doRefresh = function()
  {
    TransactionService.getAllTransactions().then(
      function(response){
        console.log('----- Success getting transactions -----');
        console.log(response.data);

        $scope.$broadcast('scroll.refreshComplete');
        ionicToast.show('Loading completed.', 'bottom', false, 2500);
        $scope.transactions = TransactionService.convertToUIData($scope.products, $scope.currentUser.id);
      },
      function(response){
        console.log('----- Failed getting transactions -----');
        console.log(response);
        $scope.$broadcast('scroll.refreshComplete');
        if (response.status == 0) {
          ionicToast.show('Request timeout. Please retry.', 'bottom', false, 2000);
        }else{
          ionicToast.show('Loading failed.', 'bottom', false, 2000);
        }
      });
  }

  // Rating Module
  $scope.rating = 5;
  $scope.rateFunction = function(rating)
  {
    $scope.rating = rating;
  }

})

.directive('starRating',
  function() {
    return {
      restrict : 'A',
      template : '<ul class="rating">'
           + '  <li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">'
           + '\u2605'
           + '</li>'
           + '</ul>',
      scope : {
        ratingValue : '=',
        max : '=',
        onRatingSelected : '&'
      },
      link : function(scope, elem, attrs) {
        var updateStars = function() {
          scope.stars = [];
          for ( var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled : i < scope.ratingValue
            });
          }
        };

        scope.toggle = function(index) {
          scope.ratingValue = index + 1;
          scope.onRatingSelected({
            rating : index + 1
          });
        };

        scope.$watch('ratingValue',
          function(oldVal, newVal) {
            if (newVal) {
              updateStars();
            }
          }
        );
      }
    };
  }
);

'use strict';

/**
 * @ngdoc function
 * @name Oss.controller:ListingController
 * @description
 * # ListingController
 */

angular.module('Oss')
.controller('ListingController', function($scope,
                                          $state,
                                          $sce,
                                          $ionicLoading,
                                          $ionicHistory,
                                          $ionicPopup,
                                          $ionicTabsDelegate,
                                          $timeout,
                                          $stateParams,
                                          $ionicModal,
                                          $rootScope,
                                          UserService,
                                          OfferService,
                                          ProductService,
                                          CONSTANTS) {
  // Listing action is "Buy" or "Sell" - quick and dirty solution, should probably be a ListingService function
  $scope.listingAction = $stateParams.action || "";

  // More layout functions - please refactor
  $scope.$parent.titleHidden = false;
  $scope.$parent.searchHidden = true;

  $scope.currentUser = $scope.$parent.currentUser;

  $scope.categories = $scope.$parent.categories;

  $scope.item = $stateParams.item || {};
  $scope.category_id = $stateParams.id || {};
  function isOwnerCurrentUser() {
    if (typeof $scope.item !== undefined && typeof $scope.item.user !== undefined) {
      if ($scope.currentUser.id == $scope.item.user.id) return true;
      return false;
    }
  }
  $scope.isOwner = isOwnerCurrentUser();
  $scope.buttonMsg = $scope.isOwner == true ? "Cannot bid on own product" : "Make Offer";
  console.log($scope.item);

  $scope.$on('$ionicView.beforeEnter', function() {
    $ionicModal.fromTemplateUrl('templates/modal/numpadModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
  });

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.popupNumpadModal = function(action) {
    $scope.action = action;
    $scope.modalCommand('show');
  }

  // Careful with this, it disables string sanitizing
  $scope.trustHtml = function(html) {
    return $sce.trustAsHtml(html);
  }

  // Should likely be part of some popup/modal service for the sake of legibility and continuity
  $scope.verifyListing = function() {
    var confirmPopup = $ionicPopup.confirm({
       title: 'Verify Certification',
       template: 'Would you like Offshore Sharing Solution to confirm that this item meets ISO Standards through a third party?'
    }).then(function() {

      var alertPopup = $ionicPopup.alert({
         title: 'Verification',
         template: 'Thank you for your request, we will contact you shortly.'
      }).then(function() {
        $state.go('app.ongoing');
      });
    });
  }

  // More layout functions, please refactor
  $timeout(function() {
    $scope.$parent.navTitle = "Listing Details";
  }, 1250)

  $scope.$on('$ionicView.beforeEnter', function() {
    //Hide unwanted nav items
    $scope.$parent.navIcons.allHidden = true;
    $scope.$parent.searchHidden = true;
  });

  $scope.$on('$ionicView.beforeLeave', function() {

    //Reset nav items before leaving
    $scope.$parent.navIcons.allHidden = false;
    $scope.$parent.currentIcon.hidden = false;
    $scope.$parent.searchHidden = false;
    $scope.$parent.navTitle = "";
    $scope.popup.close();
  });


  $scope.modalCommand = function(cmd) {
    if (typeof cmd !== 'string') {
      return;
    } else if (cmd === 'show') {
      $scope.modal.show();
    } else if (cmd ==='hide') {
      $scope.modal.hide();
    }
  };

  $scope.nums = new Array(10);
  $scope.pinCode = '';
  $scope.proceed = false;

  $scope.modifyPin = function(action, n) {
    if (action === 'add') {
      $scope.pinCode += n.toString();
    } else if (action === 'remove') {
      $scope.pinCode = $scope.pinCode.slice(0,$scope.pinCode.length-1);
      $scope.proceed = false;
    }
    if ($scope.pinCode.length === 4) {
      $scope.proceed = true;
    }
  };

  $scope.processListing = function() {
    verifyPin();
  };

  function verifyPin()
  {
    $ionicLoading.show({ template: 'Verifying'});
    // Verify pin
    UserService.verifyPin($scope.pinCode).then(
      function(response)
      {
        $ionicLoading.hide();
        if (response.data.message === true)
        {
          createOffer();
        } else{
          $ionicPopup.show({
            template: 'Invalid pin code.',
            cssClass: 'invalid-popup',
            title: 'Failed!',
            scope: $scope,
            buttons: [
              {
                text: 'OK',
                onTap: function(e) {
                }
              }
            ]
          });
        }
      },
      function(response){
        $ionicLoading.hide();
        if (response.status == 0) {
          $scope.$parent.retryForTimeout(verifyPin);
        }
      });
  }

  function createOffer()
  {
    $ionicLoading.show({ template: 'Loading'});
    // Create offer
    OfferService.createOffer($scope.item.id).then(

      function(response){
        $ionicLoading.hide();
        console.log('----- Success creating offer -----');
        console.log(response.data);

        var buttonName = '';
        if ($scope.action == 'Buy') {
          $scope.$parent.buy_flow = 1;
          buttonName = 'Continue';
        } else if ($scope.action == 'Sell') {
          buttonName = 'View Market';
        }

        $rootScope.popup = $ionicPopup.show({
          template: 'Your request has been sent successfully!',
          cssClass: 'confirm-popup',
          title: 'Thank You',
          scope: $scope,
          buttons: [
            {
              text: buttonName,
              onTap: function(e) {
                $scope.$parent.navIcons.allHidden = false;

                // if ($scope.action == 'Buy')
                // {
                //   $state.go('app.market', {category_id: 1, subcategory: 0, action: 'sell'});
                // } else if ($scope.action == 'Sell')
                // {
                  $state.go('app.messages');
                  $timeout(function() {
                    $ionicTabsDelegate.select(1);
                  });
                //}
              }
            }
          ]
        });
      },function(response){
        $ionicLoading.hide();
        console.log('----- Failed creating offer -----');
        console.log(response);

        if (response.status == 0) {
          $scope.$parent.retryForTimeout(createOffer);
          return;
        }

        $rootScope.popup = $ionicPopup.show({
          template: response.data.message,
          cssClass: 'thankYou-popup',
          title: 'Failed',
          scope: $scope,
          buttons: [
            {
              text: 'View Market',
              onTap: function(e) {
                $scope.$parent.navIcons.allHidden = false;
                var action = $scope.action == 'Buy' ? 'buy' : 'sell';
                $state.go('app.market', {category_id: 1, subcategory: 0, action: action});
              }
            },
            {
              text: 'Close',
              onTap: function(e) {
                $scope.$parent.toggleHomeIcons();
                $state.go('app.home');
              }
            }
          ]
        });
      });
  }

})

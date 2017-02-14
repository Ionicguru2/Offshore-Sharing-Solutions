'use strict';

/**
 * @ngdoc function
 * @name Oss.controller:MainController
 * @description
 * # MainController
 */
angular.module('Oss')
  .controller('MainController', function($scope,
                                        $ionicModal,
                                        $ionicPopover,
                                        $ionicPopup,
                                        $ionicHistory,
                                        $ionicTabsDelegate,
                                        $ionicSideMenuDelegate,
                                        $timeout,
                                        $state) {

    // Main layout object, is $watched for changes. Prime candidate for refactoring into a separate directive.
    $scope.navIcons = {
      allHidden: true,
      items: [
        {
          name: "logo",
          src: "images/res/logo.svg",
          hidden: true
        },
        {
          name: "messages",
          src: "images/res/logo.svg",
          hidden: true
        },
        {
          name: "settings",
          src: "images/res/logo.svg",
          hidden: true
        },
        {
          name: "ongoing",
          src: "images/res/logo.svg",
          hidden: true
        }
      ]
    }

    // Layout functions and variables, also to be refactored
    $scope.currentIcon = $scope.navIcons.items[0];
    $scope.setIcon = function(icon) {
      if (typeof icon !== 'string') return;
      $scope.currentIcon = $scope.navIcons.items.filter(function(i) {
        return (i.name === icon);
      })[0];
      $scope.currentIcon.hidden = false;
      $scope.navIcons.allHidden = false;
      $scope.titleHidden = true;
      $scope.searchHidden = true;
    }
    $scope.$watch('navIcons.allHidden', function() {
      if ($scope.navIcons.allHidden == true) {
        $scope.navIcons.items.forEach(function(i) {
          i.hidden = true;
        })
      }
    })

    $scope.searchHidden = true;
    $scope.titleHidden = true;

    // Would really like a more efficient and clean solution for all the layout functions below - quite sloppy
    $scope.toggleHomeIcons = function() {
      $scope.searchHidden = false;
      $scope.titleHidden = true;
    }
    $scope.isActiveTab = function(tab) {
      return tab == $state.current.name;
    }
    $scope.showBackBtn = function() {
      if ($state.current.name == 'app.home' || $state.current.name == 'app.login') {
        return false;
      }
      return true;
    }
    $scope.showFooter = function() {
      if ($state.current.name == 'app.login' || $state.current.name == 'app.post' || $state.current.name == 'app.convo') {
        return false;
      }
      return true;
    }
    $scope.goBack = function() {
      if ($state.current.name == 'app.post' && $ionicSideMenuDelegate.isOpen()) {
        $ionicSideMenuDelegate.toggleRight();
      }
      else if ($state.current.name == 'app.convo') {
        if ($scope.attachmentMenuOpen == true) {
          $ionicSideMenuDelegate.toggleRight();
          $scope.attachmentMenuOpen = false;
          $scope.showMessageFooter = true;
        }
        else {
          $state.go('app.messages');
        }
      }
      else if ($ionicHistory.backView() == null) {
        $scope.toggleHomeIcons();
        $state.go('app.home');
      }
      else {
        $ionicHistory.goBack();
      }
    }
    $scope.homeButton = function() {
      if ($state.current.name == 'app.post' && $ionicSideMenuDelegate.isOpen()) {
        $scope.toggleHomeIcons();
        $ionicSideMenuDelegate.toggleRight();
        $ionicHistory.goBack(-99);
      }
      else if ($ionicHistory.goBack() != null) {
        $scope.toggleHomeIcons();
        $ionicHistory.goBack(-99);
      }
      else {
        $scope.toggleHomeIcons();
        $state.go('app.home');
      }
    }
    $scope.messageButton = function() {
      $state.go('app.messages');
    }
    $scope.postButton = function() {
      $state.go('app.post', {categories: $scope.categories || []} );
    }
    $scope.ongoingButton = function() {
      $state.go('app.ongoing');
    }
    $scope.settingsButton = function() {
      $state.go('app.settings');
    }

    /*  USER INFO STUFF  */
    // For MVP purposes - User Info should ideally be pulled from API, perhaps stored in a local factory/service
    $scope.userInfo = {
      name: "",
      password: null,
      flow: null
    }

    /*  SEARCH STUFF  */
    // To be refactored into SearchService
    $ionicModal.fromTemplateUrl('templates/modal/searchModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.searchModal = modal;
    });
    $scope.$on('$destroy', function() {
      $scope.searchModal.remove();
    });
    $scope.modalCommand = function(cmd) {
      if (typeof cmd !== 'string') return;
      else if (cmd === 'show') {
        $scope.searchModal.show();
      }
      else if (cmd ==='hide') {
        $scope.searchModal.hide();
      }
    }
    $scope.executeSearch = function(q) {
      $scope.searchModal.hide()
        .then(function() {
          $state.go('app.search');
        })
    }


    $scope.retryForTimeout = function(callback){
        $ionicPopup.show({
          template: 'Stating that the connection timed out!',
          cssClass: 'thankYou-popup',
          title: 'Try again?',
          scope: $scope,
          buttons: [
            {
              text: 'Retry',
              onTap: function(e) {
                callback();
              }
            },
            {
              text: 'Cancel',
              onTap: function(e) {
              }
            }
          ]
        });
    }

  });

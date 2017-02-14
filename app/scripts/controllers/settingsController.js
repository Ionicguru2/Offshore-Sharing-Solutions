'use strict';

/**
 * @ngdoc function
 * @name Oss.controller:SettingsController
 * @description
 * # SettingsController
 */

angular.module('Oss')
.controller('SettingsController', function($scope,
                                            $state,
                                            $ionicPlatform,
                                            $ionicHistory,
                                            $ionicModal,
                                            $ionicPopup,
                                            $ionicLoading,
                                            $ionicSideMenuDelegate,
                                            $ionicSlideBoxDelegate,
                                            $ionicScrollDelegate,
                                            $timeout,
                                            $cordovaAppRate,
                                            LoginService,
                                            CONSTANTS,
                                            RegionService,
                                            NotificationService,
                                            ReportService) {

  $scope.$on('$ionicView.beforeEnter', function() {
    //Hide unwanted nav items
    $scope.showTopArrow = false;
    $scope.$parent.isActiveTab('app.settings');
    $scope.$parent.setIcon('settings');

    $scope.build_version = $scope.$parent.build_version;
    $scope.api_version = $scope.$parent.api_version;

    $scope.regions = $scope.$parent.regions;
    $scope.countries = $scope.$parent.countries;
    $scope.hideContinue = true;

    $ionicModal.fromTemplateUrl('templates/modal/settingModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.aboutModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal/termsModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.termsModal = modal;
    });
  });

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.$on('$ionicView.beforeLeave', function() {
    if (typeof $scope.modal !== 'undefined') { $scope.modal.remove(); }
    //Reset nav items before leaving
    $scope.$parent.navIcons.allHidden = false;
    $scope.$parent.searchHidden = false;
    $scope.$parent.navTitle = '';
    $timeout(function() {
      $scope.$parent.currentIcon.hidden = false;
    }, 500);
  });

  $scope.rightMenuClosed = function() {
    return $ionicSideMenuDelegate.isOpenRight();
  };

  //========================== Reset password ==========================

  $scope.modalCommand = function(cmd) {
    if (typeof cmd !== 'string') { return; }
      switch (cmd) {
        case 'show':
          $scope.modal.show();
          break;
        case 'hide':
          $scope.modal.hide();
          break;
      }
  }

  $scope.lockSlide = function(){
    $ionicSlideBoxDelegate.enableSlide(false);
  }

  $scope.slideChanged = function(index){
    $scope.slideIndex = index;
  }

  $scope.goBack = function()
  {
    if ($ionicSlideBoxDelegate.currentIndex() == 8) {
      //$ionicSlideBoxDelegate.previous();
      $ionicSlideBoxDelegate.slide(7, 300);
    }else{
      $scope.modalCommand('hide');
    }
  }

  $scope.resetPasswordModal = function(){
    $scope.title = 'Help';
    $scope.modalCommand('show');
    $ionicSlideBoxDelegate.slide(0, 0);
  }
  $scope.gotoRight = function(){
    $ionicSlideBoxDelegate.slide(1, 300);
  }
  $scope.verification = function(){
    //do something
    $ionicSlideBoxDelegate.slide(2, 300);
  }
  $scope.changePassword = function(){
    //do something
    $ionicPopup.show({
      template: 'Your password has been reset. You can now use your new passowrd to log in.',
      cssClass: 'confirm-popup',
      title: 'Success',
      scope: $scope,
      buttons: [
        {
          text: 'Continue',
          onTap: function(e) {
            $scope.modalCommand('about', 'hide');
          }
        }
      ]
    });
  }

  //========================== sign out ==========================
  // Should be a call to LoginService
  $scope.signout = function() {

    $ionicLoading.show({ template: 'Loading'});
    // Logout
    LoginService.Logout().then(
      function(response){
        $ionicLoading.hide();
        console.log('----- Success logout -----');
        console.log(response.data);

        $state.go('app.login');
      },
      function(response){
        $ionicLoading.hide();
        console.log('----- Failed logout -----');
        console.log(response);
        if (response.status == 0) {
          $scope.$parent.retryForTimeout($scope.signout);
        }
      });
  }

  //========================== help center ========================

  //========================== report a problem ===================
  $scope.showReportPopup = function(){
    $scope.reportPopup = $ionicPopup.show({
      template: '<div ng-click="reportModal(3)"><span class="button-text">Spam or Abuse</span></div>'
                +'<div ng-click="reportModal(4)"><span class="button-text">Something Isn&apos;t Working</span></div>'
                +'<div ng-click="reportModal(5)"><span class="button-text">General Feedback</span></div>',
      cssClass: 'report-popup',
      title: 'Report a problem',
      scope: $scope,
      buttons: [
        {
          text: 'Cancel',
          onTap: function(e) {
            $scope.modalCommand('about', 'hide');
          }
        }
      ]
    });
  }

  $scope.reportData = {
    type:     '',
    message:  ''
  };

  $scope.reportModal = function(index){
    $scope.title = 'Help';
    $scope.reportPopup.close();
    // $scope.modalCommand('about', 'show');
    // $ionicSlideBoxDelegate.slide(index, 0);
    // $scope.slideIndex = 0;
    $scope.reportData.message = '';

    $scope.modal = $scope.aboutModal;
    $ionicSlideBoxDelegate.slide(index, 0);
    $scope.slideIndex = index;
    $scope.modalCommand('show');
  }

  $scope.reportToServer = function(type){

    switch (type) {
      case 'spam':
        $scope.reportData.type = CONSTANTS.REPORT_TYPE.SPAM;
        break;
      case 'something':
        $scope.reportData.type = CONSTANTS.REPORT_TYPE.BROKEN;
        break;
      case 'general':
        $scope.reportData.type = CONSTANTS.REPORT_TYPE.FEEDBACK;
        break;
      default:
        break;
    }

    if ($scope.reportData.message == '')
    {
      $ionicPopup.show({
        template: 'Please input your message.',
        cssClass: 'invalid-popup',
        title: 'Emepty message.',
        scope: $scope,
        buttons: [
          {
            text: 'OK',
            onTap: function(e) {

            }
          }
        ]
      });
    } else
    {
      $ionicLoading.show({ template: 'Loading'});
      // Create report
      ReportService.createReport($scope.reportData).then(
        function(response){
          $ionicLoading.hide();
          console.log('----- Success create report -----');
          console.log(response.data);

          $ionicPopup.show({
            template: 'Your feedback helps make Offshore Sharing better.',
            cssClass: 'confirm-popup',
            title: 'Success',
            scope: $scope,
            buttons: [
              {
                text: 'Continue',
                onTap: function(e) {
                  $scope.modalCommand('about', 'hide');
                }
              }
            ]
          });
        },
        function(response){
          $ionicLoading.hide();
          console.log('----- Failed create report -----');
          console.log(response);
        });
    }
  }

  //========================== notification ===================
  $scope.notificationModal = function(index){

    $ionicLoading.show({ template: 'Loading'});
    // Get notification settings
    NotificationService.getSettings().then(
      function(response){
        $ionicLoading.hide();
        console.log('----- Success get notification settings -----');
        console.log(response.data);

        $scope.notifications = response.data;

        $scope.title = 'Notifications';
        $scope.modalCommand('about', 'show');
        $ionicSlideBoxDelegate.slide(6, 0);
        $scope.slideIndex = 6;
      },
      function(response){
        $ionicLoading.hide();
        console.log('----- Failed get notification settings -----');
        console.log(response);
      });
  }

  $scope.setNotification = function(identifier){

    var notification_value = true;
    for (var i = $scope.notifications.length - 1; i >= 0; i--) {
      var notification = $scope.notifications[i];
      if (notification.notification_type.identifier == identifier) {
        $scope.notifications[i].allowed = !$scope.notifications[i].allowed;
        notification_value = $scope.notifications[i].allowed;
      }
    }

    $ionicLoading.show({ template: 'Loading'});
    //Set notification settings
    NotificationService.setSettings(identifier).then(
      function(response){
        $ionicLoading.hide();
        console.log('----- Success set notification settings -----');
        console.log(response.data);

        // Send tag
        NotificationService.sendTag(identifier, notification_value);

        // //***************** send notification test
        // NotificationService.sendNotification().then(
        //   function(response){
        //     console.log('----- Success send notification -----');
        //     console.log(response.data);
        //   },
        //   function(response){
        //     console.log('----- Failed send notification -----');
        //     console.log(response);
        //   });
      },
      function(response){
        $ionicLoading.hide();
        console.log('----- Failed set notification settings -----');
        console.log(response);
      });
  }

  //========================== region ===================
  $scope.regionModal = function(index){

    $ionicLoading.show({ template: 'Loading'});
    //Fetch all regions from backend
    RegionService.getAllRegions().then(
      function(regionsRes){
        $ionicLoading.hide();
        console.log('----- Success getting all regions -----');
        console.log(regionsRes.data);

        $scope.regions = regionsRes.data;

        for (var key in $scope.regions)
        {
          if (key == 'selected') {
            $scope.region_id = $scope.regions[key];
          }
        }

        $scope.title = 'Regions';
        $scope.modalCommand('about', 'show');
        $ionicSlideBoxDelegate.slide(7, 0);
        $scope.slideIndex = 7;
      },
      function(response){
        $ionicLoading.hide();
        console.log('----- Failed getting all regions -----');
        console.log(response);
      });
  }
  $scope.chooseRegion = function(region){
    $scope.region = region;
  }
  $scope.saveRegion = function(){
    if ($scope.region == null)
    {
      $ionicPopup.show({
        template: 'Please select a region in the list before save.',
        cssClass: 'invalid-popup',
        title: 'No selection found.',
        scope: $scope,
        buttons: [
          {
            text: 'OK',
            onTap: function(e) {

            }
          }
        ]
      });
    }else
    {
      $ionicLoading.show({ template: 'Loading'});
      // Create report
      RegionService.setRegion($scope.region.id).then(
        function(response){
          $ionicLoading.hide();
          console.log('----- Success set region -----');
          console.log(response.data);

          $ionicPopup.show({
            template: 'Region ('+$scope.region.name+') has been saved successfully.',
            cssClass: 'confirm-popup',
            title: 'Success',
            scope: $scope,
            buttons: [
              {
                text: 'OK',
                onTap: function(e) {
                  $scope.$parent.region_id = $scope.region.id;
                  $scope.modalCommand('about', 'hide');
                }
              }
            ]
          });
        },
        function(response){
          $ionicLoading.hide();
          console.log('----- Failed set region -----');
          console.log(response);
        });
    }
  }
  $scope.regionCountries = function(region)
  {
    $scope.region_id = region.id;
    $scope.region_name = region.name;
    $ionicSlideBoxDelegate.slide(8, 300);
    //$ionicSlideBoxDelegate.next();
  }

  //========================== application =====================
  $scope.setModal = function(modal) 
  {
    if (typeof modal !== 'string') { return; }

    $scope.isAbout = false;
    $scope.modal = $scope.aboutModal;
    $ionicSlideBoxDelegate.slide(9, 0);
    $scope.slideIndex = 9;

    var navTitle = '';

    switch (modal){
      case 'about':
        navTitle = 'About';
        $scope.isAbout = true;
        break;
      case 'privacy':
        navTitle = 'Privacy Policy';
        break;
      case 'terms':
        navTitle = 'Terms and Conditions';
        $scope.modal = $scope.termsModal;
        break;
      case 'legal':
        navTitle = 'Legal Notes';
        break;
      default:
        break;
    }

    $scope.title = navTitle;
    $scope.modalCommand('show');
  };

  $scope.rateInAppStore = function()
  {
    $cordovaAppRate.promptForRating(true).then(function(result){
    });

    // $cordovaAppRate.navigateToAppStore().then(function(result){
    // });
  }

})

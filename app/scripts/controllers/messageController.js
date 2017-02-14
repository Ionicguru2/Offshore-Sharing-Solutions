'use strict';

/**
 * @ngdoc function
 * @name Oss.controller:MessageController
 * @description
 * # MessageController
 */
angular.module('Oss')

  .controller('MessageController', function($scope,
                                            $state,
                                            $sce,
                                            $stateParams,
                                            $ionicPopup,
                                            $ionicModal,
                                            $ionicLoading,
                                            $ionicScrollDelegate,
                                            $ionicTabsDelegate,
                                            $timeout,
                                            $rootScope,
                                            ionicToast,
                                            UserService,
                                            AlertService,
                                            MessagingService,
                                            OfferService,
                                            ProductService,
                                            LoginService,
                                            CONSTANTS) {

    $scope.$on('$ionicView.beforeEnter', function() {
      //Hide unwanted nav items
      $scope.showTopArrow = false;
      $scope.$parent.isActiveTab('app.messaging');
      $scope.$parent.setIcon('messages');
      $scope.currentUser = $scope.$parent.currentUser;
      // Set empty list template for this page.
      $scope.emptyList = {
        messages: {
          enabled: false,
          message: $sce.trustAsHtml('When you offer to buy or sell a marketplace item, your conversations will appear here.<br /><hr><span class="sub"><strong>Visit the marketplace</strong> to view items wanted and for sale.</span>'),
          buttonText: 'GO TO MARKETPLACE',
          buttonLink: function() {
            $state.go('app.market', {category_id: 'all', subcategory: 0, action: 'buy'});
          }
        },
        alerts: {
          enabled: false,
          message: $sce.trustAsHtml('When you offer to buy or sell a marketplace item, your alerts for the item will appear here.<br /><hr><span class="sub"><strong>Visit the marketplace</strong> to view items wanted and for sale.</span>'),
          buttonText: 'GO TO MARKETPLACE',
          buttonLink: function() {
            $state.go('app.market', {category_id: 'all', subcategory: 0, action: 'buy'});
          }
        }
      }

      $scope.doneLoading = false;
      // Watch for the Messages/Alerts to be done loading, then enable the empty list template.
      $scope.$watch('doneLoading', function() {
        if (typeof $scope.channels == 'undefined' || $scope.channels.length <= 0) {
          $scope.emptyList.messages.enabled = true;
        }
        else $scope.emptyList.messages.enabled = false;
        if (typeof $scope.alerts == 'undefined' || $scope.alerts.length <= 0) {
          $scope.emptyList.alerts.enabled = true;
        }
        else $scope.emptyList.alerts.enabled = false;

        // when we have finished loading all of the alerts, jump to the alert specified
        if ($stateParams.alertId !== null)
        {
          for (var m = 0; m < $scope.alerts.length; m++)
          {
            if ($scope.alerts[m].id = $stateParams.alertId)
            {
              $scope.viewAlert(m);
              break;
            }
          }
        }
      })

      $ionicModal.fromTemplateUrl('templates/modal/pendingOfferModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.pendingofferModal = modal;
      });

      $ionicModal.fromTemplateUrl('templates/modal/numpadModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.numpadModal = modal;
      });

      $scope.channels = [];

      $ionicLoading.show({ template: 'Loading...'});
      MessagingService.channel.list()
        //List channels
        .then(function(data) {
          function getTimestampLabel(ts) {
            if (ts === 0) return "No messages.";
            ts = moment(ts);
            var diff = moment().diff(ts, 'days');
            if ( diff === 0 ) {
              return ts.format('HH:mm');
            }
            else if ( diff === 1 ) {
              return "Yesterday, " + ts.format('HH:mm');
            }
            else if ( diff > 1 ) {
              return ts.format('MM/DD/YY HH:mm');
            }
          }

          function getTimeDiff(ts) {
            return moment().diff(ts);
          }

          $ionicLoading.hide();
          $scope.channels = data.data.map(function(x) {
            return {
              title: x.user.identifier,
              lastMessage: x.last_message,
              timestamp: x.last_message_ts,
              //time_label: getTimestampLabel(x.last_message_ts),
              time_label: getTimestampLabel(x.last_message_ts == 0 ? x.created_at : x.last_message_ts),
              unreadMessages: x.unread_message_count > 0,
              url: x.channel_url,
              transaction_id: x.transaction_id,
              lastActivity: getTimeDiff(x.last_message_ts == 0 ? x.created_at : x.last_message_ts)
            }
          });

          $scope.channels.sort(function(a, b){
            return parseFloat(a.lastActivity) - parseFloat(b.lastActivity);
          });

          console.log("Channels:");
          console.log($scope.channels);
          getAllAlerts();
        })
        .catch(function(error) {
          console.log(error);
        });

      // Get all alerts from backend
    });
    // This functionality is not wanted by the client.
    // Instead, they would like for the top tab-nav to be fixed position while the user scrolls down.
    $scope.getScrollPosition = function(){
      var pos = $ionicScrollDelegate.getScrollPosition().top;
      if (pos >= 120) { $scope.$apply(function() {
        $scope.showTopArrow = true;
      }); }
      else { $scope.$apply(function() {
        $scope.showTopArrow = false;
      })  }
    };
    $scope.scrollTop = function() {
      $ionicScrollDelegate.scrollTop(true);
    };

    $scope.viewChannel = function(channel) {
      $ionicLoading.show({ template: 'Loading...'});
      MessagingService.channel.fetch(channel.transaction_id)
        .then(function(res) {
          console.log("Fetched channel.");
          console.log(res);
          res.transaction_id = channel.transaction_id;
          $state.go('app.convo', {channel: res});
        })
    };

    $scope.goToConvo = function(_transaction_id) {
      console.log(alert);
      MessagingService.channel.fetch(_transaction_id)
        .then(function(res) {
          res.transaction_id = _transaction_id;
          $scope.modal.hide();
          $state.go('app.convo', {channel: res});
        })
    };
    $scope.goToItemDescription = function(item) {
      $scope.modal.hide();
      if (typeof item !== 'undefined' && item !== 'null') {
        $state.go('app.itemDescription', { id: item.category.parent_id==1 ? item.category_id : item.category.parent_id, item: item, action: item.type });
      }
    };

    $scope.read_class = function(flag) {

      if (flag)
        return 'unread';
      else
        return 'read';

    };

    $scope.$on('$destroy', function() {
      if (typeof $scope.modal !== 'undefined') {
        $scope.modal.remove();
      }
    });
    $scope.modalCommand = function(cmd) {
      if (typeof cmd !== 'string') { return; }
      else if (cmd === 'show') {
        $scope.modal.show();
      }
      else if (cmd ==='hide') {
        $scope.modal.hide();
        getAllAlerts();
      }
    }

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


    $scope.viewAlert = function(index) {
      $scope.alert_id = index;
      $scope.modal = $scope.pendingofferModal;
      viewAlert();
      $rootScope.popup.close();
    };

    $scope.approveOffer = function(userType) {

      $scope.verify = false;
      if (typeof $scope.product !== undefined && $scope.isBuyer == true) {
        $ionicPopup.show({
          template: 'Would you like Offshore Sharing Solutions to confirm that this item meets all <u>ISO Standards</u> through a third party?',
          cssClass: 'thankYou-popup',
          title: 'Verify Certification?',
          scope: $scope,
          buttons: [
            {
              text: 'Yes',
              onTap: function(e) {
                $scope.verify = true;
              }
            },
            {
              text: 'No',
              onTap: function(e) {
                $scope.verify = false;
              }
            }
          ]
        });
      }

      $scope.userType = userType;

      $scope.action_type = 'approve_offer';

      $scope.modal = $scope.numpadModal;
      $scope.modalCommand('show');
    };

    $scope.denyOffer = function(userType) {
      /*if (!$scope.isBuyer){
        $scope.modal.hide();
        return;
      }*/
      $scope.userType = userType;

      $scope.action_type = 'deny_offer';
      $scope.modal = $scope.numpadModal;
      $scope.modalCommand('show');
    };



    // Callback functions
    function getAllAlerts()
    {
      $ionicLoading.show({ template: 'Loading...'});
      AlertService.getAllAlerts().then(
        function(response){
          $ionicLoading.hide();
          console.log('----- Success getting all alerts -----');
          console.log(response.data);
          $scope.alerts = response.data;
          $scope.doneLoading = true;
        },
        function(response){
          $ionicLoading.hide();
          console.log('----- Failed getting all alerts -----');
          console.log(response);
          if (response.status == 0) {
            $scope.$parent.retryForTimeout(getAllAlerts);
          }
          $scope.doneLoading = true;
        });
    }

    //==========view alert
    function viewAlert()
    {
      var selectedItem = $scope.alerts[$scope.alert_id];
      $scope.alert = $scope.alerts[$scope.alert_id];

      $ionicLoading.show({ template: 'Loading...'});

      if ($scope.alert.type == CONSTANTS.OFFER_TYPE.OFFER || $scope.alert.type == 'message')
      {
        $scope.offer_id = $scope.alert.type_id;
        viewOffer();
      } else if($scope.alert.type == CONSTANTS.OFFER_TYPE.TRANSACTION)
      {
        if ($scope.alert.seen == 0) {
          // Set alert as seen
          AlertService.setAlertAsSeen($scope.alert.id).then(
            function(response){
              $ionicLoading.hide();
              console.log('----- Success set alert as seen -----');
              console.log(response.data);
              viewTransaction($scope.alert.type_id);
            },
            function(response){
              $ionicLoading.hide();
              console.log('----- Failed set alert as seen -----');
              console.log(response);
              if (response.status == 0) {
                $scope.$parent.retryForTimeout(viewAlert);
              }
            });
        } else
        {
          viewTransaction($scope.alert.type_id);
        }
      }
    }

    function viewOffer()
    {
      $ionicLoading.show({ template: 'Loading...'});
      // Get offer detail for getting product_id

      OfferService.getOfferDetail($scope.offer_id).then(
        function(response){

          console.log('----- Success getting offer detail -----');
          console.log(response.data);

          ProductService.getAllProducts().then(
            function() { 
              $ionicLoading.hide();
              

              $scope.product = ProductService.convertDetailToUIData(response.data.product.id);
              $scope.product_id = response.data.product_id;
              $scope.transaction_id = response.data.transaction.id;

              $scope.offer = response.data;

              function isBuyerCurrentUser() {
                if (typeof response.data.product !== undefined && typeof $scope.currentUser !== undefined) {
                  var product = response.data.product;
                  if (product.type == 'buy' && product.user_id == $scope.currentUser.id) return true;
                  if (product.type == 'sell' && product.user_id != $scope.currentUser.id) return true;
                  return false;
                }
              }
              function isOwnerCurrentUser() {
                if (typeof response.data.product !== undefined && typeof $scope.currentUser !== undefined) {
                  var product = response.data.product;
                  if ($scope.currentUser.id == product.user_id) return true;
                  return false;
                }
              }
              $scope.isBuyer = isBuyerCurrentUser();
              $scope.isOwner = isOwnerCurrentUser();
              $scope.opponent_user = $scope.currentUser.id == response.data.transaction.users[0].id ? response.data.transaction.users[1] : response.data.transaction.users[0];
              $scope.notification_message = $scope.isOwner ? 'Your offer has been confirmed.' : 'Your offer has been approved.';
              $scope.notification_key = $scope.isBuyer ? response.data.enable_user : 'approved_offer';

              console.log("isOwner: " + $scope.isOwner);
              console.log("isBuyer: " + $scope.isBuyer);
              console.log("notification: " + $scope.notification_message);

              $scope.modal.show();
            }
          );
        },
        function(response){
          $ionicLoading.hide();
          console.log('----- Failed getting offer detail -----');
          console.log(response);
          if (response.status == 0) {
            $scope.$parent.retryForTimeout(viewOffer);
          }
        });
    }

    //================

    function viewTransaction(transaction_id)
    {
      $ionicLoading.hide();
      $state.go('app.ongoing');
    }

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
            if ($scope.action_type === 'approve_offer') {
              if ($scope.verify == true) {
                OfferService.requestValidation($scope.transaction_id)
                  .then(function() {
                    approveOffer();
                  })
              }
              else {
                approveOffer();
              }
            } else if ($scope.action_type === 'deny_offer') {
              denyOffer();
            }
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

    function approveOffer()
    {
      // Approve or confirm offer
      $ionicLoading.show({ template: 'Loading...'});
      OfferService.approveOffer($scope.alert.type_id).then(
        function(response){
          $ionicLoading.hide();
          console.log('----- Success approving or confirming '+$scope.userType+'  offer -----');
          console.log(response.data);
          $scope.modal.hide();

          $ionicPopup.show({
            template: 'Your request has been sent successfully!',
            cssClass: 'confirm-popup',
            title: 'Thank You',
            scope: $scope,
            buttons: [
              {
                text: 'OK',
                onTap: function(e) {
                  $scope.pendingofferModal.hide();
                  getAllAlerts();
                }
              }
            ]
          });
        },
        function(response){
          $ionicLoading.hide();
          console.log('----- Failed approving or confirming'+$scope.userType+'  offer -----');
          console.log(response);
          if (response.status == 0) {
            $scope.$parent.retryForTimeout(approveOffer);
          }
        });
    }

    function denyOffer()
    {
      // deny offer
      $ionicLoading.show({ template: 'Loading...'});
      OfferService.denyOffer($scope.alert.type_id).then(
        function(response){
          $ionicLoading.hide();
          console.log('----- Success deny '+$scope.userType+' offer -----');
          console.log(response.data);
          $scope.modal.hide();

          $ionicPopup.show({
            template: 'Your request has been sent successfully!',
            cssClass: 'confirm-popup',
            title: 'Thank You',
            scope: $scope,
            buttons: [
              {
                text: 'OK',
                onTap: function(e) {
                  $scope.pendingofferModal.hide();
                  getAllAlerts();
                }
              }
            ]
          });
        },
        function(response){
          $ionicLoading.hide();
          console.log('----- Failed deny '+$scope.userType+' offer -----');
          console.log(response);
          if (response.status == 0) {
            $scope.$parent.retryForTimeout(denyOffer);
          }
        });
    }

    $scope.doRefresh = function()
    {
      AlertService.getAllAlerts().then(
        function(response){
          console.log('----- Success getting all alerts -----');
          console.log(response.data);

          $scope.$broadcast('scroll.refreshComplete');
          ionicToast.show('Loading completed.', 'bottom', false, 2500);
          $scope.alerts = response.data;
        },
        function(response){
          console.log('----- Failed getting all alerts -----');
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

'use strict';

/**
 * @ngdoc function
 * @name Oss.controller:ConversationController
 * @description
 * # ConversationController
 */


angular.module('Oss')
  .controller('ConversationController', function($scope,
                                                  $rootScope,
                                                  $sanitize,
                                                  $state,
                                                  $stateParams,
                                                  $ionicLoading,
                                                  $ionicSideMenuDelegate,
                                                  $ionicScrollDelegate,
                                                  $timeout,
                                                  $interval,
                                                  ContractService,
                                                  LoginService,
                                                  MessagingService) {

    // Demo attachment vars - to be replaced with a proper AttachmentService post-MVP
    $scope.currentAttachment = {
      name: "Contract_Template_1.pdf"
    };
    $scope.attachmentSelected = false;
    $scope.mapMsg = function(messages) {

      var obj = messages.map(function(x) {

        var sub_data = JSON.parse(x.data);

        var message_data = {
          isFile: (sub_data.type == 'FILE' ? true : false),
          m: sub_data.type == 'FILE' ? sub_data.filename : x.message,
          link: sub_data.type == 'FILE' ? x.message: '',
          s: (LoginService.getCurrentUser().id == x.id) ? 1 : 0,
          t: x.timestamp,
          message_id: x.message_id
        }

        return message_data;
      });
      return obj;
    }

    $scope.getMessages = function (event, args) {
        var messages = $stateParams.channel.data.messages;
        $scope.convo = $scope.mapMsg(messages);
        $timeout(function() {
          $ionicScrollDelegate.scrollBottom(true);
          $ionicLoading.hide();
        });
    };

    var promise = $interval(function() {
      if (typeof $scope.convo == undefined || $scope.convo.length == 0) {
        MessagingService.channel.fetch($stateParams.channel.transaction_id)
          .then(function(res) {
            $scope.convo = $scope.mapMsg(res.data.messages);
          })
      }
      else {
        MessagingService.channel.refresh($stateParams.channel.transaction_id, $scope.convo[$scope.convo.length-1].message_id)
          .then(function(res) {
            console.log("Refreshing messages.");
            console.log(res.data);
            if (typeof res.data !== undefined && res.data.length > 0) {
              console.log("New message(s) received!");
              console.log(res.data);

              $scope.convo = $scope.convo.concat( $scope.mapMsg(res.data) );
              $ionicScrollDelegate.scrollBottom(true);
            }
          })
      }
    }, 3000)

    $scope.$on('$ionicView.beforeEnter', function() {
      $scope.$parent.setIcon('messages');
      $scope.channel = $stateParams.channel || {};
      $scope.$parent.navTitle = $scope.channel.title || "Conversation";
      $scope.$parent.showMessageFooter = true;
      $scope.getMessages();
    });

    $scope.$on('$ionicView.beforeLeave', function() {
      //Reset nav items before leaving
      $scope.$parent.navIcons.allHidden = false;
      $scope.$parent.searchHidden = false;
      $scope.$parent.navTitle = "";
      $timeout(function() {
        $scope.$parent.currentIcon.hidden = false;
      }, 500)
    });

    $scope.$on('$destroy', function () { $interval.cancel(promise); });

    // Menu functions - Left is messaging window, Right is attachment dialogue
    $scope.rightMenuClosed = function() {
      return $ionicSideMenuDelegate.isOpenRight()
    }

    $scope.openRight = function()
    {
      $scope.$parent.attachmentMenuOpen = true;
      $scope.$parent.showMessageFooter = false;
      $ionicLoading.show({ template: 'Loading'});
      // Get contracts
      ContractService.getContracts().then(
        function(response){
          console.log("Response from ContractsService:");
          console.log(response);
          $ionicLoading.hide();
          console.log('----- Success get contracts -----');

          var contracts = [];


          var traverse = function(inner, path) {

            if (typeof inner == 'undefined')
              return;

            if (typeof inner.children != 'undefined')
            {
              for (var i = 0; i < inner.children.length; i++)
              {
                // http://i.imgur.com/zFLxR.jpg
                traverse(inner.children[i], path + inner.name + '/');
              }
            }

            // i could do better
            if (inner.size != '-')
              contracts.push({ id: inner.id, name: path + inner.name, size: inner.size, path: inner.path });

          };

          for (var m = 0; m < response.data.children.length; m++)
          {
            traverse(response.data.children[m], '');
          }

          $scope.contracts = contracts;
          console.log("$scope.contracts:");
          console.log($scope.contracts);

          $ionicSideMenuDelegate.toggleRight();
        },
        function(response){
          $ionicLoading.hide();
          console.log('----- Failed get contracts -----');
          console.log(response);
        });
    }

    // To be replaced with an AttachmentService ASAP
    $scope.addAttachment = function(att) {
      //$scope.currentAttachment = att;
      $scope.attachmentSelected = true;
      $ionicSideMenuDelegate.toggleRight();
      $scope.$parent.showMessageFooter = true;

      MessagingService.channel.attachment($stateParams.channel.transaction_id, att.id)

      $timeout(function() {
        $ionicScrollDelegate.scrollBottom(true);
      }, 500);

    }

    $scope.openPDFFile = function(url){
      window.open(url, '_system', 'location=yes');
    }

    $scope.sendMessage = function(msg) {
      msg = $sanitize(msg);
      MessagingService.channel.send($stateParams.channel.transaction_id, msg)
      .then(function(response) {
        console.log('fetched: ', response);
        if (!$scope.convo) {
          $scope.convo = [];
        }
        /*$scope.convo.push({
          m: msg,
          s: 1,
          isFile: false
        });*/
        $timeout(function() {
          $ionicScrollDelegate.scrollBottom(true);
        });
      }, function(error) {
        console.log('fetch error: ', error);
      });
      $scope.messageContent = "";
    };

    // Determines which side the message is displayed on (sender or receiver) - should be replaced with MessagingService ASAP
    $scope.message_side = function(side)
    {
      if (side == 0)
        return 'left';
      else
        return 'right';
    };

  });

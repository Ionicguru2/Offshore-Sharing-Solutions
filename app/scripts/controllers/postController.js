'use strict';

/**
 * @ngdoc function
 * @name Oss.controller:PostController
 * @description
 * # PostController
 */
angular.module('Oss')
  .controller('PostController', function($scope, 
                                        $rootScope,
                                        $state, 
                                        $stateParams, 
                                        $ionicSideMenuDelegate, 
                                        $ionicPlatform, 
                                        $ionicPopup, 
                                        $ionicModal, 
                                        $ionicLoading, 
                                        $timeout, 
                                        $cordovaCamera,
                                        $ionicScrollDelegate,
                                        ionicDatePicker, 
                                        UserService,
                                        ProductService, 
                                        RegionService, 
                                        ImageProcessService,
                                        StringService,
                                        CONSTANTS) {

    //window.addEventListener('native.keyboardshow', keyboardShowHandler);
    //window.addEventListener('native.keyboardhide', keyboardHideHandler);

    // Layout variable, to be refactored
    $scope.$parent.titleHidden = false;
    $scope.region_id = $scope.$parent.region_id;
    $scope.currentUser = $scope.$parent.currentUser;
    $scope.categories = $scope.$parent.categories;
    $scope.categorySelection = '';
    $scope.hasSubCategory = true;

    $scope.filmstrip_images = [];

    // MVP object for a single currentProduct - let's change this into a directive
    $scope.currentProduct = {
      title: null,
      type: CONSTANTS.POST_TYPE.NONE,
      sku: null,
      details: null,
      price: null,
      available_from: null,
      available_to: null,
      category_id: 2,
      sub_category_id: null,
      region_id: $scope.$parent.region_id,
      country_id: null,
      images: [],
      quantity: 0,
      seats: 0
    };

    // More layout functions, to be refactored
    $scope.$on('$ionicView.beforeEnter', function() {
      //Hide unwanted nav items
      $scope.$parent.navIcons.allHidden = true;
      $scope.$parent.searchHidden = true;
      $scope.$parent.navTitle = 'New Listing';

      $scope.regions = $scope.$parent.regions;
      $scope.region_id = $scope.$parent.region_id;
      $scope.currentProduct.region_id = $scope.$parent.region_id;
      $scope.countries = $scope.$parent.countries;
      
      $ionicModal.fromTemplateUrl('templates/modal/numpadModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
    });
    $scope.$on('$ionicView.afterEnter', function() {
      $timeout(function() {
        if (typeof cordova !== 'undefined') {
          cordova.plugins.Keyboard.close();
        }
      }, 1000);
    });

    $scope.$on('$ionicView.beforeLeave', function() {
      $scope.modal.remove();
      //Reset nav items before leaving
      $scope.$parent.navIcons.allHidden = false;
      $scope.$parent.searchHidden = false;
      $scope.$parent.navTitle = '';
      $timeout(function() {
        $scope.$parent.currentIcon.hidden = false;
      }, 500);
    });

    /*  FORM STUFF  */
    // Form needs a lot of work
    
    $scope.showDatePicker = function(range) {

      var fromDate = new Date();
      var toDate = new Date(2050, 11, 31);

      if (range === 'from') { 
        fromDate = new Date();
        if ($scope.currentProduct.available_to !== null) {
          toDate = new Date($scope.currentProduct.available_to);
          toDate.setTime(toDate.getTime() - 86400000);
        } else {
          toDate = new Date(2050, 11, 30);
        }
      } else if (range === 'to') { 
        toDate = new Date(2050, 11, 31);
        if ($scope.currentProduct.available_from !== null) {
          fromDate = new Date($scope.currentProduct.available_from);
          fromDate.setTime(fromDate.getTime() + 86400000);
        } else {
          fromDate = fromDate.setTime(fromDate.getTime() + 86400000);
          fromDate = new Date(fromDate);
        }
      }

      var pickerOptions = {
        from: fromDate,
        to: toDate,
        inputDate: fromDate,
        setLabel: 'DONE',
        showTodayButton: false,
        closeLabel: 'CANCEL',
        mondayFirst: true,
        closeOnSelect: false,
        templateType: 'popup',

        callback: function (date) {
          if (range === 'from') { 
            $scope.currentProduct.available_from = moment(date).format('YYYY-MM-DD');
          } else if (range === 'to') { 
            $scope.currentProduct.available_to = moment(date).format('YYYY-MM-DD');
          }
          if ($scope.currentProduct.available_from !== null && $scope.currentProduct.available_to !== null) {
            var before = moment($scope.currentProduct.available_from, 'YYYY-MM-DD');
            var after = moment($scope.currentProduct.available_to, 'YYYY-MM-DD');
            $scope.currentProduct.days = after.diff(before, 'days');
          }
        }
      };

      ionicDatePicker.openDatePicker(pickerOptions);
    };

    function checkHasSubCategory()
    {
      if ($scope.currentProduct.category_id === null)
      {
        $scope.hasSubCategory = false;
      }
      for (var i = $scope.allcategories.length - 1; i >= 0; i--) {
        if ($scope.allcategories[i].parent_id == $scope.currentProduct.category_id)
        {
          $scope.hasSubCategory = true;
          return;
        }
      }
      $scope.hasSubCategory = false;
    }

    $scope.showSelectPicker = function(type)
    {
      var template = '';
      var title = '';

      switch (type){
        case 'category':
          template = CONSTANTS.MODEL_CATEGORY_SELECTOR;
          title = 'Please select a category';
          break;
        case 'subcategory':
          template = CONSTANTS.MODEL_SUBCATEGORY_SELECTOR;
          title = 'Please select a sub category';
          break;
        case 'country':
          template = CONSTANTS.MODEL_COUNTRY_SELECTOR;
          title = 'Please select a country';
          break;
        case 'region':
          template = CONSTANTS.MODEL_REGION_SELECTOR;
          title = 'Please select a region';
          break;
        default:
          break;
      }
      $ionicPopup.show({
        template: template,
        cssClass: 'select-popup',
        title: title,
        scope: $scope,
        buttons: [
          {
            text: 'OK',
            onTap: function(e) { 
              if (type === 'region'){
                $scope.currentProduct.country_id = null;
                $scope.countryName = '';
                $scope.regionName = StringService.limiteString($scope.regions[$scope.currentProduct.region_id].name, true, 20);
              } else if (type === 'country' && $scope.currentProduct.country_id !== null){
                $scope.countryName = StringService.limiteString($scope.countries[$scope.currentProduct.country_id-1].name, true, 20);
              } else if (type === 'category') {

                $scope.currentProduct.sub_category_id = null;
                $scope.currentProduct.seats = 0;
                $scope.currentProduct.quantity = 0;
                
                checkHasSubCategory();
              } else if (type === 'subcategory') {
                $scope.isInvalidCategoryID = false;
                $scope.currentProduct.seats = 0;
                $scope.currentProduct.quantity = 0;
                $scope.isInvalidSubCategoryID = false;
              }
            }
          }
        ]
      });
    };

    // Menu functions - Left is Forms, Right is Confirmation
    $scope.rightMenuClosed = function() {
      return $ionicSideMenuDelegate.isOpenRight();
    };

    function isOtherFieldsInvalid(){
      if (!$scope.currentProduct.type) { return true; }
      return false;
    }

    function checkHasSubCategory()
    {
      if ($scope.currentProduct.category_id === null)
      {
        $scope.hasSubCategory = false;
        return false;
      }
      for (var i = $scope.allcategories.length - 1; i >= 0; i--) {
        if ($scope.allcategories[i].parent_id == $scope.currentProduct.category_id)
        {
          $scope.hasSubCategory = true;
          return true;
        }
      }
      $scope.hasSubCategory = false;
      return false;
    }

    function isInvalidCategoryID()
    {
      if ($scope.currentProduct.sub_category_id === null)
      {
        for (var i = $scope.allcategories.length - 1; i >= 0; i--) {
          if ($scope.allcategories[i].parent_id === $scope.currentProduct.category_id)
          {
            $scope.isInvalidCategoryID = true;
            return true;
          }
        }
      }
      $scope.isInvalidCategoryID = false;
      return false;
    }

    function isInvalidSubCategoryID()
    {
      if (checkHasSubCategory() && $scope.currentProduct.sub_category_id === null)
      {
        $scope.isInvalidSubCategoryID = true;
        return true;
      }
      else
      {
        $scope.isInvalidSubCategoryID = false;
        return false;
      }
    }

    // Go to product preview page
    $scope.openRight = function(form) {
      // Checking valid datas of product form
      var v1 = isInvalidCategoryID();
      var v2 = isInvalidSubCategoryID();
      var v3 = isOtherFieldsInvalid();

      if ( v1 || v2 || v3 || (form && form.$invalid) ) {
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
        });
        return;
      }

      for (var i = 0; i < $scope.allcategories.length ; i++)
      {
        // see the category service... subcat images are overwritten on the object, need to go to the source
        var f_img = '';
        for (var j = 0; j < $scope.allcategories[i].category_images.length; j++)
        {
          if ($scope.allcategories[i].category_images[j].types == 'HEADER')
            f_img = $scope.allcategories[i].category_images[j].path;
        }

        if ($scope.allcategories[i].id == $scope.currentProduct.sub_category_id && f_img != '')
        {
          $scope.imgPic = f_img;
        }
      }

      if (!$scope.imgPic)
      {
        for (var i = 0; i < $scope.allcategories.length ; i++)
        {
          if ($scope.allcategories[i].id == $scope.currentProduct.category_id && $scope.allcategories[i].HEADER_image != null)
          {
            $scope.imgPic = $scope.allcategories[i].HEADER_image;
          }
        }
      }

      $scope.$parent.navIcons.allHidden = true;
      $ionicSideMenuDelegate.toggleRight();
      $scope.$parent.navTitle = 'Listing Details';
    };

    /*  NUMPAD STUFF */
    // PIN will probably be scrubbed from first release
    $ionicModal.fromTemplateUrl('templates/modal/numpadModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
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

    $scope.checkUploadedImage = function(){
      return $scope.filmstrip_images.length === 0 ? false : true;
    }

    // Select images from camera roll
    $scope.uploadImages = function() {

      if ($scope.filmstrip_images.length !== 0){
        return;
      }

      if (typeof cordova !== 'undefined') {
        cordova.plugins.Keyboard.close();
      }

      if (typeof window.plugins === 'undefined') {
        $scope.modal.hide().then(function() {
          $ionicPopup.show({
            template: 'Not support in this browser.',
            cssClass: 'invalid-popup',
            title: 'Failed!',
            scope: $scope,
            buttons: [
              {
                text: 'OK',
                onTap: function(e) {
                  return;
                }
              }
            ]
          });
        });
        return;
      }
      window.plugins.imagePicker.getPictures(
        function(results) {
            for (var i = 0; i < results.length; i++) {
                console.log('Image URI: ' + results[i]);
                $scope.filmstrip_images.push(results[i]);
            }
            if(!$scope.$$phase) {
                $scope.$apply();
            }
        }, function (error) {
            console.log('Error: ' + error);
        },{
           maximumImagesCount: 10,
           width: 0,
           height: 200,
           quality: 80
        }
      );
    };

    // To be offloaded to a currentProductService
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
            $ionicLoading.show({ template: 'Loading'});
            if ($scope.filmstrip_images.length === 0) {
              createProduct();
            }else{
              for (var i = $scope.filmstrip_images.length - 1; i >= 0; i--) {
                ImageProcessService.convertImgToBase64URL($scope.filmstrip_images[i], checkConvertImage, 'image/png');
              }
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
    
    function checkConvertImage(dataURL){

      var mfile = ImageProcessService.dataURItoFile(dataURL);
      $scope.currentProduct.images.push(mfile);
      if ($scope.currentProduct.images.length != $scope.filmstrip_images.length) {
        return;
      }
      $ionicLoading.hide();
      // Create product
      createProduct();
    };

    function createProduct()
    {
      $ionicLoading.show({ template: 'Loading'});
      // Create product
      ProductService.createProduct($scope.currentProduct).then(
        function(response){
          $ionicLoading.hide();
          console.log('----- Success creating current product -----');
          console.log(response.data);

          $scope.product_id = response.data.id;
          addFlagToProduct();
        }, 
        function(response){
          $ionicLoading.hide();
          console.log('----- Failed creating current product -----');
          console.log(response);
        });
    }

    function addFlagToProduct()
    {
      $ionicLoading.show({ template: 'Loading'});
      // Add onsale flag to current product
      ProductService.addFlagToProduct($scope.product_id, CONSTANTS.FLAG_IDENTIFIERS.ONSALE).then(
        function(countriesRes){
          $ionicLoading.hide();
          console.log('----- Success adding onsale flag to current product -----');
          console.log(countriesRes.data);
          
          $scope.modal.hide().then(function() {
            $ionicPopup.show({
              template: 'Your Listing has been created and successfully posted to the Marketplace.',
              cssClass: 'thankYou-popup',
              title: 'Thank You',
              scope: $scope,
              buttons: [
                {
                  text: 'View Item',
                  onTap: function(e) {
                    $ionicSideMenuDelegate.toggleRight();
                    $scope.$parent.navTitle = "";
                    $scope.$parent.navIcons.allHidden = false;

                    $state.go('app.market', {category_id: 1, subcategory: 0, action: $scope.currentProduct.type});
                  }
                },
                {
                  text: 'Close',
                  onTap: function(e) {
                    $ionicSideMenuDelegate.toggleRight();
                    $scope.$parent.toggleHomeIcons();
                    $state.go('app.home');
                  }
                }
              ]
            });
          });
        }, 
        function(response){
          $ionicLoading.hide();
          console.log('----- Failed adding onsale flag to current product -----');
          console.log(response);
          if (response.status == 0) {
            $scope.$parent.retryForTimeout(addFlagToProduct);
          }
        });
    }

  });

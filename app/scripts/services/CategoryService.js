'use strict';

/**
 * @ngdoc function
 * @name Oss.service:CategoryService
 * @description
 * # CategoryService
 */
angular.module('Oss')
  // use factory for services
  .factory('CategoryService', function($http, $timeout, $q, ApiService, CONSTANTS, LoginService) {

    var mainCategories = null;
    var allCategories = null;

    //Get all main categories with rest token
    var getMainCategories = function() {
      //http://ossapi.dev.kpd-i.com/api/v1/category/main
      var _url = ApiService.getEndpoint() + CONSTANTS.API_CATEGORY_MAIN;
      return $http({
          url: _url,
          params: {
              _rest_token: LoginService.getRestToken()
          },
          timeout: CONSTANTS.TIMEOUT_VALUE,
          method: 'GET'
        })
        .success(function(data) {
          mainCategories = data;
        })
        .error(function(error) {
        });
    };

    //Get all categories with rest token
    var getAllCategories = function() {
      //http://ossapi.dev.kpd-i.com/api/v1/category
      var _url = ApiService.getEndpoint() + CONSTANTS.API_CATEGORY;
      return $http({
          url: _url,
          params: {
              _rest_token: LoginService.getRestToken()
          },
          timeout: CONSTANTS.TIMEOUT_VALUE,
          method: 'GET'
        })
        .success(function(data) {
          allCategories = data;
        })
        .error(function(error) {
        });
    };

    //Get subcategory by parent_id
    var getSubcategoryByParentID = function(parent_id) {
      //http://ossapi.dev.kpd-i.com/api/v1/category/{parent_id}"
      var _url = ApiService.getEndpoint() + CONSTANTS.API_CATEGORY +'/'+ parent_id;
      return $http({
          url: _url,
          params: {
              _rest_token: LoginService.getRestToken()
          },
          timeout: CONSTANTS.TIMEOUT_VALUE,
          method: 'GET'
        })
        .success(function(data) {
        })
        .error(function(error) {
        });
    };

    var convertMainImageURL = function()
    {
      var returnData = [];
      for (var i = 0; i < mainCategories.length; i++)
      {
        var category = mainCategories[i];

        category[CONSTANTS.CATEGORY_IMAGE_TYPE.BUY + '_image'] = 'images/pangolin.png';
        category[CONSTANTS.CATEGORY_IMAGE_TYPE.SELL + '_image'] = 'images/pangolin.png';
        category[CONSTANTS.CATEGORY_IMAGE_TYPE.LISTING + '_image'] = 'images/pangolin.png';
        category[CONSTANTS.CATEGORY_IMAGE_TYPE.HEADER + '_image'] = 'images/pangolin.png';

        for (var j = category.category_images.length - 1; j >= 0; j--)
        {
          var image = category.category_images[j];
          category[image.types + '_image'] = image.path;
        }
        returnData.push(category);
      }
      mainCategories = returnData;
      return returnData;
    }

    var convertAllImageURL = function()
    {
      var returnData = [];
      for (var i = 0; i < allCategories.length; i++)
      {
        var category = allCategories[i];

        category[CONSTANTS.CATEGORY_IMAGE_TYPE.BUY + '_image'] = 'images/pangolin.png';
        category[CONSTANTS.CATEGORY_IMAGE_TYPE.SELL + '_image'] = 'images/pangolin.png';
        category[CONSTANTS.CATEGORY_IMAGE_TYPE.LISTING + '_image'] = 'images/pangolin.png';
        category[CONSTANTS.CATEGORY_IMAGE_TYPE.HEADER + '_image'] = 'images/pangolin.png';

        if (category.parent_id == null || category.parent_id == 1) {
          for (var j = category.category_images.length - 1; j >= 0; j--)
          {
            var image = category.category_images[j];
            category[image.types + '_image'] = image.path;
          }
          returnData.push(category);
          continue;
        }



        for (var j = mainCategories.length - 1; j >= 0; j--)
        {
          var mainCategory = mainCategories[j];
          if (category.parent_id == mainCategory.id) {

            var imgs = {};
            for ( var k = 0; k < category.category_images.length; k++)
            {
              imgs[category.category_images[k].types] = category.category_images[k].path;
            }

            if (!imgs[CONSTANTS.CATEGORY_IMAGE_TYPE.BUY])
              category[CONSTANTS.CATEGORY_IMAGE_TYPE.BUY + '_image'] = mainCategory[CONSTANTS.CATEGORY_IMAGE_TYPE.BUY + '_image'];
            else
              category[CONSTANTS.CATEGORY_IMAGE_TYPE.BUY + '_image'] = imgs[CONSTANTS.CATEGORY_IMAGE_TYPE.BUY];

            if (!imgs[CONSTANTS.CATEGORY_IMAGE_TYPE.SELL])
              category[CONSTANTS.CATEGORY_IMAGE_TYPE.SELL + '_image'] = mainCategory[CONSTANTS.CATEGORY_IMAGE_TYPE.SELL + '_image'];
            else
              category[CONSTANTS.CATEGORY_IMAGE_TYPE.SELL + '_image'] = imgs[CONSTANTS.CATEGORY_IMAGE_TYPE.SELL];

            if (!imgs[CONSTANTS.CATEGORY_IMAGE_TYPE.LISTING])
              category[CONSTANTS.CATEGORY_IMAGE_TYPE.LISTING + '_image'] = mainCategory[CONSTANTS.CATEGORY_IMAGE_TYPE.LISTING + '_image'];
            else
              category[CONSTANTS.CATEGORY_IMAGE_TYPE.LISTING + '_image'] = imgs[CONSTANTS.CATEGORY_IMAGE_TYPE.LISTING];

            if (!imgs[CONSTANTS.CATEGORY_IMAGE_TYPE.HEADER])
              category[CONSTANTS.CATEGORY_IMAGE_TYPE.HEADER + '_image'] = mainCategory[CONSTANTS.CATEGORY_IMAGE_TYPE.HEADER + '_image'];
            else
              category[CONSTANTS.CATEGORY_IMAGE_TYPE.HEADER + '_image'] = imgs[CONSTANTS.CATEGORY_IMAGE_TYPE.HEADER];
          }
        }
        returnData.push(category);
      }

      console.log(returnData);

      return returnData;
    }

    // public api
    return {
      getAllCategories:         getAllCategories,
      getMainCategories:        getMainCategories,
      getSubcategoryByParentID: getSubcategoryByParentID,

      convertMainImageURL:      convertMainImageURL,
      convertAllImageURL:       convertAllImageURL
    };
  });

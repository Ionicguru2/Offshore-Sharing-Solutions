'use strict';

/**
 * @ngdoc function
 * @name Oss.service:ProductService
 * @description
 * # ProductService
 */
angular.module('Oss')
  // use factory for services
  .factory('ProductService', function($http, $timeout, $q, ApiService, CONSTANTS, LoginService, Upload, CategoryService) {

    var m_products = null;
    //Get all products with rest token & permission (Not available)
    var getAllProducts = function() {
      //http://ossapi.dev.kpd-i.com/api/v1/product
      var _url = ApiService.getEndpoint() + CONSTANTS.API_PRODUCT_ALL;
      return $http({
          url: _url,
          params: {
              _rest_token: LoginService.getRestToken()
          },
          timeout: CONSTANTS.TIMEOUT_VALUE,
          method: 'GET'
        })
        .success(function(data) { 
          m_products = data;

          convertToUIData(CategoryService.convertAllImageURL());
        })
        .error(function(error) { 
        });
    };

    //Get product by id
    var getProductByID = function(id) {
      //http://ossapi.dev.kpd-i.com/api/v1/product/{id}"
      var _url = ApiService.getEndpoint() + CONSTANTS.API_PRODUCT +'/'+ id;
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

    //Create product
    var createProduct = function(data) {
      //http://ossapi.dev.kpd-i.com/api/v1/product/create"
      var _url = ApiService.getEndpoint() + CONSTANTS.API_PRODUCT_CREATE;
      var data = {
              _rest_token:      LoginService.getRestToken(),
              title:            data.title,
              type:             data.type,
              sku:              data.sku,
              details:          data.details,
              price:            data.price,
              available_from:   data.available_from,
              available_to:     data.available_to,
              category_id:      data.sub_category_id ? data.sub_category_id : data.category_id,
              country_id:       data.country_id,
              _meta_quantity:   data.quantity,
              _meta_seats:      data.seats,
              'images':       data.images
          };
      return Upload.upload({
        url: _url,
        data: data
      });
    };

    //Add flag to spcific product
    var addFlagToProduct = function(productID, identifier) {
      //http://ossapi.dev.kpd-i.com/api/v1/product/{productID}/flag/{identifier}/add"
      var _url = ApiService.getEndpoint() + CONSTANTS.API_PRODUCT +'/'+ productID + '/flag/' + identifier + '/add';
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

    //Remove flag from spcific product
    var removeFlagFromProduct = function(productID, identifier) {
      //http://ossapi.dev.kpd-i.com/api/v1/product/{id}/flag/{identifier}/remove"
      var _url = ApiService.getEndpoint() + CONSTANTS.API_PRODUCT +'/'+ id + '/flag/' + identifier + '/remove';
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

    //Convert backend data to available UI data
    var convertToUIData = function(categories) {
      var returnProducts = [];
      for (var i = m_products.length - 1; i >= 0; i--) {
        var rowProduct = m_products[i];

        var before = moment(rowProduct.available_from, 'YYYY-MM-DD');
        var after = moment(rowProduct.available_to, 'YYYY-MM-DD');
        rowProduct['days'] = after.diff(before, 'days');  

        for (var j = categories.length - 1; j >= 0; j--) {
          var category = categories[j];
          if (rowProduct.category_id === category.id) {
            rowProduct[CONSTANTS.CATEGORY_IMAGE_TYPE.BUY + '_image'] = category[CONSTANTS.CATEGORY_IMAGE_TYPE.BUY + '_image'];
            rowProduct[CONSTANTS.CATEGORY_IMAGE_TYPE.SELL + '_image'] = category[CONSTANTS.CATEGORY_IMAGE_TYPE.SELL + '_image'];
            rowProduct[CONSTANTS.CATEGORY_IMAGE_TYPE.LISTING + '_image'] = category[CONSTANTS.CATEGORY_IMAGE_TYPE.LISTING + '_image'];
            rowProduct[CONSTANTS.CATEGORY_IMAGE_TYPE.HEADER + '_image'] = category[CONSTANTS.CATEGORY_IMAGE_TYPE.HEADER + '_image'];
          }
        }

        // Get seats & quantity data from Meta data
        for (var j = rowProduct.meta.length - 1; j >= 0; j--) {
          var metaData = rowProduct.meta[j];
          if (metaData.key === '_meta_seats'){
            rowProduct['seats'] = metaData.value;
          }
          switch (metaData.key){
            case CONSTANTS.META_KEYS.SEATS:
              rowProduct['seats'] = metaData.value;
              break;
            case CONSTANTS.META_KEYS.QUANTITY:
              rowProduct['quantity'] = metaData.value;
              break;
            default:
              break;
          }
        }
        // Get flags
        var flags = {};
        for (var j = rowProduct.flags.length - 1; j >= 0; j--) {
          var flag = rowProduct.flags[j];
          switch (flag.identifier){
            case CONSTANTS.FLAG_IDENTIFIERS.ONSALE:
              flags[CONSTANTS.FLAG_IDENTIFIERS.ONSALE] = true;
              break;
            case CONSTANTS.FLAG_IDENTIFIERS.OFFER_SPENDING:
              flags[CONSTANTS.FLAG_IDENTIFIERS.OFFER_SPENDING] = true;
              break;
            case CONSTANTS.FLAG_IDENTIFIERS.PRICE_NEGOTIABLE:
              flags[CONSTANTS.FLAG_IDENTIFIERS.PRICE_NEGOTIABLE] = true;
              break;
            case CONSTANTS.FLAG_IDENTIFIERS.EXPIRING_SOON:
              flags[CONSTANTS.FLAG_IDENTIFIERS.EXPIRING_SOON] = true;
              break;
            case CONSTANTS.FLAG_IDENTIFIERS.DISCOUNTED:
              flags[CONSTANTS.FLAG_IDENTIFIERS.DISCOUNTED] = true;
              break;
            default:
              break;
          }
        }

        rowProduct.flags = flags;

        returnProducts.push(rowProduct);
      }

      m_products = returnProducts;
      return returnProducts;
    };

    //Convert detail data to available UI data
    var convertDetailToUIData = function(product_id) {

      for (var i = m_products.length - 1; i >= 0; i--) {
        var product = m_products[i];
        if (product.id == product_id) {
          return product;
        }
      }
      return null;
    };

    // public api
    return {
      getAllProducts:         getAllProducts,
      getProductByID:         getProductByID,
      createProduct:          createProduct,
      addFlagToProduct:       addFlagToProduct,
      removeFlagFromProduct: removeFlagFromProduct,

      convertToUIData:        convertToUIData,
      convertDetailToUIData:  convertDetailToUIData
    };
  });


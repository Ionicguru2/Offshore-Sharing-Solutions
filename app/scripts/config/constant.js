'use strict';

/**
 * @ngdoc constant
 * @name Oss.CONSTNATS
 * @description
 * # CONSTNATS
 * Defines the API endpoint where our resources will make requests against.
 * Is used inside /services/PostController.js to generate correct endpoint dynamically
 */


angular.module('Oss')

  // development
  .constant('CONSTANTS', {
    TIMEOUT_VALUE:  17000,
    POST_TYPE: {
        BUY: 'buy',
        SELL: 'sell',
        NONE: null
    },
    OFFER_TYPE: {
        OFFER:          'offer',
        TRANSACTION:    'transaction'
    },
    TRANSACTION_TYPE:   {
        ONGOING:    'Ongoing',
        UPCOMING:   'Upcoming'
    },
    REPORT_TYPE: {
        SPAM:     1,
        BROKEN:   2,
        FEEDBACK: 3,
    },
    FLAG_IDENTIFIERS: {
        ONSALE:             'onsale',
        OFFER_SPENDING:     'offerspending',
        PRICE_NEGOTIABLE:   'price_negotiable',
        EXPIRING_SOON:      'expiring_soon',
        DISCOUNTED:         'discounted',
    },
    META_KEYS: {
        SEATS:              '_meta_seats',
        QUANTITY:           '_meta_quantity',
    },

    //Api Url
    API_USER:               'user',
    API_LOGIN:              'user/login',
    API_LOGOUT:             'user/logout',

    API_REGION:             'region',
    API_REGION_SET:         'region/set',

    API_COUNTRY:            'countries',

    API_CATEGORY:           'category',
    API_CATEGORY_MAIN:      'category/main',

    API_PRODUCT:            'product',
    API_PRODUCT_ALL:        'product',
    API_PRODUCT_CREATE:     'product/create',

    API_OFFER:              'offer',
    API_OFFER_CREATE:       'offer/create',
    API_OFFER_DENY:         'offer/deny',
    API_OFFER_APPROVE:      'offer/approve',

    API_ALERT:              'alert',

    API_TRANSACTION:        'transaction',
    API_REQUEST_VALIDATION: 'transaction/require_validation',

    API_RATING:             'rate',

    API_REPORT:             'report',
    API_REPORT_CREATE:      'report/create',

    API_NOTIFICATION:       'notificationsettings',
    API_PUSH_REGISTER:       'user/push_register',

    API_CONTRACT:           'contract/tree',



    //Template model
    MODEL_CATEGORY_SELECTOR:      '<ion-radio ng-model="currentProduct.category_id" ng-repeat="category in categories" value="{{category.id}}" ng-if="category.id!=1" >{{category.name}}</ion-radio>',
    MODEL_SUBCATEGORY_SELECTOR:   '<ion-radio ng-model="currentProduct.sub_category_id" ng-repeat="subcategories in allcategories" value="{{subcategories.id}}" ng-if="subcategories.parent_id==currentProduct.category_id" >{{subcategories.name}}</ion-radio>',
    MODEL_COUNTRY_SELECTOR:       '<ion-radio ng-model="currentProduct.country_id" ng-repeat="country in countries" value="{{country.id}}" ng-if="country.region_id==currentProduct.region_id" >{{country.name}}</ion-radio>',
    MODEL_REGION_SELECTOR:        '<ion-radio ng-model="currentProduct.region_id" ng-repeat="region in regions" value="{{region.id}}" ng-if="$index!=0 && region.name != regions.length" >{{region.name}}</ion-radio>',

    MODEL_RATING:     '<div class="star-rating" star-rating rating-value="rating" data-max="5" on-rating-selected="rateFunction(rating)"></div>'+
                      '<div class="poor-rating">POOR</div>'+
                      '<div class="great-rating">GREAT</div>'+
                      '<div class="average-rating">AVERAGE</div>',

    CATEGORY_IMAGE_TYPE:  {
      BUY:      'BUY',
      SELL:     'SELL',
      LISTING:  'LISTING',
      HEADER:   'HEADER'
    }
  });

'use strict';

/**
 * @ngdoc function
 * @name Oss.controller:SearchController
 * @description
 * # SearchController
 */

angular.module('Oss')
.controller('SearchController', function($scope, $state, $ionicPlatform, $ionicScrollDelegate) {

  // This functionality is not wanted by the client.
  // Instead, they would like for the top tab-nav to be fixed position while the user scrolls down.
  $scope.getScrollPosition = function(){
    var pos = $ionicScrollDelegate.getScrollPosition().top;
    if (pos >= 120) { $scope.$apply(function() {
      $scope.showTopArrow = true;
    }); }
    else { $scope.$apply(function() {
      $scope.showTopArrow = false;
    });  }
  };

  // To be dynamically pulled from the API
  $scope.activities = [
      {
        id: '671123',
        title: '40 foot Truck & Trailer from POS to Galeota Port (One way)',
        shortDescription: 'string',
        category: 'TRUCKS',
        price: '200.00',
        flags: {
          ongoing: true,
          upcoming: false
        }
      }
    ];
  $scope.marketItems = {
    buyItems: [
      {
        id: '100092',
        title: 'Specialised Directional Driller available 3 months from April 11th',
          category: 'SPARE LABOUR RESOURCES',
          subcategory: 'SPARE LABOUR RESOURCES',
        quantity: '05',
        available: '11th April 2016',
        shortDescription: 'string',
        longDescription: 'Directional Driller available 5 days from April 11th',
        flags: {
          onsale: false,
          offerspending: true,
          finalday: false,
          urgent: false
        },
        price: '96,000.00'
      },
      {
        id: '554212',
        title: '100 joints Casing pipe N80 API 5ct 20in. 508mm steel for sale Trinidad',
          category: 'INVENTORY',
          subcategory: 'CASING',
          quantity: '07',
          available: '13th April 2016',
        shortDescription: '',
        longDescription: "Standard:  API, API 5CT, API 5L Grade:  10#-45#, 16Mn, 20#, 45#, 16MnThickness:  <br>3 - 22 mmSection Shape:  <br>RoundOuter Diameter:  4.5 - 22 inch<br>Place of Origin:  Sichuan, China (Mainland)<br>Secondary Or Not:  Non-secondary<br>Application:  Boiler Pipe<br>Technique:  Cold Rolled<br>Certification: API<br>Surface Treatment:  Galvanized<br>Special Pipe:  Thick Wall Pipe<br>Alloy Or Not:  Non-alloy<br>item:  casing pipe N80 API 5ct 20' 508mm steel pipe<br>Brand Name:  Derbo<br>Technics:  Forged<br>Material:  Carbon Steel<br>Shape:  Equal",
        flags: {
          onsale: true,
          offerspending: true,
          finalday: true,
          urgent: true
        },
        price: '80,000.00'
      },
      {
        id: '534121',
        title: '50% Deck Space on 160 ft. PSV DP2 Available 10 days in April 2016 Louisiana Port Fourchon',
          category: 'VESSEL',
          subcategory: 'PSV',
          quantity: '10',
          available: '19th April 2016',
        shortDescription: '',
        longDescription: 'OCEAN VIKING <br>LENGTH OVERALL 160 ft <br>   DRILL WATER  400 USG/min @ 80 ft 91 m³/Hr @ 24 m <br>BEAM 36 ft 11 m  <br>POTABLE WATER  400 USG/min @ 80 ft 91 m³/Hr @ 24 m <br> DEPTH 12 ft 4 m  FUEL OIL  400 USG/min @ 80 ft 91 m³/Hr @ 24 m <br> LIGHT DRAFT 8 ft 2 m  LIQUID MUD  700 USG/min @ 150 ft 159 m³/Hr @ 46 m <br> LOADED DRAFT 10 ft 3 m     <br> DRILL/POTABLE WATER 81,000 USG 290 m³  CREW 2  <br> FUEL 51,000 USG 152 m³  LOUNGE 10  <br> LIQUID MUD 1,300 BBLS 300 m³  MESS 10  <br> POTABLE WATER 23,500 USG 68 m³     <br>',
        flags: {
          onsale: false,
          offerspending: true,
          finalday: false,
          urgent: false
        },
        price: '50,000.00'
      }
      //etc - continued for as many buyItems as desired
    ],
    sellItems: [
      {
        id: '299012',
        title: 'Large Warehouse available near Aberdeen Harbour for 3 months ',
          category: 'PIPE YARD',
          subcategory: 'PIPE YARD',
          quantity: '90',
          available: '1st May 2016',
        shortDescription: '',
        longDescription: 'a. Large Warehouse available near Aberdeen Harbour for 3 months <br> b. Description: Large Warehouse Available for 3 months<br>Suitable for storing large inventory items, Equipment Storage or drilling and production supplies<br>15 minutes away from Aberdeen Harbour<br>Dimensions: 300ft x 250ft  <br>c. Price: $22,500 per month / $67,500 Total',
        flags: {
          onsale: false,
          offerspending: true,
          finalday: false,
          urgent: false
        },
        price: '67,500.00'
      },
      {
        id: '000993',
        title: '94 meter ROVSupport Vessel DP2 (built 2010) Available 10 days April 25th Aberdeen Port',
          category: 'VESSEL',
          subcategory: 'ROV',
          quantity: '11',
          available: '25th April 2016',
        shortDescription: '',
        longDescription: 'Deck machinery: To prevent oilspill, all mooring equipment is of electrical type. Two off Mooring winches aft, 10 tonnes each Two off Windlass with cable lifters, warping ends and drums <br> Deck Crane: Two off Deck/provision crane: 5.0 T - 15 m <br> Offshore Crane: SWL 100 mt. SWL 250 tons main line - 15 m AHC Whip line SWL 15.0 T - 33 m Knuckle boom offshore crane. Depth cap. 2000 m Man riding 1.0 mt. Man riding 10t/40 m on whipline <br>Moonpool: The vessel is fitted with a work moonpool of 6.0 x 5.28 m. The moonpool to be fitted with baffle zones in order to get optimized sea damping capability. <br>Data cabling for IT hardwire Telephone, video signals, intercom and P/A Fire loop Sea water cooling',
        flags: {
          onsale: false,
          offerspending: false,
          finalday: false,
          urgent: false
        },
        price: '150,000.00'
      },
      {
        id: '223996',
        title: '125 Meter Pipe Laying Vessel Skandi Nitero available May 1st  15 days Trinidad Chaguramas ',
          category: 'VESSEL',
          subcategory: 'PIPELAYING',
          quantity: '15',
          available: '1st May 2016',
        shortDescription: '',
        longDescription: '125 Meter Built 2010.Equipped with a vertical and horizontal pipelay system, an under-deck carousel for storing 2,000 Te of product, and reels for 1,400 Te product. She also has two work-class ROVs, and a 250 Te active-heave compensated crane. The Skandi Niteroi is designed for pipelay, subsea construction, installation and maintenance work and can operate in water depths reaching 2,300 m.',
        flags: {
          onsale: false,
          offerspending: false,
          finalday: false,
          urgent: false
        },
        price: '300,000.00'
      },
        //etc - continued for as many sellItems as desired
    ],
  };
  $scope.messages = [
    {
      title: '5843744569-TT',
      contents: 'Hi can you advised if this vessel can be available for 6 days rather than 5? Once third party inspections are completed we...'
    }
  ];

  $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop(true);
  }

})

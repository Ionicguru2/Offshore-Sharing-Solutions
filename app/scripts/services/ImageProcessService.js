'use strict';

/**
 * @ngdoc function
 * @name Oss.service:ImageProcessService
 * @description
 * # ImageProcessService
 */
angular.module('Oss')
  // use factory for services
  .factory('ImageProcessService', function($http, $timeout, $q) {

    //Convert image to Base64 data
    var convertImgToBase64URL = function(url, callback, outputFormat) {
      var img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function(){
          var canvas = document.createElement('CANVAS'),
          ctx = canvas.getContext('2d'), dataURL;
          canvas.height = this.height;
          canvas.width = this.width;
          ctx.drawImage(this, 0, 0);
          dataURL = canvas.toDataURL(outputFormat);
          callback(dataURL);
          canvas = null; 
      };
      img.src = url;
    };

    //Convert Base64 data to Blob
    var dataURItoBlob = function(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0){
          byteString = atob(dataURI.split(',')[1]);
      } else {
          byteString = unescape(dataURI.split(',')[1]);
      }
      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], {type:mimeString});
    };

    //Convert Blob to File
    var blobToFile = function(blob) {
      //A Blob() is almost a File() - it's just missing the two properties below which we will add
      blob.lastModifiedDate = new Date();
      blob.name = 'product_image.png';
      return blob;
    };

    //Convert Base64 data to File
    var dataURItoFile = function(dataURI) {
      var blob = dataURItoBlob(dataURI);
      var file = blobToFile(blob);
      return file
    };

    // public api
    return {
      convertImgToBase64URL:  convertImgToBase64URL,
      dataURItoFile:          dataURItoFile,
    };
  });


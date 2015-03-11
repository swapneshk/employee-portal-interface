angular.module("app", ["ngResource", "ngRoute", "angularMoment", "angularFileUpload", "multi-select"]).run(function($rootScope) {
  
  // adds some basic utilities to the $rootScope for debugging purposes
  $rootScope.log = function(thing) {
    console.log(thing);
  };

  $rootScope.alert = function(thing) {
    alert(thing);
  };
});


angular.module('app').constant('angularMomentConfig', {
    preprocess: 'unix',
    timezone: 'America/Phoenix'
});
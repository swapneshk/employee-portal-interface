angular.module("app").factory("UserService", function($http, $q, User,$location) {

  return {
    updateUser: function (user) {
      var defer = $q.defer();

      $http.put("/api/users", user).then(function( response ) {
        console.log(response);
        if (response.data.success) {
          defer.resolve(true);
        } else {
          defer.resolve(false);
        }
      });
      return defer.promise;
    }
  };
  
});
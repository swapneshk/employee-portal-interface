angular.module("app").factory("AuthenticationService", function($http, SessionService, $q, User) {

  return {
    authenticateUser: function (credentials) {
      var defer = $q.defer();

      $http.post("/login", { email: credentials.email, password: credentials.password }).then(function( response ) {
        if (response.data.success) {
          var user = new User();
          angular.extend(user, response.data.user);
          SessionService.storeUser(user);
          defer.resolve(true);
        } else {
          defer.resolve(false);
        }
      });
      return defer.promise;
    },

    logoutUser: function() {
      var defer = $q.defer();

      $http.post("/logout", { logout: true }).then(function() {
        SessionService.currentUser = undefined;
        SessionService.unset("user");
        defer.resolve();
      });
      return defer.promise;
    },

    authorizeCurrentUserForRoute: function( role ) {
      if (SessionService.isAuthorized(role) === true) {
        return true;
      } else {
        return $q.reject("Not Authorized");
      }
    },

    authorizeAuthenticatedUserForRoute: function() {
      if (SessionService.isAuthenticated()) {
        return true;
      } else {
        return $q.reject("Not Authorized");
      }
    },

    createUser: function( newUser ) {
      var user = new User(newUser);
      var defer = $q.defer();

      user.$save().then(function() {
        SessionService.storeUser(user);
        defer.resolve();
      }, function(response) {
        defer.reject(response.data.reason);
      });

      return defer.promise;
    },

    updateUser: function( userData ) {
      var defer = $q.defer();

      var clone = angular.copy(SessionService.currentUser);
      angular.extend(clone, userData);
      clone.$update().then(function() {
        SessionService.storeUser(clone);
        defer.resolve();
      }, function(response) {
        defer.reject(response.data.reason);
      });

      return defer.promise;
    }


  };
});
angular.module("app").factory("SessionService", function($window, User) {

  var currentUser;
  var session = {

    isAuthenticated: function() {
      return !!this.currentUser;
    },

    isAuthorized: function( role ) {
      return !!this.currentUser && (this.currentUser.roles.indexOf(role) > -1 || this.currentUser.roles.indexOf("admin") > -1);
    },

    get: function(key) {
      return sessionStorage.getItem(key);
    },
    set: function(key, val) {
      return sessionStorage.setItem(key, val);
    },
    unset: function(key) {
      return sessionStorage.removeItem(key);
    }

  };

  session.storeUser = function(user) {
    this.currentUser = user;
    this.set("user", JSON.stringify(user));
  };

  if (!!session.get("user")) {
    currentUser = new User();
    angular.extend(currentUser, JSON.parse(session.get("user")));
  }

  session.currentUser = currentUser;

  return session;
});
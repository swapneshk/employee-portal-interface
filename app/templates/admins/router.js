angular.module("app").config(function($routeProvider, $locationProvider, $httpProvider) {

  var interceptor = function($rootScope, $q) {

    function success(response) {
      return response;
    }

    function error(response) {
      if (!response.headers("authenticated user")) {
        var deferred = $q.defer();
        $rootScope.$broadcast('event:auth-loginRequired', response);
        return deferred.promise;
      }
      // otherwise, default behaviour
      return $q.reject(response);
    }

    return function(promise) {
      return promise.then(success, error);
    };
  };
  $httpProvider.responseInterceptors.push(interceptor);

  var routeRoleChecks = {
    admin: {
        auth: function(AuthenticationService) {
          return AuthenticationService.authorizeCurrentUserForRoute("admin");
        }
      },
    manager: {
        auth: function(AuthenticationService) {
          return AuthenticationService.authorizeCurrentUserForRoute("manager");
        }
      },
    user: {
        auth: function(AuthenticationService) {
          return AuthenticationService.authorizeAuthenticatedUserForRoute();
        }
      }
  };

  $locationProvider.html5Mode(true);
  $routeProvider
    .when("/login", {
      template: JST["app/templates/login"],
      controller: "LoginController"
    })
    .when("/dashboard", {
      template: JST["app/templates/dashboard"],
      controller: "DashboardController"
    })
    .when("/users", {
      template: JST["app/templates/users/list"],
      controller: "UserListController",
      resolve: routeRoleChecks.admin
    })
    .when("/users/:id", {
      template: JST["app/templates/users/profile"],
      controller: "UserController",
      resolve: routeRoleChecks.user
    })
    .when("/users/:id/edit", {
      template: JST["app/templates/users/form"],
      controller: "UserController",
      resolve: routeRoleChecks.user
    })
    .when("/forgetpassword", {
      template: JST["app/templates/forgetpassword"],
      controller: "ForgetController"
    }).
    when("/adminprofile", {
      template: JST["app/templates/admins/adminprofile"],
      controller: "ForgetController"
    }).
when("/managerprofile", {
      template: JST["app/templates/managers/managerprofile"],
      controller: "ForgetController"
    }).
when("/employeeprofile", {
      template: JST["app/templates/employees/employeeprofile"],
      controller: "ForgetController"
    })
    .otherwise({ redirectTo: "/" });

});

angular.module("app").run(function($rootScope, $location, NotificationService) {
  $rootScope.$on("$routeChangeError", function(event, current, previous, rejection) {
    console.log("----TST----");
    if (rejection === "Not Authorized") {
      NotificationService.notify("You have authorization to view that content.");
      $location.path("/");
    }
  });
});


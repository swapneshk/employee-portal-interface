angular.module("app").controller("LoginController", function($scope, AuthenticationService, NotificationService, $location) {
  $scope.credentials = { email: "", password: "" };

  $scope.login = function() {
    AuthenticationService.authenticateUser($scope.credentials).then(function(success) {
      if (success) {
        NotificationService.notify("Yay! You logged in!");
        $location.path("/dashboard");
      } else {
        NotificationService.notify("Still, got the wrong creds...", "error");
      }
    });
  };

});
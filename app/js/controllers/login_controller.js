angular.module("app").controller("LoginController", function($scope, AuthenticationService, NotificationService, SessionService, $location, $window) {
  $scope.credentials = { email: "", password: "" };

  $scope.login = function() {
    AuthenticationService.authenticateUser($scope.credentials).then(function(success) {
      if (success) {
        if(SessionService.currentUser.active === false){
          NotificationService.notify("Please contact administrator.", "warning");
        }
        else{
        NotificationService.notify("Yay! You logged in!");
        //$location.path("/dashboard");
        $window.location.href = "/dashboard?loggedin=true";
        }
      } else {
        NotificationService.notify("Still, got the wrong creds...", "error");
      }
    });
  };

});
angular.module("app").controller("MainController", function($scope, SessionService, AuthenticationService, $location, NotificationService) {

  // when the script starts
  $scope.script_start = new Date();

  $scope.session = SessionService;

  // store all the dynamic placeholder data for the application
  $scope.placeholder = {
    dob: moment().subtract('years', 18).calendar()
  };

  $scope.$on('event:auth-loginRequired', function() {
    AuthenticationService.logoutUser().then(function() {
      $scope.email    = "";
      $scope.password = "";
      NotificationService.notify("Your session has expired.");
      $location.path("/login");
    });
  });

  $scope.logout = function() {
    AuthenticationService.logoutUser().then(function() {
      $scope.email    = "";
      $scope.password = "";
      NotificationService.notify("You have successfully logged out.");
      $location.path("/login");
    });
  };

});
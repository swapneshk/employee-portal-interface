angular.module("app").controller("LogoutController", function($scope, NotificationService, SessionService, $location, $window, $http) {

  $scope.logout = function() {
    //$window.location.href = "/login";
    $http.post('/api/logout', {loggedid:SessionService.currentUser._id}).then(function(checkloggedoutresponse){
        SessionService.unset("user");
        NotificationService.notify("Logged out successfully", "success");
        $location.path('/login');
    });
  };

});
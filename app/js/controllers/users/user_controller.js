angular.module("app").controller("UserController", function($scope, $routeParams, User, $location) {

  $scope.user = User.get({ id: $routeParams.id });

  $scope.cancel = function() {
    $location.path('/users/' + $routeParams.id );
  };

  $scope.showEditForm = function() {
    $location.path('/users/' + $routeParams.id + '/edit');
  };

  $scope.isCurrentUser = function() {
    return $scope.session.currentUser._id === $routeParams.id;
  };
});
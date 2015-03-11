angular.module("app").controller("ViewEmployeeProfileController", function($scope, $location, SessionService, $http, UserService) {
    $scope.siteurl = $location.absUrl().split(":8000/")[0];
    $scope.tabclass = "page-profil";
    $scope.user = SessionService.currentUser;
    console.log(SessionService.currentUser);
    
    $scope.changeview = function(view){
        $location.path(view);
    };
});
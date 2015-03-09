angular.module("app").controller("ShowClientController", function($scope, SessionService, $routeParams, $http) {
    $scope.tabclass = "page-profil";
    $scope.user = SessionService.currentUser;    
    //console.log(SessionService.currentUser);
    
    $scope.clientId = $routeParams.id;
    $http.get('/api/clientbyid/' + $scope.clientId).
    success(function(response) {
      console.log("--RESPONSE");
      console.log(response);
      $scope.client = response.data;
    });
    // Get user listing
    /*
    $http.post("/api/managerclients", {manager_id: SessionService.currentUser._id}).then(function(response){
    });
    */
});
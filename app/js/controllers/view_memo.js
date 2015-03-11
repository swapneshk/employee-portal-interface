angular.module("app").controller("ViewMemoController", function($scope, $location, SessionService, $http, UserService, $routeParams) {
    
    var memoId = $routeParams.id;
    $http.get('/api/memos/'+memoId).then(function(response){
        console.clear();
        console.log("-- VIEW MEMO --");
        console.log(response.data.data);
        if( "200" === response.data.status_code ) {
            $scope.title = response.data.data.title;
            $scope.description = response.data.data.description;
            $scope.created_date = response.data.data.created_date;
            $scope.creator_name = response.data.data.creator_name;
        }
    });
});
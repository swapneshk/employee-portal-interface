// alert("1");
angular.module("app").controller("ShiftAcknowledgementController", function($scope, SessionService, $http, $routeParams,$q) {
$scope.getshiftsacknowledgement=function(){
	// alert("shiftAcknowledgement");
	 $http.get("/api/getshiftsacknowledgement").then(function(response){
	 	console.log("response");
	 	

	           $scope.data=response.data.data;
	           console.log($scope.data);
	           // console.log($scope.data[1].manager_schedule.morning_schedule_details.event.name);
	            });
	}

	$scope.getshiftsacknowledgement();
// alert("shiftAcknowledgement");
});
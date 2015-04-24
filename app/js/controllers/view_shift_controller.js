angular.module("app").controller("ViewShiftsController", function($rootScope,$scope, SessionService, $http, $routeParams,$q, sidepanelactiveService, getweekService) {
	$("#get-modal").hide();
	var $modal =$("#get-modal");
	// $scope.abc=5;
	$scope.viewshift=function(){
	 $http.get("/api/getshifts").then(function(response){
	 	console.log("response");
	 		$scope.count= 0;
	 			for(i in response.data.data)
	 			{
	 				console.log('morning_schedule'+response.data.data[i].is_morning_scheduled);
	 				if(response.data.data[i].is_morning_scheduled == true){
	 					console.log("morning case");
	 					console.log(response.data.data[i].manager_schedule.morning_schedule_details.is_approve );
	 					if(response.data.data[i].manager_schedule.morning_schedule_details.is_approve == false){
	 						$scope.count = $scope.count+1;
	 					}
	 				}	 				
	 				if(response.data.data[i].is_afternoon_scheduled == true){
	 					console.log("aftrnoon case");
	 					if(response.data.data[i].manager_schedule.afternoon_schedule_details.is_approve == false){
	 						console.log(response.data.data[i].manager_schedule.afternoon_schedule_details.is_approve);
	 						$scope.count = $scope.count+1;
	 					}
	 				}
	 				if(response.data.data[i].is_night_scheduled == true){
	 					console.log("nyt case");
	 					if(response.data.data[i].manager_schedule.night_schedule_details.is_approve != true){
	 						console.log(response.data.data[i].manager_schedule.night_schedule_details.is_approve);
	 						$scope.count = $scope.count+1;
	 					}
	 				}
	 				if (response.data.data[i].is_late_night_scheduled){
	 					console.log("lnyt case");
	 					if(response.data.data[i].manager_schedule.late_night_schedule_details.is_approve != true){
	 						console.log(response.data.data[i].manager_schedule.late_night_schedule_details.is_approve);
	 						$scope.count = $scope.count+1;
	 					}
	 				}
	 				

	 			}
	 			console.log($scope.count);
	 			$scope.data=response.data.data;
	           console.log($scope.data);
	           console.log($scope.data[1].manager_schedule.morning_schedule_details.event.name);
	            });
	}

	$scope.viewshift();	



	$scope.morningPop=function(evnt){
		$http.post("/api/checkedshifts",{ID:evnt._id,'case':'Morning'}).then(function(data,headers,status,config){
			
			console.log(data);
		})
		// alert(1);
		$scope.event_modal=evnt.manager_schedule.morning_schedule_details.event;
		$scope.event_modal.title="Morning Event Schedule";
		console.log($scope.event_modal);
		$("#get-modal").show();
		$scope.viewshift();
	}


	$scope.lateNytPop=function(evnt){
		$http.post("/api/checkedshifts",{ID:evnt._id,'case':'LateNyt'}).then(function(data,headers,status,config){
			
			console.log(data);
		})
		
		// alert(1);
		$scope.event_modal=evnt.manager_schedule.late_night_schedule_details.event;
		$scope.event_modal.title="Late NIght Event Schedule";
		console.log($scope.event_modal);
		$("#get-modal").show();
		$scope.viewshift();
	}

	$scope.afternoonPop=function(evnt){
		$http.post("/api/checkedshifts",{ID:evnt._id,'case':'Afternoon'}).then(function(data,headers,status,config){
			
			console.log(data);
		})
		
		// alert(1);
		$scope.event_modal=evnt.manager_schedule.afternoon_schedule_details.event;
		$scope.event_modal.title="Afternoon Event Schedule";
		console.log($scope.event_modal);
		$("#get-modal").show();
		$scope.viewshift();
	}

	$scope.nytPop=function(evnt){
		$http.post("/api/checkedshifts",{ID:evnt._id,'case':'Night'}).then(function(data,headers,status,config){
			
			console.log(data);
		})
		
		// alert(1);
		$scope.event_modal=evnt.manager_schedule.night_schedule_details.event;
		$scope.event_modal.title="Afternoon Event Schedule";
		console.log($scope.event_modal);
		$("#get-modal").show();
		$scope.viewshift();
	}

	$scope.closemodal=function(){
		$("#get-modal").hide();	
	}

});

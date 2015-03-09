angular.module("app").controller("TimeSlotController", function($scope, TimeSlotResource, SessionService, $http, sidepanelactiveService) {
    $scope.user = SessionService.currentUser;
    
    // Show side panel active
    sidepanelactiveService.test();
    
    // Initialize slot time
    $scope.slottime = [
        {name: 1, value: 1},
        {name: 2, value: 2},
        {name: 3, value: 3},
        {name: 4, value: 4},
        {name: 5, value: 5},
        {name: 6, value: 6},
        {name: 7, value: 7},
        {name: 8, value: 8},
        {name: 9, value: 9},
        {name: 10, value: 10},
        {name: 11, value: 11},
        {name: 12, value: 12},
    ];
    
    $scope.visibility = false;
    
    // Initialize period
    $scope.period = [{name: "AM", value: "AM"}, {name: "PM", value: "PM"}];
    
    // Get data from TimeSlotResource
    TimeSlotResource.query(function(response){
        console.log("--RESOURCE --");
        console.log(response);
        $scope.slot = response[0];

        
        $scope.visibility = true;
    });
    
    // Save time slots
    $scope.saveTimeSlot = function(slot){
        console.clear();
        
        // If ADMIN then only hit the api to save data
        if( "admin" === SessionService.currentUser.roles[0] ) {
            $scope.slot.last_modified_by = SessionService.currentUser._id;
            $scope.slot.last_modified_date = new Date();
            if ($scope.slot._id) {
                console.log("--IF--");
                console.log($scope.slot);
                $http.post('/api/timeslot', $scope.slot).success(function(response){
                    $scope.slot = response.data;
                    toastr.success("Timeslot updated successfully.");
                });
            }
            else {
                $http.post('/api/timeslot', slot).success(function(response){
                    $scope.slot = response;
                    toastr.success("Timeslot added successfully.");
                });
            }
        }
   
    };

});
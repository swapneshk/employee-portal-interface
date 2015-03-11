angular.module("app").controller("ViewEventController", function($scope, SessionService, $http, $q) {
    // For table layout to work properly
    $(document).ready(function(){
        $("body").addClass("events");
    });
    
    var listData = {},
        listActiveData = [],
        listInactiveData = [],
        listRecurringData = [],
        activeCount = 0,
        inactiveCount = 0,
        recurringCount = 0;
    
    if( "admin" === SessionService.currentUser.roles[0] ) {
        // CODE TO FETCH COMPLETE LIST FOR ADMIN
        var ids = [],
        q1 = $q.defer(),
        q2 = $q.defer(),
        d1 = $http.get("/api/events").success(function(data){
            q1.resolve(data);
            angular.forEach(data.events, function(val) {
                //console.log(val._id);
                ids.push(val._id);
            });
            console.log(ids);
        });
        

    }
    else if( "manager" === SessionService.currentUser.roles[0] ) {
        // WRITE CODE TO FETCH LIST FOR THE MANAGER ONLY
    }
    else {
        // NOT AUTHORIZED TO MAKE ANY REQUEST
    }
    
    $scope.showall = function() {
        $scope.allEventNum = listData.length;
        $scope.allEvents = listData;
    };
    
    $scope.showactive = function() {
        $scope.allEvents = listActiveData;
    };
    
    $scope.showinactive = function() {
        $scope.allEvents = listInactiveData;       
    };
    
    $scope.showisrecurring = function() {
        $scope.allEvents = listRecurringData;       
    };
});
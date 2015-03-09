angular.module("app").controller("ViewEventController", function($scope, $location, SessionService, $http, $filter, sidepanelactiveService) {
    // For table layout to work properly
    /*
    $(document).ready(function(){
        $("body").addClass("events");
    });
    */
    
    // Show side panel active
    sidepanelactiveService.test();
    
    var orderBy = $filter('orderBy');
    
    $scope.visibility = false;
    $scope.haveResult = true;
    $scope.showEvent = function(eventid) {
        $location.path('/event/edit/' + eventid);
    };
    if( "admin" === SessionService.currentUser.roles[0] ) {
        // CODE TO FETCH COMPLETE LIST FOR ADMIN
        $http.get("/api/events").then(function(response){
            if ( "200" === response.data.status_code) {
                response.data.events.forEach(function(elem, key){
                     var st_str = new Date(elem.start_date);
                     elem.start_date = st_str.getFullYear()+'-'+st_str.getMonth()+'-'+st_str.getDate();
                     var end_str = new Date(elem.end_date);
                     elem.end_date = end_str.getFullYear()+'-'+end_str.getMonth()+'-'+end_str.getDate();
                });
                $scope.allEvents = response.data.events;
                if ($scope.allEvents.length > 0)
                    $scope.haveResult = true;
                else
                    $scope.haveResult = false;
                console.log($scope.allEvents);
                setPagingData($scope.allEvents);
                $scope.visibility = true;
            }
            else {
                toastr.error("Unable to fetch list this time!!");
            }
        })
        $scope.reverse = false;
        $scope.order = function(predicate, reverse) {
          $scope.allEvents = orderBy($scope.allEvents, predicate, reverse);
        };
    }
    else if( "manager" === SessionService.currentUser.roles[0] ) {
        // WRITE CODE TO FETCH LIST FOR THE MANAGER ONLY
        $http.post("/api/managerevents", {manager_id: SessionService.currentUser._id}).then(function(response){
            if ( "200" === response.data.status_code) {
                $scope.allEvents = response.data.events;
                if ($scope.allEvents.length > 0)
                    $scope.haveResult = true;
                else
                    $scope.haveResult = false;
                console.log($scope.allEvents);
                setPagingData($scope.allEvents);
                $scope.visibility = true;
            }
            else {
                toastr.error("Unable to fetch list this time!!");
            }
        })
        
        $scope.reverse = false;
        $scope.order = function(predicate, reverse) {
          $scope.allEvents = orderBy($scope.allEvents, predicate, reverse);
        };
    }
    else {
        // NOT AUTHORIZED TO MAKE ANY REQUEST
    }
    
    /** Pagination Code START **/
    function setPagingData(datam){
        $scope.allData = {};
        $scope.perPage = 5;
        //$scope.allData = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
        $scope.allData = datam;
        $scope.offset = 0;
        $scope.navButtons = [];
        
        $scope.isPreviousDisabled = false;
        $scope.isNextDisabled = false;
        $scope.buildNavButtons = function () {
            for (var i = 0, len = ($scope.allData.length / $scope.perPage); i < len; i = i + 1) {
                $scope.navButtons.push(i);
            }
            //alert("Nav Buttons : " + $scope.navButtons);
        }

        $scope.paginate = function() {
            $scope.allEvents = $scope.allData.slice($scope.offset, $scope.offset + $scope.perPage);
        };

        $scope.previous = function() {
            $scope.offset = $scope.offset - $scope.perPage;
        };

        $scope.next = function() {
            $scope.offset = $scope.offset + $scope.perPage;            
        };
        $scope.getoffset = function(offsetval){
             $scope.offset = offsetval;            
        }

        $scope.$watch('offset', function() {
            if( $scope.offset < 0 ){
                $scope.isPreviousDisabled = true;
                $scope.isNextDisabled = false;
                $scope.offset = 0;
                return false;
            }
            else{
                $scope.isPreviousDisabled = false;
            }
            
            //disable Next button
            //if( $scope.offset > (($scope.perPage * ($scope.allData.length/$scope.perPage))-1) ){
            if( $scope.offset > ($scope.allData.length-1) ){
                $scope.isNextDisabled = true;
                $scope.isPreviousDisabled = false;
                //alert("Next button disabled : "+$scope.offset);
                $scope.offset = ($scope.perPage * ($scope.allData.length/$scope.perPage));
                //alert("Offset Value changed to : "+$scope.offset);
                return false;
            }
            else{
                $scope.isNextDisabled = false;
            }
            $scope.paginate();
            //alert("In else...");
        });
        $scope.buildNavButtons();
    }            
    /** Pagination Code ENDS **/
    $scope.havealignResult = true;
    $scope.showemplist = function(eventid) {
        $http.post("/api/otherEmpOnEventsNoShift",{event:eventid}).then(function(innerresponse){
            if ( "200" === innerresponse.data.status_code) {
                    if (typeof innerresponse.data!="undefined") {
                            
                            var empidarr = [];
                            innerresponse.data.data.forEach(function(elem, key){
                                if (empidarr.indexOf(elem.employee_id._id) != -1) {
                                    innerresponse.data.data.splice(key,1);
                                }else{
                                    empidarr.push(elem.employee_id._id);
                                }
                            });
                            $scope.sameemployees = innerresponse.data.data;
                            if ($scope.sameemployees.length > 0)
                                $scope.havealignResult = true;
                            else
                                $scope.havealignResult = false;
                    }else{
                            var sameemployees = {};
                            $scope.havealignResult = false;
                    }
            }
        }); 
    };
});
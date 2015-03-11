angular.module("app").controller("timeoffRequestController", function($scope, $location, SessionService, $http, UserService,$routeParams, $timeout, fileUpload) {
    console.log(SessionService.currentUser);
    $scope.user = SessionService.currentUser;
    $scope.siteurl = $location.absUrl().split(":8000/")[0];
    $scope.shifts = [
        {name: "Morning", value: "Morning"},
        {name: "Afternoon", value: "Afternoon"},
        {name: "Night", value: "Night"},
        {name: "Late Night", value: "Late Night"}
    ];
    $scope.timeoff = {
        daytype : "Full"
    };
    $scope.cleardata = function(){
        toastr.info("You cleared the data.");
        $scope.timeOffRequestForm.$setPristine();
        $scope.timeoff = {
               daytype : "Full",
               shift : $scope.shifts[0].value
        };
    };
    $scope.sendTimeOffRequest = function(timeoff){
        if($scope.timeOffRequestForm.$invalid){
            alert("Form is not valid.");
        }else{
            timeoff.employee_id = SessionService.currentUser._id;
            timeoff.manager_id = SessionService.currentUser.created_by;
            timeoff.applyDate = new Date();
            if (timeoff.daytype == 'Partial') {
                timeoff.enddate = timeoff.startdate;
            }
            $http.post("/api/savetimeoffrequests",timeoff).then(function(response){
                if( "200" === response.data.status_code ) {
                    toastr.success("Successfully sent.");
                    $http.post("/api/gettimeoff", {userId: SessionService.currentUser._id}).then(function(response){
                        console.log("GET Timeoff RESPONSE");
                        if( "200" === response.data.status_code ) {
                                $scope.allTimeoffs = response.data.data;
                        };
                    });
                }
            });
        }
    };
    $scope.timeoffResponse = function(timeoffdata){
        $http.post("/api/updatetimeoff",timeoffdata).then(function(response){
           // console.log(response);
            if( "200" === response.data.status_code ) {
             //   console.log('test');
                toastr.success("Successfully Confirmed.");
            }
        }); 
    }
    
    // SHOW Timeoffs CREATED BY ITSELF
    $http.post("/api/gettimeoff", {userId: SessionService.currentUser._id, role:SessionService.currentUser.roles[0]}).then(function(response){
        console.log("GET Timeoff RESPONSE");
        if( "200" === response.data.status_code ) {
                $scope.allTimeoffs = response.data.data;
                if ($scope.allTimeoffs.length > 0){
                    $scope.haveResult = true;
                    setPagingData($scope.allTimeoffs);
                }
                else
                    $scope.haveResult = false;
        };
    });
    
    var timeoffid = $routeParams.id;
    if (timeoffid) {
        var timeoffid_new = timeoffid.substr(1);
        if (timeoffid_new) {
            $http.get("/api/gettimeoff/"+timeoffid_new).then(function(response){
                console.log("GET Timeoff RESPONSE");
                if( "200" === response.data.status_code ) {
                        $scope.allTimeoffs = response.data.data;
                };
            });
        } 
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
        };

        $scope.paginate = function() {
            $scope.allTimeoffs = $scope.allData.slice($scope.offset, $scope.offset + $scope.perPage);
            //alert("Sliced Data : " + $scope.data);
        };

        $scope.previous = function() {                    
            $scope.offset = $scope.offset - $scope.perPage;
        };

        $scope.next = function() {
            //alert("offset value : "+os);
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
   
});
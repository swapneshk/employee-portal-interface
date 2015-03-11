angular.module("app").controller("payrollController", function($scope, $location, SessionService, $http, UserService,$routeParams, $timeout, fileUpload) {
    $scope.user = SessionService.currentUser;
    $scope.siteurl = $location.absUrl().split(":8000/")[0];      
    $scope.cleardata = function(){
        toastr.info("You cleared the data.");
        angular.element("input.ng-invalid").css("border","1px solid #d3d3d3");
        $scope.payrollForm.$setPristine();
        $scope.payroll = {
               emp_id : $scope.allEmps[0]     
        };
    };
    
    $scope.payroll = {};
    $http.get("/api/getempl").then(function(response){
         if ( "200" === response.data.status_code) {
             $scope.allEmps = response.data.data;
             $scope.payroll.emp_id = $scope.allEmps[0];
         } 
    });
        
    $scope.addPayroll = function(payroll){
        if($scope.payrollForm.$invalid){
            alert("Form is not valid.");
            angular.element("input.ng-invalid").css("border-color","red");
        }else{
            payroll.emp_id = payroll.emp_id._id;
            payroll.owner_id = SessionService.currentUser._id;
            $http.post("/api/addPayroll",payroll).then(function(response){
                if( "200" === response.data.status_code ) {
                    toastr.success("Successfully Added.");
                }
            });
            $scope.payroll = {
                   emp_id : $scope.allEmps[0]     
            };
        }
    };
    $scope.haveResult = true;
    $http.post("/api/getPayrolls", {ownerId: SessionService.currentUser._id}).then(function(response){
            if( "200" === response.data.status_code ) {
                $scope.allPayrolls = response.data.data;
                if ($scope.allPayrolls.length > 0){
                    $scope.haveResult = true;
                    setPagingData($scope.allPayrolls);
                }
                else
                    $scope.haveResult = false;
            }
    });
    
    
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
            $scope.allPayrolls = $scope.allData.slice($scope.offset, $scope.offset + $scope.perPage);
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
angular.module("app").controller("ViewManagerClientController", function($scope, $location, SessionService, $http, $filter, sidepanelactiveService) {
    
    // Show side panel active
    sidepanelactiveService.test();
    
    $scope.user = SessionService.currentUser;    
    console.log(SessionService.currentUser);
    
    $(document).ready(function(){
        $("body").removeClass("events");
    });
    $scope.haveResult = true;
    $scope.showClient = function(clientid) {
        $location.path('/client/' + clientid);
    };
    // Get user listing
    $http.post("/api/managerclients", {manager_id: SessionService.currentUser._id}).then(function(response){
        if (response.status == 200) {
            console.log(response.data.data);
            $scope.clientData = response.data.data;
            if ($scope.clientData.length > 0)
                $scope.haveResult = true;
            else
                $scope.haveResult = false;
            setPagingData($scope.clientData);         
        }
        else {
            console.log('400');
        }
    });
    
    var orderBy = $filter('orderBy');
    
    $scope.reverse = false;
    $scope.order = function(predicate, reverse) {
      $scope.clientData = orderBy($scope.clientData, predicate, reverse);
    };

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
            $scope.clientData = $scope.allData.slice($scope.offset, $scope.offset + $scope.perPage);
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
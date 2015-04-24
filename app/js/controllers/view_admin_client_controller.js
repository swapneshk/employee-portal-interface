angular.module("app").controller("ViewAdminClientController", function($scope, $location,SessionService, $http, $filter) {
    
    /* start of activate sidebar tab */   
    var current_url = $location.path();
    var buttons = angular.element('ul.sidebar-nav li a');
    for(var i=0;i<buttons.length;i++){
            var href =  buttons.get(i).href.split(":8000")[1];
            if(href == current_url){
                angular.element("ul.sidebar-nav li a[href!='"+current_url+"']").parent().removeClass("current");
                angular.element("ul.sidebar-nav li a[href='"+current_url+"']").parent().addClass("current");
            }
    }
    /* End of code for activate sidebar tab*/
    
    $scope.user = SessionService.currentUser;
    $(document).ready(function(){
        $("body").removeClass("events");
    });
    $scope.haveResult = true;
    $scope.showClient = function(clientid) {
        $location.path('/client/' + clientid);
    };
    var orderBy = $filter('orderBy');
    $scope.visibility = false;

     //listing of more dan 5 clients

    $scope.listclient = [
        {name: "5", value: 5},
        {name: "10", value: 10},
        {name: "15", value:15},
        {name: "20", value: 20},
        {name: "All", value:'All'},
         ];

    $scope.currentPage=5;


    
  

    $scope.getclientdata=function(){
          // Get user listing
    $http.get("/api/clients").then(function(response){
        if (response.status == 200) {
            //console.log(response.data);
            $scope.clientData = response.data.data;
            if ($scope.clientData.length > 0)
                $scope.haveResult = true;
            else
                $scope.haveResult = false;
            setPagingData($scope.clientData);
            $scope.visibility = true;
        }
        else {
            console.log('400');
        }
    });
    };
    $scope.getclientdata();
    
    $scope.reverse = false;
    $scope.order = function(predicate, reverse) {
      $scope.clientData = orderBy($scope.clientData, predicate, reverse);
    };
    

    $scope.perPage = 5;
    /** Pagination Code START **/
    function setPagingData(datam){
        $scope.allData = {};
        // $scope.perPage = 5;
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
             // $scope.$apply();
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


    $scope.$watch(function(scope,$http) 
        { return scope.currentPage },
      function(newValue, oldValue) 
      {
        console.log($http);
        console.log("here");
          console.log(newValue);
          console.log(oldValue);
          if(newValue != "All"){
            // alert("notall");
          $scope.perPage = parseInt(newValue);
          }
          else{
                // alert("all");
            $scope.perPage= newValue;
        }
          console.log("perpage");
          console.log($scope.perPage);
          $scope.updatepagination($http);
      }
     );


    $scope.updatepagination=function($http){
        $http.get("/api/clients").then(function(response){
        if (response.status == 200) {
            console.log(response.data.data);
            $scope.clientData = response.data.data;
            if($scope.perPage=="All"){
                $scope.perPage=$scope.clientData.length;
            }
            console.log($scope.perPage);
            if ($scope.clientData.length > 0)
                $scope.haveResult = true;
            else
                $scope.haveResult = false;
            setPagingData($scope.clientData);
            $scope.visibility = true;
        }
        else {
            console.log('400');
        }
    });
    }

    //to delete client
     $scope.delete_client=function(id){
         $http.post("/api/delclients",{clientid:id} ).then(function(response){
            
                console.log(response);
            });
         $scope.getclientdata();
        
    }
});
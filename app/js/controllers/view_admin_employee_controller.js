angular.module("app").controller("ViewAdminEmployeeController", function($scope, $location, SessionService, $http, $filter, $rootScope, sidepanelactiveService) {
    
    // Show side panel active
    sidepanelactiveService.test();
    $scope.user = SessionService.currentUser;
    $scope.siteurl = $location.absUrl().split(":8000/")[0];
    $scope.items = ['Chicken', 'Corn', 'Ice Cream', 'Cereal'];
    $(document).ready(function(){
        $("body").removeClass("events");
        //if ($('.datepicker').length && $.fn.datepicker) {
        //    $('.datepicker').each(function () {
        //        var datepicker_inline = $(this).data('inline') ? $(this).data('inline') : false;
        //        var dt = new Date();
        //        dt.setDate(dt.getDate()-1);
        //        $(this).datepicker({
        //            inline: datepicker_inline,
        //            formatDate:'Y-m-d',
        //            startDate: dt
        //        });
        //    });
        //}
        //
        ///****  Datetimepicker  ****/
        //if ($('.datetimepicker').length && $.fn.datetimepicker) {
        //    $('.datetimepicker').each(function () {
        //        var datetimepicker_inline = $(this).data('inline') ? $(this).data('inline') : false;
        //        $(this).datetimepicker({
        //            inline: datetimepicker_inline,
        //            formatDate:'Y-m-d'
        //        });
        //    });
        //}      
    });
    
    var orderBy = $filter('orderBy');

    //listing of more dan 5 employees

    $scope.listemp = [
        {name: "5", value: 5},
        {name: "10", value: 10},
        {name: "15", value:15},
        {name: "20", value: 20},
        {name: "All", value:'All'},
         ];

    $scope.currentPage=5;

    // Get user listing
    
    $scope.visibility = false;
    $scope.haveResult = true;
    $scope.showEmp = function(empid) {
        $location.path('/employee/edit/:' + empid);
    };
    

    $scope.getempdata=function(){
        $http.get("/api/getempl").then(function(response){
        if (response.status == 200) {
            console.log(response.data.data);
            $scope.empData = response.data.data;
            if ($scope.empData.length > 0)
                $scope.haveResult = true;
            else
                $scope.haveResult = false;
            setPagingData($scope.empData);
            $scope.visibility = true;
        }
        else {
            console.log('400');
        }
    });
    };
    $scope.getempdata();
    
    $scope.reverse = false;
    $scope.order = function(predicate, reverse) {
      $scope.empData = orderBy($scope.empData, predicate, reverse);
    };

    
     /* Filter in employee listing - 15-10-2014 */    
    $scope.filter = {};

    $scope.filterEmp = function() {
        var userRole = SessionService.currentUser.roles[0];
        var userId = SessionService.currentUser._id;
        var filter_start_date = $scope.filter.start_date;
        var filter_end_date = $scope.filter.end_date;
        // Global variable declaration
        $rootScope.filter_start_date = filter_start_date;
        $rootScope.filter_end_date = filter_end_date;
        
        if ( filter_start_date === undefined || filter_start_date === "" ) {
            toastr.error("Please select start date.");
            return false;
        }
        else {
            if ( filter_end_date === undefined || filter_end_date === "" ) {
                //code to fetch data only from start_date
                var filter_start_date = new Date(filter_start_date).toUTCString();
                var filter_end_date = new Date(filter_end_date).toUTCString();
                $http.post('/api/filterEmpByDate', {filter_start_date: filter_start_date, userRole: userRole, userId: userId}).then(function(response){
                    $scope.empData = response.data.data;
                    setPagingData($scope.empData);
                });
            }
            else {
                //code to fetch data from start_date and end_date
                var filter_start_date = new Date(filter_start_date).toUTCString();
                var filter_end_date = new Date(filter_end_date).toUTCString();
                $http.post('/api/filterEmpByDate', {filter_start_date: filter_start_date, filter_end_date: filter_end_date, userRole: userRole, userId: userId}).then(function(response){
                    $scope.empData = response.data.data;
                    setPagingData($scope.empData);
                });
            }
        }
    };
    $scope.perPage = 5;
    /** Pagination Code START **/
    function setPagingData(datam){
        $scope.allData = {};
        console.log("+++++++++");
        console.log($scope.perPage);
        
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
            $scope.empData = $scope.allData.slice($scope.offset, $scope.offset + $scope.perPage);
            
            // $scope.$apply();//alert("Sliced Data : " + $scope.data);
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
        $http.get("/api/getempl").then(function(response){
        if (response.status == 200) {
            
            
            console.log(response.data.data);
            $scope.empData = response.data.data;
            if($scope.perPage=="All"){
                $scope.perPage=$scope.empData.length;
            }
            console.log($scope.perPage);
            if ($scope.empData.length > 0)
                $scope.haveResult = true;
            else
                $scope.haveResult = false;
            setPagingData($scope.empData);
            $scope.visibility = true;
        }
        else {
            console.log('400');
        }
    });
    }

    //to delete user
     $scope.delete_empl=function(id){
         $http.post("/api/delempl",{empid:id} ).then(function(response){
            
                console.log(response);
            });
            $scope.getempdata();
    }

});


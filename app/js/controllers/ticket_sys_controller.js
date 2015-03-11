angular.module("app").controller("ticketSysController", function($scope, $location, SessionService, $http, UserService,$routeParams, $timeout, fileUpload) {
    $scope.user = SessionService.currentUser;
    $scope.siteurl = $location.absUrl().split(":8000/")[0];
    $scope.shifts = [
        {name: "Morning", value: "Morning"},
        {name: "Afternoon", value: "Afternoon"},
        {name: "Night", value: "Night"},
        {name: "Late Night", value: "Late Night"}
    ];
    
    $scope.cleardata = function(){
        toastr.info("You cleared the data.");
        angular.element("input.ng-invalid").css("border","1px solid #d3d3d3");
        $scope.ticketSysForm.$setPristine();
        $scope.ticket = {
               shift : $scope.shifts[0].value,
               event_id : $scope.allEvents[0].value     
        };
    };
    $scope.ticket = {};
    if ("admin" === SessionService.currentUser.roles[0]) {
        $http.get("/api/events").then(function(response){
             if ( "200" === response.data.status_code) {
                 $scope.allEvents = response.data.events;
                 $scope.ticket.event_id = $scope.allEvents[0];
             } 
        });
        $http.get("/api/clients").then(function(response){
            if (response.status == 200) {
                $scope.allClients = response.data.data;
                $scope.ticket.client_id = $scope.allClients[0];
            }
        });
    }
      
    if ("manager" === SessionService.currentUser.roles[0]) {
        $http.post("/api/managerevents",{manager_id:SessionService.currentUser._id}).then(function(response){
            if ( "200" === response.data.status_code) {
                $scope.allEvents = response.data.events;
                $scope.ticket.event_id = $scope.allEvents[0];
            } 
        });
        
        $http.post("/api/managerclients", {manager_id: SessionService.currentUser._id}).then(function(response){
            if (response.status == 200) {
                $scope.allClients = response.data.data;
                $scope.ticket.client_id = $scope.allClients[0];
            }
        });
    
    }
    
    $scope.generateTicket = function(ticket){
        if($scope.ticketSysForm.$invalid){
            alert("Form is not valid.");
            angular.element("input.ng-invalid").css("border-color","red");
        }else{
            ticket.owner_id = SessionService.currentUser._id;
            ticket.event = ticket.event_id._id;
            ticket.account = ticket.client_id._id;
            tickets_strings = [];
            for(var i=0;i<ticket.number_of_ticket;i++){
                      var ticketstr = ticket.event_id._id+'_'+new Date().getTime();
                      tickets_strings.push({'ticket': ticketstr+i});
            }
            ticket.tickets_string = tickets_strings;
            ticket.tickets_strings = ticket.tickets_string;
            $http.post("/api/saveticketCount",ticket).then(function(response){
                if( "200" === response.data.status_code ) {
                    toastr.success("Successfully Generated.");
                }
            });
        }
    };
    
    $http.post("/api/gettickets", {ownerId: SessionService.currentUser._id}).then(function(response){
            if( "200" === response.data.status_code ) {
                $scope.allTickets = response.data.data;
                if ($scope.allTickets.length > 0){
                    $scope.haveResult = true;
                    setPagingData($scope.allTickets);
                }
                else
                    $scope.haveResult = false;
            }
    });
    
    

    $scope.printDiv = function(divName) {
        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;        
        var popupWin = window.open('', '_blank', 'width=300,height=300');
        popupWin.document.open()
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
        popupWin.document.close();
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
            $scope.allTickets = $scope.allData.slice($scope.offset, $scope.offset + $scope.perPage);
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
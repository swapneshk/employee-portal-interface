angular.module("app").controller("EditClientController", function($scope, SessionService, $routeParams, $http, $location) {
    $scope.user = SessionService.currentUser;
    $scope.empData = {};    
    $scope.action = "Edit";
    
    $scope.clientId = $routeParams.id;
    $http.get('/api/clientbyid/' + $scope.clientId).
    success(function(response) {
      console.clear();
      console.log(response);
      $scope.client = response.data;
      
      // Is Account & Is Active pre populated
      $scope.client.is_account = ( true === response.data.is_account ) ? "Yes": "No";
      $scope.client.is_active = ( true === response.data.is_active ) ? "Yes": "No";
      
      // Add Contact Type Data
      console.clear();
      //console.log(response.data);
      $scope.items = response.data.contactArr;

      for(var i=0; i< response.data.contactArr.length; i++){
        $scope.cnctnum[i] = response.data.contactArr[i].cntnumber;
        switch(response.data.contactArr[i].cnttype) {
            case "1":
                $scope.cncttype[i] = 1;
                break;
            case "2":
                $scope.cncttype[i] = 2;
                break;
            case "3":
                $scope.cncttype[i] = 3;
                break;
            case "4":
                $scope.cncttype[i] = 4;
                break;
            default:
                $scope.cncttype[i] =1;
                breaks;
        }
      }

      
    });  
    
    $scope.editClient = function(client){
        if($scope.clientForm.$invalid){
            alert("Form is not valid.");
            angular.element("input.ng-invalid").css("border-color","red");
            //angular.element("input.ng-invalid").focus();
        }
        else{  
            /* Code is for saving the contact info with types */
            client.contactArr = [];
            if ( ($scope.cnctnum.length > 0) || ($scope.cncttype.length > 0) ) {
                for(var i=0; i< $scope.cnctnum.length; i++) {
                    client.contactArr.push({cntnumber: $scope.cnctnum[i], cnttype: $scope.cncttype[i]});
                }
            }
            
            client.created_by = SessionService.currentUser._id;
            client.is_account = client.is_account.toLowerCase() === "yes" ? true : false;
            client.is_active = client.is_active.toLowerCase() === "yes" ? true : false;
            console.log(client);
            //return false;
            //Code to create new user(role employee)
            $http.put("/api/clients", client).then(function(response){
                if (response.data) {
                    toastr.success("Client updated successfully.");
                    $scope.clientForm.$setPristine();
                    //$scope.client = {};
                    $scope.client.is_account = ( true === response.data.is_account ) ? "Yes": "No";
                    $scope.client.is_active = ( true === response.data.is_active ) ? "Yes": "No";
                    console.clear();
                    console.log("---");
                    console.log(SessionService.currentUser.roles[0]);
                    if ("admin" === SessionService.currentUser.roles[0]) {
                        $location.path("/viewadminclient");
                    }
                    else if ("manager" === SessionService.currentUser.roles[0]) {
                        $location.path("/viewmanagerclient");
                    }
                    else {
                        $location.path("/login");
                    }
                }
                else {
                    toastr.error("Something went wrong, check your credentials");
                }
            });
        }

    };
    
    $scope.cleardata = function(){
        toastr.info("You cleared the data.");
        $scope.clientForm.$setPristine();
        $scope.client = {};
    };
    
  $scope.cnctnum = [];
  $scope.cncttype = [];
  
  $scope.types = [
    {name: "Cell", value: 1},
    {name: "Work", value: 2},
    {name: "Home", value: 3},
    {name: "Fax", value: 4}
  ];
  
  $scope.items = [];
  var i =0;
  $scope.addCnt = function(){
    $scope.items.push(i);
    i++;
  };
  
  $scope.remCl = function(index){
    $scope.cnctnum.splice(index, 1);
    $scope.cncttype.splice(index, 1);
    $scope.items.splice(index, 1);
  };
  
  $scope.getval = function(){
    console.log($scope.cnctnum);
    console.log($scope.cncttype);
  };
    
});
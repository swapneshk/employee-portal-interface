angular.module("app").controller("AddClientController", function($scope, SessionService, $http, $location) {
    $scope.user = SessionService.currentUser;
    $scope.empData = {};    
    $scope.action = "Add";
    
    $scope.addClient = function(client){
        if($scope.clientForm.$invalid){
            alert("Form is not valid.");
            angular.element("input.ng-invalid").css("border-color","red");
        }else{
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
    
            //Code to create new user(role employee)
            $http.post("/api/clients", client).then(function(response){
                if (response.data) {
                    toastr.success("Client added successfully.");
                    $scope.clientForm.$setPristine();
                    $scope.client = {};
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
        angular.element("input.ng-invalid").css("border","1px solid #d3d3d3");
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
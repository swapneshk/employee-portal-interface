angular.module("app").controller("ForgetController", function($scope, NotificationService, $http) {
  $scope.credentials = { email: "" };
  var sendingData = {};
  
  $scope.forgetpassword = function() {
    //console.log($scope.credentials.email);

    $http.post("/api/forgetpassword", { email: $scope.credentials.email }).then(function( response ) {
      console.log(response);
      //console.log(response.data.status_code);
      if (response.data.status_code === "200") {
        //Hit API for sending email
        console.log(response.data.data.email);
        NotificationService.notify("Password changed successfully, check your inbox!!");
      }
      else if(response.data.status_code === "202"){
        NotificationService.notify("Your Email doesn't exists", "error");
      }
      else{
        NotificationService.notify("Something went wrong!!", "error");
      }
    });

  };

});
angular.module("app").controller("PasswordController", function($scope, SessionService, $location, $http) {
  
  console.clear();
  console.log(SessionService.currentUser);
  
  $scope.editPassword = function(password){
    
    if ( password.new_pass !== password.new_retype_pass ) {
      toastr.error("New password and re-type password don't match");
      return false;
    }
    else if ( password.new_pass.length < 7 ) {
      toastr.error("Password is less than 7 characters");
      return false;
    }
    else {
      password.email = SessionService.currentUser.email;
      password._id = SessionService.currentUser._id;
      $http.post('/api/changepassword', password).then(function(response){
        if( "200" === response.data.status_code ){
          toastr.success("Password updated successfully.");
          $scope.editpasswordForm.$setPristine();
        }
        else {
          toastr.error("Something went wrong, please login again");
        }
      });
    }

  };
  
});
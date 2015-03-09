angular.module("app").controller("EmployeeProfileController", function($scope, $location, SessionService, $http, UserService, $timeout, fileUpload) {
    $scope.user = SessionService.currentUser;
    $scope.siteurl = $location.absUrl().split(":8000/")[0];
    
    $scope.update = function(user){

        // Code for Image handling - START
        if ($scope.myFile) {
            var file = $scope.myFile;
            var chkData = "";
            console.log('file is ' + JSON.stringify(file));
            var uploadUrl = "/api/fileUpload";

            fileUpload.uploadFileToUrl(file, uploadUrl, function(retData){
                if ( true === retData.success ) {
                    user.prof_image = retData.save_image_name;
                    UserService.updateUser(user);
                    toastr.success("Information updated successfully.");
                }
                else
                    console.log("Failure");
            });
        }
        else {
            UserService.updateUser(user);
            toastr.success("Information updated successfully.");
        }
        // Code for Image handling - END
      
    };
});
angular.module("app").controller("AddEmployeeController", function($scope, NotificationService, SessionService, $http, $location) {
    
        //$(document).ready(function(){
        //    /****  Datepicker  ****/
        //    if ($('.datepicker').length && $.fn.datepicker) {
        //        $('.datepicker').each(function () {
        //            var datepicker_inline = $(this).data('inline') ? $(this).data('inline') : false;
        //            $(this).datepicker({
        //                inline: datepicker_inline,
        //                formatDate:'Y-m-d'
        //            });
        //        });
        //    }
        //    
        //    /****  Datetimepicker  ****/
        //    if ($('.datetimepicker').length && $.fn.datetimepicker) {
        //        $('.datetimepicker').each(function () {
        //            var datetimepicker_inline = $(this).data('inline') ? $(this).data('inline') : false;
        //            $(this).datetimepicker({
        //                inline: datetimepicker_inline,
        //                formatDate:'Y-m-d'
        //            });
        //        });
        //    }        
        //});    
    
    $scope.rolesArr = [
        {name: "Employee", value: 'Employee'},
        {name: "Manager", value: 'Manager'},
        {name: "Hr", value: 'Hr'}
    ];
    $scope.user = SessionService.currentUser;
    $scope.empData = {};
        if(SessionService.currentUser.roles.indexOf('admin') > -1)
                $scope.role = 'admin';
        else if(SessionService.currentUser.roles.indexOf('manager') > -1)
                $scope.role = 'manager';
        else if(SessionService.currentUser.roles.indexOf('employee') > -1)
                $scope.role = 'employee';
        else if(SessionService.currentUser.roles.indexOf('hr') > -1)
                $scope.role = 'hr';
                
    $scope.addEmployee = function(employee){
        if($scope.employeeForm.$invalid){
            alert("Form is not valid.");
            angular.element("input.ng-invalid").css("border-color","red");
            angular.element("input.ng-invalid").focus();
        }else{
                if (employee.date_of_birth != "") {
                        jsDate = new Date(employee.date_of_birth);
                }
                
                if ($scope.role == "admin") {
                        if(employee.emp_role == 'Employee')
                                employee.roles = ["employee"];
                        if(employee.emp_role == 'Manager')
                                employee.roles = ["manager"];
                        if(employee.emp_role == 'Hr')
                                employee.roles = ["hr"];
                }
                if ($scope.role == "manager") {
                        employee.roles = ["employee"];
                }
                employee.date_of_birth = jsDate;
                employee.created_by = SessionService.currentUser._id;
                employee.active = true;
                employee.password = "password";
                employee.password_change = false;
                employee.created_date = new Date();
                //Code to create new user(role employee)
                $http.post("/api/users", employee).then(function(response){
                    if (response.data) {
                        toastr.success("Employee added successfully.");
                        $scope.employeeForm.$setPristine();
                        $scope.employee = {};
                        if ("admin" === SessionService.currentUser.roles[0]) {
                            $location.path("/viewadminemployee");
                        }
                        else if ("manager" === SessionService.currentUser.roles[0]) {
                            $location.path("/viewmanageremployee");
                        }
                        else {
                            $location.path("/login");
                        }
                    }
                    else {                
                        if (employee.date_of_birth != "") {
                            $scope.employee.date_of_birth = jsDate;
                        }
                        toastr.error("Something went wrong, check your credentials");
                    }
                })
        }
    };
    
    $scope.cleardata = function(){
        toastr.info("You cleared the data.");
        $scope.employeeForm.$setPristine();
        $scope.employee = {};
    };
});
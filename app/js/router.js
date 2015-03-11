angular.module("app").config(function($routeProvider, $locationProvider, $httpProvider) {
  
  var interceptor = function($rootScope, $q) {
    function success(response) {
      return response;
    }
    function error(response) {
      if (!response.headers("authenticated user")) {
        var deferred = $q.defer();
        $rootScope.$broadcast('event:auth-loginRequired', response);
        return deferred.promise;
      }
      // otherwise, default behaviour
      return $q.reject(response);
    }

    return function(promise) {
      return promise.then(success, error);
    };
  };
  $httpProvider.responseInterceptors.push(interceptor);
  
  var routeRoleChecks = {
    
    admin: {
        auth: function(AuthenticationService) {
          return AuthenticationService.authorizeCurrentUserForRoute("admin");
        }
      },
    manager: {
        auth: function(AuthenticationService) {
          return AuthenticationService.authorizeCurrentUserForRoute("manager");
        }
      },
    hr: {
        auth: function(AuthenticationService) {
          return AuthenticationService.authorizeCurrentUserForRoute("hr");
        }
      },
    adminManager: {
        auth: function(AuthenticationService) {
          return AuthenticationService.authorizeCurrentUserForRoute("adminManager");
        }
      },
    adminManagerUser: {
        auth: function(AuthenticationService) {
          return AuthenticationService.authorizeCurrentUserForRoute("adminManagerUser");
        }
      },
    user: {
        auth: function(AuthenticationService) {
          return AuthenticationService.authorizeAuthenticatedUserForRoute();
        }
      }
  };

  $routeProvider
    .when("/login", {
      template: JST["app/templates/login"],
      controller: "LoginController",
    })
    .when("/editpassword", {
      template: JST["app/templates/editpassword"],
      controller: "PasswordController",
      resolve: routeRoleChecks.user
    })
    .when("/dashboard", {
      template: JST["app/templates/dashboard"],
      controller: "DashboardController",
      resolve: routeRoleChecks.user
    })
    .when("/users", {
      template: JST["app/templates/users/list"],
      controller: "UserListController",
      resolve: routeRoleChecks.admin
    })
    .when("/users/:id", {
      template: JST["app/templates/users/profile"],
      controller: "UserController",
      resolve: routeRoleChecks.user
    })
    .when("/users/:id/edit", {
      template: JST["app/templates/users/form"],
      controller: "UserController",
      resolve: routeRoleChecks.user
    })
    .when("/forgetpassword", {
      template: JST["app/templates/forgetpassword"],
      controller: "ForgetController"
    }).
    when("/adminprofile", {
      template: JST["app/templates/admins/adminprofile"],
      controller: "AdminProfileController",
      resolve: routeRoleChecks.admin
    }).
    when("/viewadminprofile", {
      template: JST["app/templates/admins/viewadminprofile"],
      controller: "ViewAdminProfileController",
      resolve: routeRoleChecks.admin
    }).
    when("/viewadminemployee", {
      template: JST["app/templates/admins/viewadminemployee"],
      controller: "ViewAdminEmployeeController",
      resolve: routeRoleChecks.admin
    }).
    when("/viewadminclient", {
      template: JST["app/templates/admins/viewadminclient"],
      controller: "ViewAdminClientController",
      resolve: routeRoleChecks.admin
    }).
    when("/viewmanageremployee", {
          template: JST["app/templates/managers/viewmanageremployee"],
          controller: "ViewManagerEmployeeController",
          resolve: routeRoleChecks.manager
    }).
    when("/viewmanagerclient", {
          template: JST["app/templates/managers/viewmanagerclient"],
          controller: "ViewManagerClientController",
          resolve: routeRoleChecks.manager
    }).     
    when("/viewmanagerprofile", {
          template: JST["app/templates/managers/viewmanagerprofile"],
          controller: "ViewManagerProfileController",
          resolve: routeRoleChecks.manager
    }).
    when("/viewemployeeprofile", {
          template: JST["app/templates/employees/viewemployeeprofile"],
          controller: "ViewEmployeeProfileController",
          resolve: routeRoleChecks.user
    }).
    when("/viewhrprofile", {
          template: JST["app/templates/hr/viewhrprofile"],
          controller: "ViewHrProfileController",
          resolve: routeRoleChecks.hr
    }).
    when("/hrprofile", {
          template: JST["app/templates/hr/hrprofile"],
          controller: "HrProfileController",
          resolve: routeRoleChecks.hr
    }).
    when("/managerprofile", {
          template: JST["app/templates/managers/managerprofile"],
          controller: "ManagerProfileController",
          resolve: routeRoleChecks.manager
    }).
    when("/addemployee", {
          template: JST["app/templates/addemployee"],
          controller: "AddEmployeeController",
          resolve: routeRoleChecks.adminManager
    }).
    when("/addclient", {
          template: JST["app/templates/addclient"],
          controller: "AddClientController",
          resolve: routeRoleChecks.adminManager
    }).
    when("/addevent", {
          template: JST["app/templates/addevent"],
          controller: "AddEventController",
          resolve: routeRoleChecks.adminManager
    }).
    when("/eventlist", {
          template: JST["app/templates/eventlist"],
          controller: "ViewEventController",
          resolve: routeRoleChecks.adminManager
    }).
    when("/employeeprofile", {
          template: JST["app/templates/employees/employeeprofile"],
          controller: "EmployeeProfileController",
          resolve: routeRoleChecks.user
    }).
    when("/viewschedule", {
          template: JST["app/templates/viewschedule"],
          controller: "ScheduleController",
          resolve: routeRoleChecks.user
    }).    
    when("/employee/edit/:id", {
          template: JST["app/templates/editemployee"],
          controller: "EditEmployeeController",
          resolve: routeRoleChecks.adminManager
    }).
    when("/employee/availibility/:id", {
          template: JST["app/templates/view_employee_availability"],
          controller: "EmployeeAvailabilityController",
          resolve: routeRoleChecks.adminManager
    }).
    when("/event/edit/:id", {
          template: JST["app/templates/editevent"],
          controller: "EditEventController",
          resolve: routeRoleChecks.adminManager
    }).
    when("/client/:id", {
          template: JST["app/templates/editclient"],
          controller: "EditClientController",
          resolve: routeRoleChecks.adminManager
    }).
    when("/clientinfo/:id", {
          template: JST["app/templates/viewclientinfo"],
          controller: "ShowClientController",
          resolve: routeRoleChecks.adminManager
    }).
    when("/timeslot", {
          template: JST["app/templates/admins/timeslot"],
          controller: "TimeSlotController",
          resolve: routeRoleChecks.admin
    }).
    when("/myavailability", {
          template: JST["app/templates/employees/myavailability"],
          controller: "MyavailabilityController",
          resolve: routeRoleChecks.user
    })
    .when("/memolist", {
      template: JST["app/templates/memolist"],
      controller: "MemoListController",
      resolve: routeRoleChecks.adminManagerUser
    })
    .when("/addmemo", {
      template: JST["app/templates/addmemo"],
      controller: "AddMemoController",
      resolve: routeRoleChecks.adminManager
    })
    .when("/memo/:id", {
      template: JST["app/templates/viewmemo"],
      controller: "ViewMemoController",
      resolve: routeRoleChecks.adminManagerUser
    })
    .when("/timeoffrequest", {
      template: JST["app/templates/employees/timeoffrequest"],
      controller: "timeoffRequestController",
      resolve: routeRoleChecks.user
    })
    .when("/timeofflist", {
      template: JST["app/templates/managers/timeofflist"],
      controller: "timeoffRequestController",
      resolve: routeRoleChecks.adminManager
    })
    .when("/timeoffdetail/:id", {
      template: JST["app/templates/managers/timeoffdetail"],
      controller: "timeoffRequestController",
      resolve: routeRoleChecks.adminManager
    })
    .when("/viewticket", {
      template: JST["app/templates/admins/viewticket"],
      controller: "ticketSysController",
      resolve: routeRoleChecks.adminManager
    })
    .when("/addticket", {
      template: JST["app/templates/admins/addticket"],
      controller: "ticketSysController",
      resolve: routeRoleChecks.adminManager
    })
    .when("/viewpayrolllist", {
      template: JST["app/templates/hr/viewpayrolllist"],
      controller: "payrollController",
      resolve: routeRoleChecks.hr
    })
    .when("/addpayroll", {
      template: JST["app/templates/hr/addpayroll"],
      controller: "payrollController",
      resolve: routeRoleChecks.hr
    })
    .when("/eventcalendar", {
          template: JST["app/templates/eventcalendar"],
          controller: "EventCalendarController",
          resolve: routeRoleChecks.adminManager
    })
    .otherwise({ redirectTo: function() {
        window.location = "/login";
      }
    });
    
    $locationProvider.html5Mode(true);
});

angular.module("app").run(function($rootScope, $location, NotificationService) {
  $rootScope.$on("$routeChangeError", function(event, current, previous, rejection) {
    if (rejection === "Not Authorized") {
      NotificationService.notify("You are not authorized to view the content.");
      //$location.path("/login");
      window.location = "/login";
    }
  });
});
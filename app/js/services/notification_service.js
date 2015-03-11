angular.module("app").value("toastr", toastr);

angular.module("app").factory("NotificationService", function(toastr) {
  return {
    notify: function(msg, type) {
      switch (type) {
        case "error":
          toastr.error(msg);
          break;
        
        case "warning":
          toastr.warning(msg);
          break;

        case "success":
          toastr.success(msg);
          break;

        default:
          toastr.success(msg);
          break;
      }
    }
  };
});
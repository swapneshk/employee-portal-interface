angular.module("app").factory("EmployeescheduleService", function($http,SessionService, User,$location) {
  return {
    loadSchedules: function () {
      
      
      var promise = $http.get('/api/getemployeeSchedule/'+SessionService.currentUser._id).then(function(response){
			var events = [];
			if ( "200" === response.data.status_code) {
				var allSchedules = response.data;
				 for(var i=0;i<allSchedules.data.length;i++){
				     events.push({"start":allSchedules.data[i].currDate,"title":'Scheduled',"className": "bg-blue"});
				    // events.push({"title": "Hello World2","start": "Wed, 15 Oct 2014 09:00:00","belongsto" : "list 1","className":"bg-blue"});
				 }
			}
			
                        return events;
      });
      
      return promise
    }
  };
  
});
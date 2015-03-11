angular.module("app").controller("EventCalendarController", function($scope, NotificationService,TimeSlotResource, $http,$q,sidepanelactiveService, SessionService) {
	var $modal = $('#event-modal');
	sidepanelactiveService.test();
	if( "admin" === SessionService.currentUser.roles[0] ) {
            
	    var events = [];
	    // CODE TO FETCH COMPLETE LIST FOR ADMIN
	    $http.get("/api/events").then(function(response){
		if ( "200" === response.data.status_code) {
		    response.data.events.forEach(function(elem, key){
			var event_details = [];
			var loc_city = (elem.location_address!=undefined)?elem.location_address.city:'';
			var contact_phone = (elem.event_data!=undefined)?elem.event_data.contact_phone:'';
			event_details.push({eventName:elem.name,description:elem.description,location:loc_city,contactPhone:contact_phone,shiftStartTime:elem.shiftstarttime,shiftEndTime:elem.shiftendtime});
			events.push({start:new Date(elem.start_date),end: new Date(elem.end_date),title:elem.name,className: "bg-orange","allData":event_details,"shiftData":elem.shift_template_id,eventid:elem._id});
		    });
		    console.log(events);
		}
		
		else {
		    toastr.error("Unable to fetch list this time!!");
		}
		var calendar = $('#calendar').fullCalendar({
		    events : events,
		    eventClick: function (calEvent, jsEvent, view) {
			$scope.$apply(function () {
				$scope.scheduledData = calEvent.allData;
				$scope.shiftData = calEvent.shiftData;
				$scope.start_date = new Date(calEvent.start);
				$scope.end_date = new Date(calEvent.end);
				eventId = calEvent.eventid;
				$http.post("/api/otherEmpOnEventsNoShift",{event:eventId}).then(function(innerresponse){
				    if ( "200" === innerresponse.data.status_code) {
					    if (typeof innerresponse.data!="undefined") {
						    var empidarr = [];
						    innerresponse.data.data.forEach(function(elem, key){
							if (empidarr.indexOf(elem.employee_id._id) != -1) {
							    innerresponse.data.data.splice(key,1);
							}else{
							    empidarr.push(elem.employee_id._id);
							}
						    });
						    $scope.sameemployees = innerresponse.data.data;
					    }else{
						    var sameemployees = {};
					    }
				    }
				}); 
			});
			$modal.modal();
		    }
		});
	    })
	}
        
        if(  "manager" === SessionService.currentUser.roles[0] ) {
            
	    var events = [];
	    // CODE TO FETCH COMPLETE LIST FOR ADMIN
	    $http.post("/api/managerevents", {manager_id: SessionService.currentUser._id}).then(function(response){
		if ( "200" === response.data.status_code) {
		    response.data.events.forEach(function(elem, key){
			var event_details = [];
			var loc_city = (elem.location_address!=undefined)?elem.location_address.city:'';
			var contact_phone = (elem.event_data!=undefined)?elem.event_data.contact_phone:'';
			event_details.push({eventName:elem.name,description:elem.description,location:loc_city,contactPhone:contact_phone,shiftStartTime:elem.shiftstarttime,shiftEndTime:elem.shiftendtime});
			events.push({start:new Date(elem.start_date),end: new Date(elem.end_date),title:elem.name,className: "bg-orange","allData":event_details,"shiftData":elem.shift_template_id,eventid:elem._id});
		    });
		    console.log(events);
		}
		
		else {
		    toastr.error("Unable to fetch list this time!!");
		}
		var calendar = $('#calendar').fullCalendar({
		    events : events,
		    eventClick: function (calEvent, jsEvent, view) {
			$scope.$apply(function () {
				$scope.scheduledData = calEvent.allData;
				$scope.shiftData = calEvent.shiftData;
				$scope.start_date = new Date(calEvent.start);
				$scope.end_date = new Date(calEvent.end);
				eventId = calEvent.eventid;
				$http.post("/api/otherEmpOnEventsNoShift",{event:eventId}).then(function(innerresponse){
				    if ( "200" === innerresponse.data.status_code) {
					    if (typeof innerresponse.data!="undefined") {
						    var empidarr = [];
						    innerresponse.data.data.forEach(function(elem, key){
							if (empidarr.indexOf(elem.employee_id._id) != -1) {
							    innerresponse.data.data.splice(key,1);
							}else{
							    empidarr.push(elem.employee_id._id);
							}
						    });
						    $scope.sameemployees = innerresponse.data.data;
					    }else{
						    var sameemployees = {};
					    }
				    }
				}); 
			});
			$modal.modal();
		    }
		});
	    })
	}
});
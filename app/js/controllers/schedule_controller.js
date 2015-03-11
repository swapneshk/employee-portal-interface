angular.module("app").controller("ScheduleController", function($scope, NotificationService,TimeSlotResource, $http,$q,sidepanelactiveService, SessionService) {

	// Show side panel active
	sidepanelactiveService.test();
	// Get data from TimeSlotResource
	TimeSlotResource.query(function(response){
	    $scope.slot = response[0];
	});
	//$scope.init = function(){
	var $modal = $('#event-modal');
	$('#external-events div.external-event').each(function () {
			// create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
			// it doesn't need to have a start or end
			var eventObject = {
				title: $.trim($(this).text()) // use the element's text as the event title
			};
			// store the Event Object in the DOM element so we can get to it later
			$(this).data('eventObject', eventObject);
			// make the event draggable using jQuery UI
			$(this).draggable({
				zIndex: 999,
				revert: true, // will cause the event to go back to its
				revertDuration: 20 //  original position after the drag
			});
	});	
		
	$http.get('/api/getemployeeSchedule/'+SessionService.currentUser._id).then(function(response){
			var events = [];
			var sameemployees = {};
			if ( "200" === response.data.status_code) {
				var allSchedules = response.data;
				 for(var i=0;i<allSchedules.data.length;i++){
					if (allSchedules.data[i].manager_schedule!==undefined) {
						if (allSchedules.data[i].manager_schedule.morning_schedule_details!==undefined || allSchedules.data[i].manager_schedule.afternoon_schedule_details!==undefined || allSchedules.data[i].manager_schedule.night_schedule_details!==undefined || allSchedules.data[i].manager_schedule.late_night_schedule_details!==undefined) {
							if (allSchedules.data[i].manager_schedule.morning_schedule_details!==undefined) {
								var starttime = new Date(allSchedules.data[i].currDate).toString();
								var starttime_m = starttime.replace("00:00:00",$scope.slot.morning_start_time+':00 '+$scope.slot.morning_start_period);
								var endtime = new Date(allSchedules.data[i].currDate).toString();
								var endtime_m = starttime.replace("00:00:00",$scope.slot.morning_end_time+':00 '+$scope.slot.morning_end_period);
								if(allSchedules.data[i].manager_schedule.morning_schedule_details.event) {
									var title = 'Morning : '+allSchedules.data[i].manager_schedule.morning_schedule_details.event.name;
									events.push({start:starttime_m,end: endtime_m,title:title,className: "bg-blue","allData":allSchedules.data[i].manager_schedule,"shift":"morning","origDate":allSchedules.data[i].currDate});	//code	//code
								}
							}
							if (allSchedules.data[i].manager_schedule.afternoon_schedule_details!==undefined) {
								var starttime = new Date(allSchedules.data[i].currDate).toString();
								var starttime_m = starttime.replace("00:00:00",$scope.slot.afternoon_start_time+':00 '+$scope.slot.afternoon_start_period);
								var endtime = new Date(allSchedules.data[i].currDate).toString();
								var endtime_m = starttime.replace("00:00:00",$scope.slot.afternoon_end_time+':00 '+$scope.slot.afternoon_end_period);
								if (allSchedules.data[i].manager_schedule.afternoon_schedule_details.event) {
									var title = 'Afternoon : '+allSchedules.data[i].manager_schedule.afternoon_schedule_details.event.name;
									events.push({start:starttime_m,end: endtime_m,title:title,className: "bg-orange","allData":allSchedules.data[i].manager_schedule,"shift":"afternoon","origDate":allSchedules.data[i].currDate});	//code	//code
								}
							}
							if (allSchedules.data[i].manager_schedule.night_schedule_details!==undefined) {
								var starttime = new Date(allSchedules.data[i].currDate).toString();
								var starttime_m = starttime.replace("00:00:00",$scope.slot.night_start_time+':00 '+$scope.slot.night_start_period);
								var endtime = new Date(allSchedules.data[i].currDate).toString();
								var endtime_m = starttime.replace("00:00:00",$scope.slot.night_end_time+':00 '+$scope.slot.night_end_period);
								if (allSchedules.data[i].manager_schedule.night_schedule_details.event) {
									var title = 'Night : '+allSchedules.data[i].manager_schedule.night_schedule_details.event.name;
									events.push({start:starttime_m,end: endtime_m,title:title,className: "bg-gray","allData":allSchedules.data[i].manager_schedule,"shift":"night","origDate":allSchedules.data[i].currDate});
								}
							}
							if (allSchedules.data[i].manager_schedule.late_night_schedule_details!==undefined) {
								var starttime = new Date(allSchedules.data[i].currDate).toString();
								var starttime_m = starttime.replace("00:00:00",$scope.slot.late_night_start_time+':00 '+$scope.slot.late_night_start_period);
								var endtime = new Date(allSchedules.data[i].currDate).toString();
								var endtime_m = starttime.replace("00:00:00",$scope.slot.late_night_end_time+':00 '+$scope.slot.late_night_end_period);
								if (allSchedules.data[i].manager_schedule.late_night_schedule_details.event) {
									var title = 'Late Night : '+allSchedules.data[i].manager_schedule.late_night_schedule_details.event.name;
									events.push({start:starttime_m,end: endtime_m,title:title,className: "bg-dark","allData":allSchedules.data[i].manager_schedule,"shift":"latenight","origDate":allSchedules.data[i].currDate});
								}
							}
						}
					}
				 }
			}
			
			/*  Initialize the calendar  */
			var date = new Date();
			var d = date.getDate();
			var m = date.getMonth();
			var y = date.getFullYear();
			var form = '';
			var calendar = $('#calendar').fullCalendar({
					slotDuration: '00:30:00', /* If we want to split day time each 15minutes */
					minTime: '00:00:00',
					maxTime: '24:00:00',          
					header: {
							left: 'prev,next today',
							right: 'month,agendaWeek,agendaDay',
							center: 'title'
					},
					// LOAD DATA IN THIS GRID - SWAPNESH
					events: events,
					eventClick: function (calEvent, jsEvent, view) {
						$scope.$apply(function () {
							$scope.scheduledData = calEvent.allData;
							$scope.shiftData = calEvent.shift;
							if (calEvent.shift == 'morning') {
								eventId = calEvent.allData.morning_schedule_details.event._id;
							}
							if (calEvent.shift == 'afternoon') {
								eventId = calEvent.allData.afternoon_schedule_details.event._id;
							}
							if (calEvent.shift == 'night') {
								eventId = calEvent.allData.night_schedule_details.event._id;
							}
							if (calEvent.shift == 'latenight') {
								eventId = calEvent.allData.late_night_schedule_details.event._id;
							}
							$http.post("/api/otherEmpOnEvents",{event:eventId,shift:calEvent.shift,currDate:calEvent.origDate,curremployee:SessionService.currentUser._id}).then(function(innerresponse){
									if ( "200" === innerresponse.data.status_code) {
										if (typeof innerresponse.data!="undefined") {
											$scope.sameemployees = innerresponse.data.data;
										}else{
											var sameemployees = {};
										}
									}
							}); 
						});
						$modal.modal();
					},
			});
	});
	//};
});
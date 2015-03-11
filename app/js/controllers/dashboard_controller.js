angular.module("app").controller("DashboardController", function($scope, SessionService,TimeSlotResource, $location, $timeout, SocketService, sidepanelactiveService, getweekService, $http, $q) {
	 $("[data-toggle=popover]").popover();
         $scope.popover = {
           "title": "Title",
           "content": "Hello Popover<br />This is a multiline message!"
         };
	$scope.humanReadableToMinutes = function humanReadableToMinutes(time)
	{
	    var parts = time.split(/ |:/);
	    return (parts[2] == 'pm' * 12 * 60) + parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
	}
	// On First Time Login
	var locVal = $location.search();
	if( "true" === locVal.loggedin )
	sidepanelactiveService.test();	
	//console.clear();
	console.log(SessionService.currentUser);
	$scope.siteurl = $location.absUrl().split(":8000/")[0];
	$scope.role = '';
	$scope.fullName = SessionService.currentUser.first_name + ' ' + SessionService.currentUser.last_name;
	$scope.userFullData = SessionService.currentUser;
	$scope.password_change = SessionService.currentUser.password_change;
	$scope.prof_image = SessionService.currentUser.prof_image || "test";
	$scope.user = SessionService.currentUser;
	$scope.pagetitle = function(pagetitle){
		$scope.title = pagetitle;
		$timeout(function(){
		if ("My Schedule" === $scope.title) {
				
		}
		},1)
	};
	
	
	if($location.path() === '/dashboard'){
		$scope.title = 'Dashboard';
	}
	else if($location.path() === '/myavailability'){
		$scope.title = 'My Availability';
	}
	else if($location.path() === '/viewschedule'){
		$scope.title = 'My Schedule';
	}
	else if($location.path() === '/memolist'){
		$scope.title = 'Memos';
	}
	else if($location.path() === '/timeslot'){
		$scope.title = 'Time Slot';
	}
	else if($location.path() === '/eventlist'){
		$scope.title = 'Event';
	}
	else if($location.path() === '/timeofflist'){
		$scope.title = 'Time Off Requests';
	}
	else if($location.path() === '/viewticket'){
		$scope.title = 'Ticket Counts';
	}
	else if($location.path() === '/viewpayrolllist'){
		$scope.title = 'Payrolls';
	}
	else if($location.path() === '/viewadminclient' || $location.path() === '/viewmanagerclient'){
		$scope.title = 'Client';
	}
	else if($location.path() === '/viewadminemployee' || $location.path() === '/viewmanageremployee'){
		$scope.title = 'Employee';
	}
	
	$scope.isActive = function(route) {
		return route === $location.path();
	};
	
	
	if(SessionService.currentUser.roles.indexOf('admin') > -1)
		$scope.role = 'admin';
	else if(SessionService.currentUser.roles.indexOf('manager') > -1)
		$scope.role = 'manager';
	else if(SessionService.currentUser.roles.indexOf('employee') > -1)
		$scope.role = 'employee';
	else if(SessionService.currentUser.roles.indexOf('hr') > -1)
		$scope.role = 'hr';
		
	// Code for realtime notifications
	if (SessionService.currentUser._id) {
			/*
			var socket = io('http://localhost:6868');
			socket.emit('get notifications', {user_id: SessionService.currentUser._id});
			
			socket.on('notification data', function(data){
					$scope.$apply(function() {
							$scope.notifications = data;
							$scope.notificationCount = data.length;
					});
			});
			*/
			SocketService.emit('get notifications', {user_id: SessionService.currentUser._id});
			SocketService.on('notification data', function(data){
					$scope.notifications = data;
					$scope.notificationCount = data.length;
			});
	}	
		
        if(SessionService.currentUser.roles[0] == 'employee'){
                  //Company Memos
                  $http.post("/api/getmemos", {userId: SessionService.currentUser._id, action: "empInboxMsgs"}).then(function(response){
                          if( "200" === response.data.status_code ) {
                              response.data.data.forEach(function(elem, key){
                                  if (elem.description.length > 50) {
                                          elem.description = elem.description.substring(0,50)+' .....';
                                  }
                              });
                              $scope.allMemos = response.data.data;
                              
                              if ($scope.allMemos.length > 0)
                                  $scope.haveResult = true;
                              else
                                  $scope.haveResult = false;
                                  $scope.userRole = "other";
                                  $scope.msgsCount = $scope.allMemos.length;
                          };    
                  });
        }
	$scope.checkRead = function(userId, sent_to) {
		var testStr = true;
		for(var i=0; i<sent_to.length; i++) {
		  if( sent_to[i].user_id === userId ) {
		    testStr = sent_to[i].mark_read;
		    break;
		  }
		}
		return testStr;
	};
	$scope.markRead = function(memoId) {
		if ("admin" === SessionService.currentUser.roles[0]) {
		    $http.post("/api/markread", {memoId: memoId, user_role: "admin"}).then(function(response){
			console.log("MARK IT AS READ");
			console.log(response);
		    });
		}
		else {
		    $http.post("/api/markread", {memoId: memoId, user_role: "other", userId: SessionService.currentUser._id}).then(function(response){
			console.log("MARK IT AS READ");
			console.log(response);
		    });
		}
	};
        
        if(SessionService.currentUser.roles[0] == 'employee'){
                  // Get data from TimeSlotResource
                  TimeSlotResource.query(function(response){
                          $scope.slot = response[0];
                          var msttime = $scope.slot.morning_start_time+':00 '+$scope.slot.morning_start_period;
                          var mettime = $scope.slot.morning_end_time+':00 '+$scope.slot.morning_end_period;
                          var mtp = ($scope.humanReadableToMinutes(mettime) - $scope.humanReadableToMinutes(msttime))/60;
                          if (mtp < 0) {
                              $scope.morninghours = 12+mtp;
                          }else{
                              $scope.morninghours = mtp;
                          }
                          var asttime = $scope.slot.afternoon_start_time+':00 '+$scope.slot.afternoon_start_period;
                          var aettime = $scope.slot.afternoon_end_time+':00 '+$scope.slot.afternoon_end_period;
                          var atp = ($scope.humanReadableToMinutes(aettime) - $scope.humanReadableToMinutes(asttime))/60;
                          if (atp < 0) {
                              $scope.afternoonhours = 12+atp;
                          }else{
                              $scope.afternoonhours = atp;
                          }
                          var nsttime = $scope.slot.night_start_time+':00 '+$scope.slot.night_start_period;
                          var nettime = $scope.slot.night_end_time+':00 '+$scope.slot.night_end_period;
                          var ntp = ($scope.humanReadableToMinutes(nettime) - $scope.humanReadableToMinutes(nsttime))/60;
                          if (ntp < 0) {
                              $scope.nighthours = 12+ntp;
                          }else{
                              $scope.nighthours = ntp;
                          }
                          
                          var lnsttime = $scope.slot.late_night_start_time+':00 '+$scope.slot.late_night_start_period;
                          var lnettime = $scope.slot.late_night_end_time+':00 '+$scope.slot.late_night_end_period;
                          var lntp = ($scope.humanReadableToMinutes(lnettime) - $scope.humanReadableToMinutes(lnsttime))/60;
                          if (lntp < 0) {
                              $scope.latenighthours = 12+lntp;
                          }else{
                              $scope.latenighthours = lntp;
                          }
                    
                          var mymodel = [];
                          var monthNames = [ "Jan", "Feb", "Mar", "April", "May", "June", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec" ];
                          $scope.myData = function() {
                                  var deferred = $q.defer();
                                      $http.post("/api/dailyWorkHours", {_id: SessionService.currentUser._id,currDate:new Date()}).then(function(response){
                                          $scope.workhours = response.data.data;
                                              deferred.resolve();
                                      });
                                  return deferred.promise;
                          };
                          $scope.myData().then(function() {
                                  $scope.workhours.sort(function(a, b){ var dateA = new Date(a.currDate); var dateB = new Date(b.currDate); return dateA-dateB;});
                                  for(var i=0;i<$scope.workhours.length;i++){
                                          var currdate = new Date($scope.workhours[i].currDate).toString();
                                          var modifydate = monthNames[new Date(currdate).getMonth()]+new Date(currdate).getDate();
                                          var total_hours = 0;
                                          if ($scope.workhours[i].manager_schedule) {
                                                  if(($scope.workhours[i].manager_schedule.morning_schedule_details!=undefined) && ($scope.workhours[i].manager_schedule.morning_schedule_details.event)){
                                                    var total_hours = total_hours + $scope.morninghours;
                                                  }
                                                  if(($scope.workhours[i].manager_schedule.afternoon_schedule_details!=undefined) && ($scope.workhours[i].manager_schedule.afternoon_schedule_details.event)) {
                                                    var total_hours = total_hours + $scope.afternoonhours;
                                                  }
                                                  if(($scope.workhours[i].manager_schedule.night_schedule_details!=undefined) && ($scope.workhours[i].manager_schedule.night_schedule_details.event)) {
                                                    var total_hours = total_hours + $scope.nighthours;
                                                  }
                                                  if(($scope.workhours[i].manager_schedule.late_night_schedule_details!=undefined) && ($scope.workhours[i].manager_schedule.late_night_schedule_details.event)) {
                                                    var total_hours = total_hours + $scope.latenighthours;
                                                  }
                                          }
                                          mymodel.push({total_work_hours: total_hours, selectDate: modifydate});
                                  }
                                  $scope.xkey = 'selectDate';
                                  $scope.chk = 'daily';
                                  $scope.ykeys = ['total_work_hours'];
                                  $scope.labels = ['Work Hours'];
                                  $scope.myModel = mymodel;
                          });
                  });
        }
	$scope.fetchdatatype = 'today';
	$scope.worktype = function(ty) {
		$scope.fetchdatatype = ty;    
	}
	if (SessionService.currentUser.roles[0] == 'admin' || SessionService.currentUser.roles[0] == 'manager') {
		var currWeekDates = getweekService.getCurrWeek();
		$scope.$watch('fetchdatatype', function() {
			var ty = $scope.fetchdatatype;
			var buttons = angular.element('.ui-controlgroup-controls .ui-checkbox label');
			for(var i=0;i<buttons.length;i++){
			     if(buttons.get(i).id == ty){
				 angular.element(".ui-controlgroup-controls .ui-checkbox label[id!='"+ty+"']").removeClass("ui-btn-active");
				 angular.element(".ui-controlgroup-controls .ui-checkbox label[id='"+ty+"']").addClass("ui-btn-active");
			     }
			}
			if (ty == 'today') {
				$http.post('/api/getschedulecount', {_id: SessionService.currentUser._id,currDate:new Date(),fetchtype:'today'}).then(function(response){
					$scope.todayevents = response.data.data;
				});
			}
			if (ty == 'week') {
				$http.post('/api/getschedulecount', {_id: SessionService.currentUser._id,currDate:new Date(),fetchtype:'week', startWeek:currWeekDates[0], endWeek:currWeekDates[1]}).then(function(response){
					$scope.todayevents = response.data.data;
				});
			}
			if (ty == 'month') {
				var date = new Date();
				var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
				var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
				$http.post('/api/getschedulecount', {_id: SessionService.currentUser._id,currDate:new Date(),fetchtype:'month',currMonthStartDate:firstDay, currMonthEndDate:lastDay}).then(function(response){
					$scope.todayevents = response.data.data;
				});
			}
		});
		var sevenWeekDayArr = new Array();
		for(var i=0; i<7; i++) {
		    sevenWeekDayArr[i] = new Date(currWeekDates[0].getTime() + i*86400000);
		}
		$scope.empids = [];
		if(SessionService.currentUser.roles[0] == 'admin'){
			$http.get('/api/getempl').then(function(empres){
				empres.data.data.forEach(function(elem, key){
					$scope.empids.push(elem._id);
				});
				$http.post('/api/checkmarkavailability', {empids:$scope.empids,startWeek:currWeekDates[0],endWeek:currWeekDates[1]}).then(function(chkmarkresponse){
				      if( "200" === chkmarkresponse.data.status_code ) {
					     chkmarkresponse.data.data.forEach(function(elem, key){
						if (elem.prof_image) {
							var prof_image = $scope.siteurl+":3030/public/"+elem.prof_image;
						}else{
							var prof_image = "assets/img/avatars/avatar2.png";
						}
						elem.prof_image = '<img src="'+prof_image+'"/ width="35" class="pull-left" alt="avatar1">';
					    });
				      }
				      $scope.employeelist =  chkmarkresponse.data.data;
				});
				
				$http.post('/api/checkloggedin', {empids:$scope.empids}).then(function(checkloggedinresponse){
				      if( "200" === checkloggedinresponse.data.status_code ) {
					    checkloggedinresponse.data.data.forEach(function(elem, key){
						if (elem.prof_image) {
							var prof_image = $scope.siteurl+":3030/public/"+elem.prof_image;
						}else{
							var prof_image = "assets/img/avatars/avatar2.png";
						}
						elem.prof_image = prof_image;
						var loggincolor = (elem.logged_in === true) ? 'limegreen':'lightgray';
						elem.logged_in = loggincolor;
					    });
				      }
				      $scope.loggedemployeelist =  checkloggedinresponse.data.data;
				});
			});
		}
		
		if(SessionService.currentUser.roles[0] == 'manager'){
			$http.post('/api/getmanagerempl',{manager_id : SessionService.currentUser._id}).then(function(empres){
				empres.data.data.forEach(function(elem, key){
					$scope.empids.push(elem._id);
				});
				$http.post('/api/checkmarkavailability', {empids:$scope.empids,startWeek:currWeekDates[0],endWeek:currWeekDates[1]}).then(function(chkmarkresponse){
				      if( "200" === chkmarkresponse.data.status_code ) {
					     chkmarkresponse.data.data.forEach(function(elem, key){
						if (elem.prof_image) {
							var prof_image = $scope.siteurl+":3030/public/"+elem.prof_image;
						}else{
							var prof_image = "assets/img/avatars/avatar2.png";
						}
						elem.prof_image = '<img src="'+prof_image+'"/ width="40px" height="40px" alt="avatar1">';
					    });
				      }
				      $scope.employeelist =  chkmarkresponse.data.data;
				});
				
				$http.post('/api/checkloggedin', {empids:$scope.empids}).then(function(checkloggedinresponse){
				      if( "200" === checkloggedinresponse.data.status_code ) {
					    checkloggedinresponse.data.data.forEach(function(elem, key){
						if (elem.prof_image) {
							var prof_image = $scope.siteurl+":3030/public/"+elem.prof_image;
						}else{
							var prof_image = "assets/img/avatars/avatar2.png";
						}
						elem.prof_image = prof_image;
						var loggincolor = (elem.logged_in === true) ? 'limegreen':'lightgray';
						elem.logged_in = loggincolor;
					    });
					     
				      }
				      $scope.loggedemployeelist =  checkloggedinresponse.data.data;
				});
			});
		}
	}		
});


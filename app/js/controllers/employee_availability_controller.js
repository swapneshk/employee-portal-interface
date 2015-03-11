angular.module("app").controller("EmployeeAvailabilityController", function($scope, SessionService, $http, $routeParams,$q, sidepanelactiveService, getweekService) {
    
    // Show side panel active
    sidepanelactiveService.test();
    var currWeekDates = getweekService.getCurrWeek();
    $scope.currWeekDate = currWeekDates;
    $scope.data = "fds";
    var selectedIdStr = $routeParams.id;
    var selectedId = selectedIdStr.substr(1);
    $scope.currDate = new Date().getTime();
    $scope.todayDate = new Date();
    $scope.EventAssignment = {};
    $scope.showRemoveButton = true;
    $scope.assignedData = function(dte,shift,chkstatus,position,datestatus){
        $scope.EventAssignment.assigned_date = dte;
        $scope.EventAssignment.assigned_shift = shift;
        $scope.EventAssignment.assigned_index = position;
        if (datestatus < -1) {
            $scope.date_status = false;
        }
        if (datestatus >= -1) {
            $scope.date_status = true;
        }
        if ("admin" === SessionService.currentUser.roles[0]) {
           $http.get("/api/events").then(function(response){
                if ( "200" === response.data.status_code) {
                    $scope.allEvents = response.data.events;
                    $scope.showRemoveButton = true;
                    for(var i=0;i<$scope.allEvents.length;i++){
                         if ($scope.allEvents[i]._id == chkstatus) {
                             $scope.EventAssignment.event_id = $scope.allEvents[i];
                             break;
                         }
                    }
                    if (chkstatus == 'new') {
                         $scope.EventAssignment.event_id = $scope.allEvents[0];
                         $scope.showRemoveButton = false;
                    }
                } 
            });
        }
        
        if ("manager" === SessionService.currentUser.roles[0]) {
            $http.post("/api/managerevents",{manager_id:SessionService.currentUser._id}).then(function(response){
                if ( "200" === response.data.status_code) {
                    $scope.allEvents = response.data.events;
                    $scope.showRemoveButton = true;
                    for(var i=0;i<$scope.allEvents.length;i++){
                         if ($scope.allEvents[i]._id == chkstatus) {
                             $scope.EventAssignment.event_id = $scope.allEvents[i];
                             break;
                         }
                    }
                    if (chkstatus == 'new') {
                         $scope.EventAssignment.event_id = $scope.allEvents[0];
                         $scope.showRemoveButton = false;
                    }
                } 
            });
        }
        
    }
    
    /*Update employee availability by manager*/
    $scope.updateEmployeeavailability = function(dte,shift,position,evt){
        var checkedVal = evt.target.checked;
        $http.post("/api/updateAvailability",{assignDate : new Date(dte).toUTCString(),assignShift : shift,modified_date : new Date(), modified_by : SessionService.currentUser._id,employee_availability:checkedVal, employee_id:selectedId}).then(function(response){
                     toastr.success("Employee Availability Successfully Updated!");  
        });
        
    }
    $scope.saveAssignment = function(assignEvent){
        $http.post("/api/assignment",{event_id : assignEvent.event_id._id, assignDate : new Date(assignEvent.assigned_date).toUTCString(),assignShift : assignEvent.assigned_shift,modified_date : new Date(), modified_by : SessionService.currentUser._id,employee_id:selectedId}).then(function(response){
                    toastr.success("Event Successfully Aligned!");
                    if (assignEvent.assigned_shift == 'morning') {
                        $scope.availability[assignEvent.assigned_index].is_morning_scheduled_confirmation = true;
                        $scope.availability[assignEvent.assigned_index].is_morning_scheduled_event = assignEvent.event_id._id;
                    }
                    if (assignEvent.assigned_shift == 'afternoon') {
                        $scope.availability[assignEvent.assigned_index].is_afternoon_scheduled_confirmation = true;
                        $scope.availability[assignEvent.assigned_index].is_afternoon_scheduled_event = assignEvent.event_id._id;
                    }
                    if (assignEvent.assigned_shift == 'night') {
                        $scope.availability[assignEvent.assigned_index].is_night_scheduled_confirmation = true;
                        $scope.availability[assignEvent.assigned_index].is_night_scheduled_event = assignEvent.event_id._id;
                    }
                    if (assignEvent.assigned_shift == 'latenight') {
                        $scope.availability[assignEvent.assigned_index].is_late_night_scheduled_confirmation = true;
                        $scope.availability[assignEvent.assigned_index].is_late_night_scheduled_event = assignEvent.event_id._id;
                    }
        });
    }
    $scope.removeAssignment = function(assignEvent){
         $http.post("/api/removeAssignedEvent",{event_id : assignEvent.event_id._id, assignDate : new Date(assignEvent.assigned_date).toUTCString(),assignShift : assignEvent.assigned_shift,modified_date : new Date(), modified_by : SessionService.currentUser._id,employee_id:selectedId}).then(function(response){
                    toastr.success("Event Alignment Successfully Removed!");
                    if (assignEvent.assigned_shift == 'morning') {
                        $scope.availability[assignEvent.assigned_index].is_morning_scheduled_confirmation = false;
                        $scope.availability[assignEvent.assigned_index].is_morning_scheduled_event = '';
                    }
                    if (assignEvent.assigned_shift == 'afternoon') {
                        $scope.availability[assignEvent.assigned_index].is_afternoon_scheduled_confirmation = false;
                        $scope.availability[assignEvent.assigned_index].is_afternoon_scheduled_event = '';
                    }
                    if (assignEvent.assigned_shift == 'night') {
                        $scope.availability[assignEvent.assigned_index].is_night_scheduled_confirmation = false;
                        $scope.availability[assignEvent.assigned_index].is_night_scheduled_event = '';
                    }
                    if (assignEvent.assigned_shift == 'latenight') {
                        $scope.availability[assignEvent.assigned_index].is_late_night_scheduled_confirmation = false;
                        $scope.availability[assignEvent.assigned_index].is_late_night_scheduled_event = '';
                    } 
        });
        
    }
    $(document).ready(function(){
        var today = new Date();
        var now = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        var dt = new Date();
        dt.setDate(dt.getDate()-1);
        //$(".datepicker").datetimepicker();
    });
    $http.get('/api/users/:'+selectedId).then(function(response){
        $scope.userdetail = response.data;
    });
    
    $scope.fetchRangeData = function() {
        $scope.fetchoffset = new Date().getTime();    
    }
    $scope.$watch('fetchoffset', function() {
        
        if($scope.dateRange == null){
            var StartDate = currWeekDates[0];
            var EndDate = currWeekDates[1];
        }else{
            var StartDate = new Date($scope.dateRange.start_date);
            var EndDate = new Date($scope.dateRange.end_date);
        }
        if (StartDate && EndDate) {
             var diff = (new Date(EndDate.getTime()) - new Date(StartDate.getTime()))/86400000;
        }
        if (diff<0) {
            toastr.error('End date should be greater than start date.');
            return false;
        }
        if (StartDate == 'Invalid Date') {
            toastr.error('Please Enter Start Date');
            return false;
        }
        if (EndDate == 'Invalid Date') {
            toastr.error('Please Enter End Date');
            return false;
        }
        var sevenWeekDayArr = [];
        for(var i=0; i<= diff; i++) {
            sevenWeekDayArr[i] = new Date(StartDate.getTime() + i*86400000);
            sevenWeekDayArr[i].differ = Math.floor((new Date(StartDate.getTime() + i*86400000) - new Date().getTime())/86400000);
        }
        $scope.sevenWeekDayArr = sevenWeekDayArr;
        $scope.dateWiseData = [];
        var x = 0;
        $scope.myData = function() {
            var deferred = $q.defer();
            for (var i=0; i<= diff;i++) {
                $http.post('/api/dayavailability', {_id: selectedId, weekDay: sevenWeekDayArr[i]}).then(function(response){
                    tmpArr = response.data;
                    if ( x <= diff ) {
                        $scope.dateWiseData.push(tmpArr);
                    }
                    if(x==diff) {
                        deferred.resolve();
                    }
                    x++;
                });
            }
            return deferred.promise;
        };
        $scope.myData().then(function() {
                $scope.dateWiseData.sort(function(a, b){ var dateA = new Date(a.currDate); var dateB = new Date(b.currDate); return dateA-dateB;});
                var lclDateArr = [];
                lclDateArr = $scope.dateWiseData;
                $scope.availability = [];
                var tmpArr = [];
                for(var i=0; i<=diff; i++) {
                    if (!lclDateArr[i].manager_schedule) {
                       lclDateArr[i].manager_schedule = {};
                    }
                    if (lclDateArr[i].manager_schedule && !lclDateArr[i].manager_schedule.morning_schedule_details) {
                       lclDateArr[i].manager_schedule.morning_schedule_details = {};
                    }
                    
                    if (lclDateArr[i].manager_schedule && !lclDateArr[i].manager_schedule.afternoon_schedule_details) {
                       lclDateArr[i].manager_schedule.afternoon_schedule_details = {};
                    }
                    
                    if (lclDateArr[i].manager_schedule && !lclDateArr[i].manager_schedule.night_schedule_details) {
                       lclDateArr[i].manager_schedule.night_schedule_details = {};
                    }
                    
                    if (lclDateArr[i].manager_schedule && !lclDateArr[i].manager_schedule.late_night_schedule_details) {
                       lclDateArr[i].manager_schedule.late_night_schedule_details = {};
                    }
                    
                    if (lclDateArr[i].manager_schedule ) {
                        tmpArr.push({currDate: new Date(lclDateArr[i].currDate).toString(), is_morning_scheduled: lclDateArr[i].is_morning_scheduled, is_afternoon_scheduled: lclDateArr[i].is_afternoon_scheduled, is_night_scheduled: lclDateArr[i].is_night_scheduled, is_late_night_scheduled: lclDateArr[i].is_late_night_scheduled,is_morning_scheduled_confirmation: lclDateArr[i].manager_schedule.morning_schedule_details.is_morning_scheduled, is_afternoon_scheduled_confirmation: lclDateArr[i].manager_schedule.afternoon_schedule_details.is_afternoon_scheduled, is_night_scheduled_confirmation: lclDateArr[i].manager_schedule.night_schedule_details.is_night_scheduled, is_late_night_scheduled_confirmation: lclDateArr[i].manager_schedule.late_night_schedule_details.is_late_night_scheduled,is_morning_scheduled_event: lclDateArr[i].manager_schedule.morning_schedule_details.event, is_afternoon_scheduled_event: lclDateArr[i].manager_schedule.afternoon_schedule_details.event, is_night_scheduled_event: lclDateArr[i].manager_schedule.night_schedule_details.event, is_late_night_scheduled_event: lclDateArr[i].manager_schedule.late_night_schedule_details.event});
                    }else{
                        tmpArr.push({currDate: new Date(lclDateArr[i].currDate).toString(), is_morning_scheduled: lclDateArr[i].is_morning_scheduled, is_afternoon_scheduled: lclDateArr[i].is_afternoon_scheduled, is_night_scheduled: lclDateArr[i].is_night_scheduled, is_late_night_scheduled: lclDateArr[i].is_late_night_scheduled,is_morning_scheduled_confirmation: false, is_afternoon_scheduled_confirmation: false, is_night_scheduled_confirmation: false, is_late_night_scheduled_confirmation: false,is_morning_scheduled_event:'', is_afternoon_scheduled_event: '', is_night_scheduled_event: '', is_late_night_scheduled_event: ''});
                    }
                    
                }
                tmpArr.sort(function(a, b){ var dateA = new Date(a.currDate); var dateB = new Date(b.currDate); return dateA-dateB;});
                $scope.availability = tmpArr;
        });
    });
    
     $scope.submitAvailability = function(weekAvailability){
        for(var i=0; i< weekAvailability.length; i++){
            if("admin" === SessionService.currentUser.roles[0]){
                weekAvailability[i].employee_id = selectedId;
                weekAvailability[i].currDate = new Date(weekAvailability[i].currDate).toUTCString();
                weekAvailability[i].is_morning_scheduled = (undefined === weekAvailability[i].is_morning_scheduled)? false : weekAvailability[i].is_morning_scheduled;
                weekAvailability[i].is_afternoon_scheduled = (undefined === weekAvailability[i].is_afternoon_scheduled)? false : weekAvailability[i].is_afternoon_scheduled;
                weekAvailability[i].is_night_scheduled = (undefined === weekAvailability[i].is_night_scheduled)? false : weekAvailability[i].is_night_scheduled;
                weekAvailability[i].is_late_night_scheduled = (undefined === weekAvailability[i].is_late_night_scheduled)? false : weekAvailability[i].is_late_night_scheduled;
            }
            weekAvailability[i].manager_schedule.modified_date = new Date();
            weekAvailability[i].manager_schedule.modified_by = SessionService.currentUser._id;
        }
        // Save week availability
        $http.post('/api/weekavailability', weekAvailability).then(function(response){
            if("200" === response.data.status_code ) {
                toastr.success("Data successfully saved!");
            }
            else {
                toastr.error("Something went wrong, please re login");
            }
        });
    };
});
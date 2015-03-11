angular.module("app").controller("MyavailabilityController", function($scope, SessionService, TimeSlotResource,sidepanelactiveService, getweekService, $http, $q, $location) {
    $scope.user = SessionService.currentUser;    
    
    // Get data from TimeSlotResource
    TimeSlotResource.query(function(response){
        $scope.slot = response[0];
    });
    
    $scope.changeview = function(view){
        $location.path(view);
    };
    
    // Show side panel active
    sidepanelactiveService.test();
    // Create weeklist
    var currWeekDates = getweekService.getCurrWeek(),
        nextWeekDates = getweekService.getNextWeek(currWeekDates[1].getDay()+1),
        nextNextWeekDates = getweekService.getNextWeek(nextWeekDates[1].getDay()+8);
        nextNextNextWeekDates = getweekService.getNextWeek(nextWeekDates[1].getDay()+15);
        nextNextNextNextWeekDates = getweekService.getNextWeek(nextWeekDates[1].getDay()+22);
        nextNextNextNextNextWeekDates = getweekService.getNextWeek(nextWeekDates[1].getDay()+29);
        nextNextNextNextNextNextWeekDates = getweekService.getNextWeek(nextWeekDates[1].getDay()+36);
    
    // Create object to hold availability and is_scheduled
    $scope.availability = [];
    
    // Week day list based on currWeekDates
    var sevenWeekDayArr = new Array();
    for(var i=0; i<7; i++) {
        sevenWeekDayArr[i] = new Date(nextNextWeekDates[0].getTime() + i*86400000);
        $scope.availability.push({currDate: "", is_morning_scheduled: false, is_afternoon_scheduled: false, is_night_scheduled: false, is_late_night_scheduled: false});
    }
    console.clear();
//    console.log("--SEVEN WEEK DAY ARR--");
   // console.log(sevenWeekDayArr);
    $scope.sevenWeekDayArr = sevenWeekDayArr;
    
    // Show 5 week in buttons
    $scope.weeklist = [nextNextWeekDates,nextNextNextWeekDates,nextNextNextNextWeekDates,nextNextNextNextNextWeekDates,nextNextNextNextNextNextWeekDates];
    
    $scope.showWeekDays = function(startDate, endDate, e) {
       var startdatetochangeformat = new Date(startDate);
       var formatteddate = startdatetochangeformat.getMonth()+1+'/'+startdatetochangeformat.getDate()+'/'+startdatetochangeformat.getFullYear().toString(10).substring(2, 4);
       var buttons = angular.element('ul li button');
       for(var i=0;i<buttons.length;i++){
            if(buttons.get(i).id == formatteddate){
                angular.element("ul li button[id!='"+formatteddate+"']").addClass("bg-blue");
                angular.element("ul li button[id='"+formatteddate+"']").removeClass("bg-blue");
                angular.element("ul li button[id='"+formatteddate+"']").addClass("label-success");
            }
       }
        var sevenWeekDayArr = [];
        $scope.availability = [];
        for(var i=0; i<7; i++) {
            sevenWeekDayArr[i] = new Date(startDate.getTime() + i*86400000);
            $scope.availability.push({currDate: "", is_morning_scheduled: false, is_afternoon_scheduled: false, is_night_scheduled: false, is_late_night_scheduled: false,is_morning_scheduled_confirmation:false});
        }

        $scope.sevenWeekDayArr = sevenWeekDayArr;
        /****************************************/
        
        $scope.dateWiseData = [];
        var x = 0;
        $scope.myData = function() {
            var deferred = $q.defer();
            for (var i=0; i< 7;i++) {
                $http.post('/api/dayavailability', {_id: SessionService.currentUser._id, weekDay: sevenWeekDayArr[i]}).then(function(response){
                    tmpArr = response.data;
                    if ( x < 7 ) {
                        $scope.dateWiseData.push(tmpArr);
                    }
                    if(x==6) {
                        deferred.resolve();
                    }
                    x++;
                });
            }
            return deferred.promise;
        };
    
        $scope.myData().then(function() {
            if ($scope.dateWiseData[0] !== "null") {
                $scope.dateWiseData.sort(function(a, b){ var dateA = new Date(a.currDate); var dateB = new Date(b.currDate); return dateA-dateB;});
                var lclDateArr = [];
                lclDateArr = $scope.dateWiseData;
        
                $scope.availability = [];
                var tmpArr = [];
                for(var i=0; i<7; i++) {
                    if (!lclDateArr[i].manager_schedule) {
                       lclDateArr[i].manager_schedule = {};
                    }
                    if (!lclDateArr[i].manager_schedule.morning_schedule_details) {
                       lclDateArr[i].manager_schedule.morning_schedule_details = {};
                    }
                    if (!lclDateArr[i].manager_schedule.afternoon_schedule_details) {
                       lclDateArr[i].manager_schedule.afternoon_schedule_details = {};
                    }
                    if (!lclDateArr[i].manager_schedule.night_schedule_details) {
                       lclDateArr[i].manager_schedule.night_schedule_details = {};
                    }
                    if (!lclDateArr[i].manager_schedule.late_night_schedule_details) {
                       lclDateArr[i].manager_schedule.late_night_schedule_details = {};
                    }
                    tmpArr.push({currDate: new Date(lclDateArr[i].currDate).toString(), is_morning_scheduled: lclDateArr[i].is_morning_scheduled, is_afternoon_scheduled: lclDateArr[i].is_afternoon_scheduled, is_night_scheduled: lclDateArr[i].is_night_scheduled, is_late_night_scheduled: lclDateArr[i].is_late_night_scheduled,is_morning_scheduled_confirmation: lclDateArr[i].manager_schedule.morning_schedule_details.is_morning_scheduled, is_afternoon_scheduled_confirmation: lclDateArr[i].manager_schedule.afternoon_schedule_details.is_afternoon_scheduled, is_night_scheduled_confirmation: lclDateArr[i].manager_schedule.night_schedule_details.is_night_scheduled, is_late_night_scheduled_confirmation: lclDateArr[i].manager_schedule.late_night_schedule_details.is_late_night_scheduled});
                }
                tmpArr.sort(function(a, b){ var dateA = new Date(a.currDate); var dateB = new Date(b.currDate); return dateA-dateB;});
                $scope.availability = tmpArr;
            }
            /*
            else {
                $scope.availability.push({currDate: "", is_morning_scheduled: false, is_afternoon_scheduled: false, is_night_scheduled: false, is_late_night_scheduled: false});
            }
            */
        });

        /****************************************/        
        
    };
    
    // Get Availability Data For The Employee From Availability Collection - 23-09-2014
    /*
    $http.post('/api/empweekavailability',{_id: SessionService.currentUser._id}).then(function(response){
        // Change UTC dates to Locale Date Strings
        for(var i=0; i< response.data.data.length; i++){
            response.data.data[i].currDate = new Date(response.data.data[i].currDate.toString());
        }
        console.log($scope.sevenWeekDayArr); 
    });
    */
    
    // Get weekwise availability for an employee - 24-09-2014
    
    /*****/
    $scope.dateWiseData = [];
    var x = 0;
    $scope.getData = function(){
        var deferred = $q.defer();
        for ( var i=0; i< 7; i++ ) {
            $http.post('/api/dayavailability', {_id: SessionService.currentUser._id, weekDay: $scope.sevenWeekDayArr[i]}).then(function(response){
            tmpArr = response.data;
            if ( x < 7 ) {
                $scope.dateWiseData.push(tmpArr);
            }
            if(x==6) {
                deferred.resolve();
            }
            x++;
            });
        }
        return deferred.promise;
    };
    
    $scope.getData().then(function() {
        console.log($scope.dateWiseData);
        if ($scope.dateWiseData[0] !== "null") {
            //console.clear();
            $scope.dateWiseData.sort(function(a, b){ var dateA = new Date(a.currDate); var dateB = new Date(b.currDate); return dateA-dateB;});
            //console.log($scope.dateWiseData);
            $scope.availability = [];
            //console.log($scope.availability);
            var lclDateArr = [];
            lclDateArr = $scope.dateWiseData;
    
            $scope.availability = [];
            var tmpArr = [];
            for(var i=0; i<7; i++) {
                //console.log(i);
                //tmpArr.push({currDate: new Date(lclDateArr[i].currDate).toString(), is_morning_scheduled: lclDateArr[i].is_morning_scheduled, is_afternoon_scheduled: lclDateArr[i].is_afternoon_scheduled, is_night_scheduled: lclDateArr[i].is_night_scheduled, is_late_night_scheduled: lclDateArr[i].is_late_night_scheduled});
                    if (!lclDateArr[i].manager_schedule) {
                       lclDateArr[i].manager_schedule = {};
                    }
                    if (!lclDateArr[i].manager_schedule.morning_schedule_details) {
                       lclDateArr[i].manager_schedule.morning_schedule_details = {};
                    }
                    if (!lclDateArr[i].manager_schedule.afternoon_schedule_details) {
                       lclDateArr[i].manager_schedule.afternoon_schedule_details = {};
                    }
                    if (!lclDateArr[i].manager_schedule.night_schedule_details) {
                       lclDateArr[i].manager_schedule.night_schedule_details = {};
                    }
                    if (!lclDateArr[i].manager_schedule.late_night_schedule_details) {
                       lclDateArr[i].manager_schedule.late_night_schedule_details = {};
                    }
                    
                    tmpArr.push({currDate: new Date(lclDateArr[i].currDate).toString(), is_morning_scheduled: lclDateArr[i].is_morning_scheduled, is_afternoon_scheduled: lclDateArr[i].is_afternoon_scheduled, is_night_scheduled: lclDateArr[i].is_night_scheduled, is_late_night_scheduled: lclDateArr[i].is_late_night_scheduled,is_morning_scheduled_confirmation: lclDateArr[i].manager_schedule.morning_schedule_details.is_morning_scheduled, is_afternoon_scheduled_confirmation: lclDateArr[i].manager_schedule.afternoon_schedule_details.is_afternoon_scheduled, is_night_scheduled_confirmation: lclDateArr[i].manager_schedule.night_schedule_details.is_night_scheduled, is_late_night_scheduled_confirmation: lclDateArr[i].manager_schedule.late_night_schedule_details.is_late_night_scheduled});
            }
            //console.clear();
            //console.log(tmpArr);
            tmpArr.sort(function(a, b){ var dateA = new Date(a.currDate); var dateB = new Date(b.currDate); return dateA-dateB;});
            $scope.availability = tmpArr;
        }
    });
    
    
    
    /****/
    
    
    /*
    $scope.dateWiseData = [];
    var tmpArr = [];
    var x = 0;
    $scope.availability[0] = [];
    for (var i=0; i< 3;i++) {
        $http.post('/api/dayavailability', {_id: SessionService.currentUser._id, weekDay: $scope.sevenWeekDayArr[i]}).then(function(response){
            console.clear();
            console.log("___RESPONSE____");
            console.log("i "+i);
            
            $scope.availability[i].is_morning_scheduled = true; 
        });
    }
    console.log("--Week Data Arr--");
    console.log($scope.dateWiseData);
*/
    
    $scope.submitAvailability = function(weekAvailability){
        
        //console.clear();
        //console.log(weekAvailability);
        //return false;

        for(var i=0; i< weekAvailability.length; i++){
            if ( "employee" === SessionService.currentUser.roles[0] ) {
                weekAvailability[i].employee_id = SessionService.currentUser._id;
                //if(undefined === weekAvailability[i].is_morning_scheduled)
                    weekAvailability[i].currDate = new Date(weekAvailability[i].currDate).toUTCString();
                weekAvailability[i].is_morning_scheduled = (undefined === weekAvailability[i].is_morning_scheduled)? false : weekAvailability[i].is_morning_scheduled;
                weekAvailability[i].is_afternoon_scheduled = (undefined === weekAvailability[i].is_afternoon_scheduled)? false : weekAvailability[i].is_afternoon_scheduled;
                weekAvailability[i].is_night_scheduled = (undefined === weekAvailability[i].is_night_scheduled)? false : weekAvailability[i].is_night_scheduled;
                weekAvailability[i].is_late_night_scheduled = (undefined === weekAvailability[i].is_late_night_scheduled)? false : weekAvailability[i].is_late_night_scheduled;
            }
            
            weekAvailability[i].slot_time = {};
            weekAvailability[i].slot_time.morning_start_time = $scope.slot.morning_start_time;
            weekAvailability[i].slot_time.morning_start_time_period = $scope.slot.morning_start_period;
            weekAvailability[i].slot_time.morning_end_time = $scope.slot.morning_end_time;
            weekAvailability[i].slot_time.morning_end_time_period = $scope.slot.morning_end_period;
            weekAvailability[i].slot_time.afternoon_start_time = $scope.slot.afternoon_start_time;
            weekAvailability[i].slot_time.afternoon_start_time_period = $scope.slot.afternoon_start_period;
            weekAvailability[i].slot_time.afternoon_end_time = $scope.slot.afternoon_end_time;
            weekAvailability[i].slot_time.afternoon_end_time_period = $scope.slot.afternoon_end_period;
            weekAvailability[i].slot_time.night_start_time = $scope.slot.night_start_time;
            weekAvailability[i].slot_time.night_start_time_period = $scope.slot.night_start_period;
            weekAvailability[i].slot_time.night_end_time = $scope.slot.night_end_time;
            weekAvailability[i].slot_time.night_end_time_period = $scope.slot.night_end_period;
            weekAvailability[i].slot_time.late_night_start_time = $scope.slot.late_night_start_time;
            weekAvailability[i].slot_time.late_night_start_time_period = $scope.slot.late_night_start_period;
            weekAvailability[i].slot_time.late_night_end_time = $scope.slot.late_night_end_time;
            weekAvailability[i].slot_time.late_night_end_time_period = $scope.slot.late_night_end_period;
            weekAvailability[i].modified_date = new Date();
            weekAvailability[i].modified_by = SessionService.currentUser._id;
            
        }
        //console.clear();
        //console.log($scope.sevenWeekDayArr);
        console.log("--- EDIT CASE CHECK CONSOLE WEEK AVAILABILITY ---");
        console.log(weekAvailability);
        //return false;
        
        // Save week availability
        $http.post('/api/weekavailability', weekAvailability).then(function(response){
            console.log("--- EDIT ------ RESPONSE WEEK AVAILABILITY ---");
            response.data.data.sort(function(a, b){ var dateA = new Date(a.currDate); var dateB = new Date(b.currDate); return dateA-dateB;});
            console.log(response.data.data);
            if ( "200" === response.data.status_code ) {
                if ( response.data.length === 7 ) {
                    // Get Seven Week Days From The Response Array                    
                    $scope.sevenWeekDayArr = [
                                              response.data.data[0].currDate,
                                              response.data.data[1].currDate,
                                              response.data.data[2].currDate,
                                              response.data.data[3].currDate,
                                              response.data.data[4].currDate,
                                              response.data.data[5].currDate,
                                              response.data.data[6].currDate
                                            ];
                    
                    $scope.availability = [];
                    
                    for(var i=0; i<7; i++) {
                        $scope.availability.push({currDate: response.data.data[i].currDate, is_morning_scheduled: response.data.data[i].is_morning_scheduled, is_afternoon_scheduled: response.data.data[i].is_afternoon_scheduled, is_night_scheduled: response.data.data[i].is_night_scheduled, is_late_night_scheduled: response.data.data[i].is_late_night_scheduled});
                    }
                }
                //$scope.sevenWeekDayArr = response.data;
                toastr.success("Data successfully saved!");
            }
            else {
                toastr.error("Something went wrong, please re login");
            }
            
        });

    };
    
});
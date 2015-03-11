angular.module("app").controller("EditEventController", function($scope, NotificationService, SessionService, $http, $routeParams, $filter) {
    $scope.user = SessionService.currentUser;
    $scope.id = $routeParams.id;
    
    $scope.repeats = [
        {name: "No", value: 1},
        {name: "Every day", value: 2},
        {name: "Every week", value: 3},
        {name: "Every month", value: 4},
        {name: "Every year", value: 5},
    ];
    
    $scope.timeslots = [
        {name: "01:00 AM", value: "01:00 AM"},
        {name: "02:00 AM", value: "02:00 AM"},
        {name: "03:00 AM", value: "03:00 AM"},
        {name: "04:00 AM", value: "04:00 AM"},
        {name: "05:00 AM", value: "05:00 AM"},
        {name: "06:00 AM", value: "06:00 AM"},
        {name: "07:00 AM", value: "07:00 AM"},
        {name: "08:00 AM", value: "08:00 AM"},
        {name: "09:00 AM", value: "09:00 AM"},
        {name: "10:00 AM", value: "10:00 AM"},
        {name: "11:00 AM", value: "11:00 AM"},
        {name: "12:00 PM", value: "12:00 PM"},
        {name: "01:00 PM", value: "01:00 PM"},
        {name: "02:00 PM", value: "02:00 PM"},
        {name: "03:00 PM", value: "03:00 PM"},
        {name: "04:00 PM", value: "04:00 PM"},
        {name: "05:00 PM", value: "05:00 PM"},
        {name: "06:00 PM", value: "06:00 PM"},
        {name: "07:00 PM", value: "07:00 PM"},
        {name: "08:00 PM", value: "08:00 PM"},
        {name: "09:00 PM", value: "09:00 PM"},
        {name: "10:00 PM", value: "10:00 PM"},
        {name: "11:00 PM", value: "11:00 PM"},
        {name: "00:00 AM", value: "00:00 AM"}
    ];
    
    $scope.days = [];
    for(var i=2; i< 31; i++) {
        $scope.days.push({name: i, value: i});
    }

    // Add Shift Details by @Swapnesh on @28-08-2014
    
    $scope.shiftnumbers = [];
    for(var i=0; i< 23; i++) {
        $scope.shiftnumbers.push({name: i, value: i});
    }
    $scope.shiftstart = [];
    $scope.shiftend = [];
    $scope.shiftitems = [];
    var i = 0;
    $scope.addShiftCnt = function(j){
      var k = i+j;
      $scope.shiftitems.push(k);
      i++;
    };
    $scope.remShift = function(index){
        $scope.shiftstart.splice(index, 1);
        $scope.shiftend.splice(index, 1);
        $scope.shiftitems.splice(index, 1);
    };
    $scope.addShiftNumber = function(num){
      $scope.selectedShiftnumbers = [];
      $scope.shiftstart = [];
      $scope.shiftend = [];
      for(var i=0; i< num; i++) {
        $scope.selectedShiftnumbers.push(i);
      }
    }    
    
    $scope.addShift = function() {
        // Toggle the shift divs
        $scope.showshift = (true === $scope.showshift) ? false : true;
    };
    
    // Get Event INFO
    $http.get('/api/events/' + $scope.id).success(function(response) {

        if ("200" === response.status_code) {
            if (response.data.start_date) {
                response.data.start_date = $filter('date')(response.data.start_date, 'MM/dd/yyyy');
            }
            if (response.data.end_date != undefined) {
                response.data.end_date = $filter('date')(response.data.end_date, 'MM/dd/yyyy');
            }
            if (response.data.event_data) {
                response.data.event_data.date_billed = $filter('date')(response.data.event_data.date_billed, 'MM/dd/yyyy');
                response.data.event_data.date_called = $filter('date')(response.data.event_data.date_called, 'MM/dd/yyyy');
                response.data.event_data.ready_time_for_valet = $filter('date')(response.data.event_data.ready_time_for_valet, 'MM/dd/yyyy HH:mm');    
                response.data.event_data.after_call = response.data.event_data.after_call === true ? "yes" : "no";
                response.data.event_data.billed = response.data.event_data.billed === true ? "yes" : "no";
                response.data.event_data.paid = response.data.event_data.paid === true ? "yes" : "no";
                response.data.event_data.paid_valet = response.data.event_data.paid_valet === true ? "yes" : "no";
                response.data.event_data.require_setup = response.data.event_data.require_setup === true ? "yes" : "no";
            }
            response.data.is_active = response.data.is_active === true ? "yes" : "no";
            console.log("--RESPONSE DATA--");
            console.log(response.data);
            $scope.event = response.data;
            
            $scope.event.repeat = (response.data.is_repeat === true) ? response.data.recurring_event_data[0].type : 1;

            // Every Day
            if ( 2 === $scope.event.repeat ) {
                if ( "pickdate" === response.data.recurring_event_data[0].option_sel) {
                    $scope.event.everydaypick = $filter('date')(response.data.recurring_event_data[0].option_data, 'MM/dd/yyyy');
                    $scope.event.everyday = "pickdate";
                }
                else if ( "dayselval" === response.data.recurring_event_data[0].option_sel ) {
                    $scope.event.selday = response.data.recurring_event_data[0].option_data;
                    $scope.event.everyday = "dayselval";
                }
                else {
                    $scope.event.everyday = "forever";
                }
            }            
            
            // Every Week
            if ( 3 === $scope.event.repeat ) {
                if ( "pickdate" === response.data.recurring_event_data[0].option_sel) {
                    $scope.event.everyweekpick = $filter('date')(response.data.recurring_event_data[0].option_data, 'MM/dd/yyyy');
                    $scope.event.everyweek = "pickdate";
                }
                else if ( "dayselval" === response.data.recurring_event_data[0].option_sel ) {
                    $scope.event.selweekday = response.data.recurring_event_data[0].option_data;
                    $scope.event.everyweek = "dayselval";
                }
                else {
                    $scope.event.everyweek = "forever";
                }
            }
            
            // Every Month
            if ( 4 === $scope.event.repeat ) {
                if ( "pickdate" === response.data.recurring_event_data[0].option_sel) {
                    $scope.event.everymonthpick = $filter('date')(response.data.recurring_event_data[0].option_data, 'MM/dd/yyyy');
                    $scope.event.everymonth = "pickdate";
                }
                else if ( "dayselval" === response.data.recurring_event_data[0].option_sel ) {
                    $scope.event.selmonthday = response.data.recurring_event_data[0].option_data;
                    $scope.event.everymonth = "dayselval";
                }
                else {
                    $scope.event.everymonth = "forever";
                }
            }
            
            // Every year
            if ( 5 === $scope.event.repeat ) {
                if ( "pickdate" === response.data.recurring_event_data[0].option_sel) {
                    $scope.event.everyyearpick = $filter('date')(response.data.recurring_event_data[0].option_data, 'MM/dd/yyyy');
                    $scope.event.everyyear = "pickdate";
                }
                else if ( "dayselval" === response.data.recurring_event_data[0].option_sel ) {
                    $scope.event.selyearday = response.data.recurring_event_data[0].option_data;
                    $scope.event.everyyear = "dayselval";
                }
                else {
                    $scope.event.everyyear = "forever";
                }
            }
        
        
        
            $scope.showshift = ( response.data.shift_template_id.length > 0 ) ? true : false;
            
            $scope.shiftstarttime = response.data.shiftstarttime;
            $scope.shiftendtime = response.data.shiftendtime;
            $scope.ifShiftData = ( response.data.shift_template_id.length > 0 ) ? response.data.shift_template_id.length : 0;
           
            if( response.data.shift_template_id.length > 0 ) {
                var num = response.data.shift_template_id.length;
                $scope.selectedShiftnumbers = [];
                $scope.shiftstart = [];
                $scope.shiftend = [];
                for(var i=0; i< num; i++) {
                  $scope.shiftstart[i] = response.data.shift_template_id[i].start_time;
                  $scope.shiftend[i] = response.data.shift_template_id[i].end_time;
                  $scope.shiftitems.push(i);
                  $scope.selectedShiftnumbers.push(i);
                }
                $scope.earliershifts = response.data.shift_template_id.length;
            } 
        
            // Client Attachment with Events - 01-09-2014 - START
            if( "ota" !== response.data.accounttype ){
                $scope.truefalse = true;
            }
            // Client Attachment with Events - 01-09-2014 - END
            
        }
    });
    
    $scope.updateEvent = function(event) {
        if($scope.eventForm.$invalid){
            alert("Form is not valid.");
            angular.element("input.ng-invalid").css("border-color","red");
        }else{
            /* SHIFT DATA - START */
            var myShiftArr = [];
            for(var i=0; i< $scope.shiftstart.length;i++) {
                myShiftArr[i] = new Object({start_time: $scope.shiftstart[i]});
            }
            
            for(var i=0; i< $scope.shiftend.length;i++) {
                myShiftArr[i].end_time = $scope.shiftend[i];
                myShiftArr.push();
            }
    
            if ( myShiftArr.length > 0 )
                event.shiftData = myShiftArr;
            /* SHIFT DATA - END */
            
            /* For Recurring Data - Start */
            if ( 1 === event.repeat) {
                // It is a not recurring event
                event.is_repeat = false;
            }
            else {
                // It is a recurring event and perform action likewise on input
                event.is_repeat = true;
                
                event.recurring_event_data = {};
                
                // Every day event
                if ( 2 === event.repeat ) {
                    event.recurring_event_data.type = event.repeat;
                    
                    switch(event.everyday) {
                        case "dayselval":
                            event.recurring_event_data.option_sel = event.everyday;
                            
                            event.recurring_event_data.option_data = event.selday;
                            break;
                        case "pickdate":
                            event.recurring_event_data.option_sel = event.everyday;
                            
                            if ( undefined === event.everydaypick)
                                event.recurring_event_data.option_data = new Date();
                            else    
                                event.recurring_event_data.option_data = new Date(event.everydaypick);
                            break;
                        default:
                            
                            event.recurring_event_data.option_sel = event.everyday;
                            break;
                    }
                }
                
                // Every week event
                if ( 3 === event.repeat ) {
                    event.recurring_event_data.type = event.repeat;
                    
                    switch(event.everyweek) {
                        case "dayselval":
                            event.recurring_event_data.option_sel = event.everyweek;
                            
                            event.recurring_event_data.option_data = event.selweekday;
                            break;
                        case "pickdate":
                            event.recurring_event_data.option_sel = event.everyweek;
                            
                            if ( undefined === event.everyweekpick)
                                event.recurring_event_data.option_data = new Date();
                            else    
                                event.recurring_event_data.option_data = new Date(event.everyweekpick);
                                console.log(event.recurring_event_data);
                            break;
                        default:
                            
                            event.recurring_event_data.option_sel = event.everyweek;
                            break;
                    }
                }
                
                // Every month event
                if ( 4 === event.repeat ) {
                    event.recurring_event_data.type = event.repeat;
                    
                    switch(event.everymonth) {
                        case "dayselval":
                            event.recurring_event_data.option_sel = event.everymonth;
                            
                            event.recurring_event_data.option_data = event.selmonthday;
                            break;
                        case "pickdate":
                            event.recurring_event_data.option_sel = event.everymonth;
                            
                            if ( undefined === event.everymonthpick)
                                event.recurring_event_data.option_data = new Date();
                            else    
                                event.recurring_event_data.option_data = new Date(event.everymonthpick);
                            break;
                        default:
                            
                            event.recurring_event_data.option_sel = event.everymonth;
                            break;
                    }
                }
                
                // Every year event
                if ( 5 === event.repeat ) {
                    event.recurring_event_data.type = event.repeat;
                    
                    switch(event.everyyear) {
                        case "dayselval":
                            event.recurring_event_data.option_sel = event.everyyear;
                            
                            event.recurring_event_data.option_data = event.selyearday;
                            break;
                        case "pickdate":
                            event.recurring_event_data.option_sel = event.everyyear;
                            
                            if ( undefined === event.everyyearpick)
                                event.recurring_event_data.option_data = new Date();
                            else    
                                event.recurring_event_data.option_data = new Date(event.everyyearpick);
                            break;
                        default:
                            
                            event.recurring_event_data.option_sel = event.everyyear;
                            break;
                    }
                }
            }
    
            /* For Recurring Data - End */
            
            event.event_data.after_call = event.event_data.after_call === "yes" ? true : false;
            event.event_data.billed = event.event_data.billed === "yes" ? true : false;
            event.event_data.paid = event.event_data.paid === "yes" ? true : false;
            event.event_data.paid_valet = event.event_data.paid_valet === "yes" ? true : false;
            event.event_data.require_setup = event.event_data.require_setup === "yes" ? true : false;
            event.is_active === "yes" ? true : false;
            event.set_up_person = $scope.user._id;
            
            if(event.start_date === undefined )
                delete event.start_date;
            else
                event.start_date = new Date(event.start_date);
                
            if(event.end_date === undefined )
                delete event.end_date;
            else
                event.end_date = new Date(event.end_date);
    
            if(event.event_data.date_billed === undefined )
                delete event.event_data.date_billed;
            else
                event.event_data.date_billed = new Date(event.event_data.date_billed);
    
            if(event.event_data.date_called === undefined )
                delete event.event_data.date_called;
            else
                event.event_data.date_called = new Date(event.event_data.date_called);
                
            if(event.event_data.ready_time_for_valet === undefined )
                delete event.event_data.ready_time_for_valet;
            else
                event.event_data.ready_time_for_valet = new Date(event.event_data.ready_time_for_valet);
            
            console.log("--EVENT UPDATE--");
            console.log(event);
    
            $http.put("/api/events/", event).then(function(response){
    
                if(event.start_date !== undefined )
                    $scope.event.start_date = (event.start_date.getMonth()+1)+"/"+event.start_date.getDate()+"/"+event.start_date.getFullYear();
                
                if(event.end_date !== undefined )
                    $scope.event.end_date = (event.end_date.getMonth()+1)+"/"+event.end_date.getDate()+"/"+event.end_date.getFullYear();
        
                if(event.event_data.date_billed !== undefined )
                    $scope.event.event_data.date_billed = (event.event_data.date_billed.getMonth()+1)+"/"+event.event_data.date_billed.getDate()+"/"+event.event_data.date_billed.getFullYear();
        
                if(event.event_data.date_called !== undefined )
                    $scope.event.event_data.date_called = (event.event_data.date_called.getMonth()+1)+"/"+event.event_data.date_called.getDate()+"/"+event.event_data.date_called.getFullYear();
                    
                if(event.event_data.ready_time_for_valet !== undefined )
                    event.event_data.ready_time_for_valet = (event.event_data.ready_time_for_valet.getMonth()+1)+"/"+event.event_data.ready_time_for_valet.getDate()+"/"+event.event_data.ready_time_for_valet.getFullYear();
                
                if ( "200" === response.data.status_code ) {
                    toastr.success("Event information updated successfully.");
                    $scope.eventForm.$setPristine();
                }
                else {
                    toastr.error("Something went wrong!!");
                }
            });
        } 
    };
    
    // Attach Accounts/Clients to an Event @01-09-2014 - START
    $http.get('/api/clients').then(function(response){
        var clientArr = [];
        clientArr.push({name: "One Time Account", value: "ota"});
        for(var i =0; i<response.data.data.length; i++){
            clientArr.push({
                name: response.data.data[i].name,
                value: response.data.data[i]._id,
                contact_name: response.data.data[i].contact_name,
                contact_phone: response.data.data[i].contact_phone,
                contact_email: response.data.data[i].contact_email
            });
        }
        $scope.clientData = clientArr;
    });
    
    $scope.fillAcntCnct = function(id){
        $scope.truefalse = false;
        // If not one time account, fill data
        if ("ota" !== id) {
            $scope.truefalse = true;
            angular.forEach($scope.clientData, function(key, value){
                if (key.value === id) {
                    $scope.truefalse = true;
                    $scope.event.event_data.contact_name = key.contact_name;
                    $scope.event.event_data.contact_phone = key.contact_phone;
                    $scope.event.event_data.contact_email = key.contact_email;
                }
            });
        }
        else {
            $scope.truefalse = false;
            $scope.event.event_data.contact_name = "";
            $scope.event.event_data.contact_phone = "";
            $scope.event.event_data.contact_email = "";
        }
    };
    // Attach Accounts/Clients to an Event @01-09-2014 - END

});
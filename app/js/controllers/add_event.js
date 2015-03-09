angular.module("app").controller("AddEventController", function($scope, SessionService, $http, $location) {
    //$(document).ready(function(){
    //     /****  Datepicker  ****/
    //    if ($('.datepicker').length && $.fn.datepicker) {
    //        $('.datepicker').each(function () {
    //            var datepicker_inline = $(this).data('inline') ? $(this).data('inline') : false;
    //            $(this).datepicker({
    //                inline: datepicker_inline,
    //                formatDate:'Y-m-d'
    //            });
    //        });
    //    }
    //    /****  Datetimepicker  ****/
    //    if ($('.datetimepicker').length && $.fn.datetimepicker) {
    //        $('.datetimepicker').each(function () {
    //            var datetimepicker_inline = $(this).data('inline') ? $(this).data('inline') : false;
    //            $(this).datetimepicker({
    //                inline: datetimepicker_inline,
    //                format: 'm/d/Y H:i'    
    //            });
    //        });
    //    }     
    //});

    $scope.user = SessionService.currentUser;
    $scope.event = {};
    $scope.event = {
        is_active : "yes",
        event_data:{
            paid_valet: "yes",
            after_call: "yes",
            billed: "yes",
            paid: "no",
            require_setup: "yes"
        }
    };
    
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
    
    $scope.shiftnumbers = [];
    for(var i=0; i< 23; i++) {
        $scope.shiftnumbers.push({name: i, value: i});
    }
    
    $scope.addShiftNumber = function(num){
      $scope.selectedShiftnumbers = [];
      $scope.shiftstart = [];
      $scope.shiftend = [];
      for(var i=0; i< num; i++) {
        $scope.selectedShiftnumbers.push(i);
      }
    }
    $scope.shiftstart = [];
    $scope.shiftend = [];
    $scope.shiftitems = [];
    var i =0;
    $scope.addShiftCnt = function(){
      $scope.shiftitems.push(i);
      i++;
    };
    $scope.remShift = function(index){
        $scope.shiftstart.splice(index, 1);
        $scope.shiftend.splice(index, 1);
        $scope.shiftitems.splice(index, 1);
    };
    $scope.addEvent = function(event){
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
            console.log(event.shiftData);
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
            event.is_active = event.is_active === "yes" ? true : false;
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
    
            if($scope.user._id) {
    
                $http.post("/api/events", event).then(function(response){
                    if(response.data.status_code === "200") {
                        toastr.success("Event added successfully.");
                        $scope.eventForm.$setPristine();
                        $scope.event = {};
                        $scope.event = {
                            is_active : "yes",
                            event_data:{
                                paid_valet: "yes",
                                after_call: "yes",
                                billed: "yes",
                                paid: "no",
                                require_setup: "yes"
                            }
                        };
                        
                        $location.path("/eventlist");
                        
                    }
                    else {
                        toastr.error("Something went wrong, check details");
                        
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
                            
                        $scope.event.event_data.after_call = event.event_data.after_call === true ? "yes" : "no";
                        $scope.event.event_data.billed = event.event_data.billed === true ? "yes" : "no";
                        $scope.event.event_data.paid = event.event_data.paid === true ? "yes" : "no";
                        $scope.event.event_data.paid_valet = event.event_data.paid_valet === true ? "yes" : "no";
                        $scope.event.event_data.require_setup = event.event_data.require_setup === true ? "yes" : "no";
                        $scope.event.is_active = event.is_active === true ? "yes" : "no";
                    }
                });
    
            }
        }
    };
    
    $scope.cleardata = function(){
        toastr.info("You cleared the data.");
        angular.element("input.ng-invalid").css("border","1px solid #d3d3d3");
        $scope.eventForm.$setPristine();
        $scope.event = {};
        $scope.event = {
            is_active : "yes",
            event_data:{
                paid_valet: "yes",
                after_call: "yes",
                billed: "yes",
                paid: "no",
                require_setup: "yes"
            }
        };
    };
    
    // Add Shift Details by @Swapnesh on @27-08-2014 - START
    
    $scope.showshift = false;
    
    $scope.addShift = function() {
        // Toggle the shift divs
        $scope.showshift = (true === $scope.showshift) ? false : true;
    };
    
    // Add Shift Details by @Swapnesh on @27-08-2014 - END
    
    // Attach Accounts/Clients to an Event @01-09-2014 - START
    $scope.truefalse = false;
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
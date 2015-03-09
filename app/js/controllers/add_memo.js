angular.module("app").controller("AddMemoController", function($scope, SessionService, $http, $location) {

    // Get all employee listing for drop down
    $http.get("/api/getempl").then(function(response){
        if (response.status == 200) {
            response.data.data.forEach(function(elem, key){
                elem.ticked = false;
            });
            console.log("--RESPONSE--");
            //console.log(response.data.data);
            $scope.modernWebBrowsers = response.data.data;
        }
        else {
            console.log('400');
        }
    });
    
    // Add Memo from admin/manager
    $scope.addMemo = function(memo) {
        if($scope.memoForm.$invalid){
            alert("Form is not valid.");
        }else{
            var storeSelUserId = [];
            var creatorInfo = SessionService.currentUser;
            
            angular.forEach( $scope.modernWebBrowsers, function( value, key ) {
                if ( value.ticked === true ) {
                    storeSelUserId.push({user_id: value._id, mark_read: false});
                }
            });
            
            // Create creator_name from first_name+last_name
            var first_name, last_name;
            if ( undefined !== SessionService.currentUser.first_name )
                first_name = SessionService.currentUser.first_name;
            else
                first_name = "";
                
            if ( undefined !== SessionService.currentUser.last_name )
                last_name = SessionService.currentUser.last_name;
            else
                last_name = "";
                
            var memos = {
                    title: memo.title,
                    description: memo.description,
                    created_by: SessionService.currentUser._id,
                    role: SessionService.currentUser.roles[0],
                    created_date: new Date(),
                    creator_name: first_name+" "+last_name,
                    sent_to: storeSelUserId
                };
            console.log(memos);
            
            // Memo notification data
            var memoNotificationData = [];  
            angular.forEach(storeSelUserId, function(elem, key){
                memoNotificationData.push({
                    receiver_id: elem.user_id,
                    message: memo.title,
                    sender_id: SessionService.currentUser._id,
                    sender_name: first_name+" "+last_name,
                    sent_date: new Date(),
                    is_marked: false
                });
            });
            
            // Socket Notification
            //var socket = io('http://localhost:6868');
            //socket.on('connection', function (data) {
              //  socket.emit('send memo notification', memoNotificationData);
            //});
    
            // Code To Create New Memo
            
            $http.post("/api/memos", memos).then(function(response){
                console.log("__RESPONSE__");
                console.log(response.data);
                console.log("Status Code "+ response.data.status_code);
                if( "200" === response.data.status_code ) {
                    toastr.success("Memo added successfully.");
                    $location.path('/memolist');
                }
            });
        }
        
    };
});
angular.module("app").controller("MemoListController", function($scope, SessionService, $http, $filter, sidepanelactiveService) {
    $scope.user = SessionService.currentUser;

    // Don't show add button to employee for adding a memo
    if ( "employee" === SessionService.currentUser.roles[0] )
        $scope.userPriv = false;
    else
        $scope.userPriv = true;

    // Show side panel active
    sidepanelactiveService.test();
    
    $(document).ready(function(){
        $("body").removeClass("events");
        $scope.colorInb = 'btn-blue';
        $scope.colorSnt = 'btn-dark';
        
        if ("admin" === SessionService.currentUser.roles[0]) {
            $http.post("/api/getmemos", {userId: SessionService.currentUser._id, action: "adminInboxMsgs"}).then(function(response){
                console.log("GET ADMIN MEMO INBOX");
                if( "200" === response.data.status_code ) {
                    $scope.allMemos = response.data.data;
                    var unread = 0;
                    response.data.data.forEach(function(elem, key){
                        if ((elem.created_by != SessionService.currentUser._id) && (!elem.admin_checked)) {
                            unread++;
                        }
                    });
                    if ($scope.allMemos.length > 0)
                        $scope.haveResult = true;
                    else
                        $scope.haveResult = false;
                    $scope.userRole = "admin";
                    //$scope.msgsCount = $scope.allMemos.length;
                    $scope.msgsCount = unread;
                    setPagingData($scope.allMemos);
                };    
            });
        }
        else if ( "manager" === SessionService.currentUser.roles[0] ) {
            $http.post("/api/getmemos", {userId: SessionService.currentUser._id, action: "managerInboxMsgs"}).then(function(response){
                console.log("GET MANAGER MEMO INBOX");
                if( "200" === response.data.status_code ) {
                    $scope.allMemos = response.data.data;
                    var unread = 0;
                    response.data.data.forEach(function(elem, key){
                        elem.sent_to.forEach(function(elemsent, keysent){
                            if ((elemsent.user_id == SessionService.currentUser._id) && (!elemsent.mark_read)) {
                                unread++;
                            }
                        });
                    });
                    if ($scope.allMemos.length > 0)
                        $scope.haveResult = true;
                    else
                        $scope.haveResult = false;
                    $scope.userRole = "other";
                    //$scope.msgsCount = $scope.allMemos.length;
                    $scope.msgsCount = unread;
                    setPagingData($scope.allMemos);
                };    
            });
        }
        else {
            $http.post("/api/getmemos", {userId: SessionService.currentUser._id, action: "empInboxMsgs"}).then(function(response){
                console.log("GET EMPLOYEE MEMO INBOX");
                if( "200" === response.data.status_code ) {
                    $scope.allMemos = response.data.data;
                    console.clear();
                    //console.log($scope.user._id);
                    //console.log("-- All Employee --");
                    //console.log($scope.allMemos);
                    var unread = 0;
                    response.data.data.forEach(function(elem, key){
                        elem.sent_to.forEach(function(elemsent, keysent){
                            if ((elemsent.user_id == SessionService.currentUser._id) && (!elemsent.mark_read)) {
                                unread++;
                            }
                        });
                    });
                    if ($scope.allMemos.length > 0)
                        $scope.haveResult = true;
                    else
                        $scope.haveResult = false;
                    $scope.userRole = "other";
                    //$scope.msgsCount = $scope.allMemos.length;
                    $scope.msgsCount = unread;
                    setPagingData($scope.allMemos);
                };    
            });
        }
        
    });
    
    var orderBy = $filter('orderBy');

    // Get memo listing
    /*
    $scope.allMemos = [
        {title: "This is title 1", description: "This is a test description 1", created_date: new Date()}
    ];
    */
    // IF ADMIN SHOW ALL MEMOS - EXCULDE MEMOS CREATED BY ITSELF
    //$scope.allMemos = [];


    //Inbox Mail
    $scope.inbox = function() {
        $scope.colorInb = 'btn-blue';
        $scope.colorSnt = 'btn-dark';
        
        // IF ADMIN SHOW ALL MEMOS - EXCULDE MEMOS CREATED BY ITSELF
        if ("admin" === SessionService.currentUser.roles[0]) {
            $http.post("/api/getmemos", {userId: SessionService.currentUser._id, action: "adminInboxMsgs"}).then(function(response){
                console.log("GET ADMIN MEMO INBOX");
                if( "200" === response.data.status_code ) {
                    $scope.allMemos = response.data.data;
                    var unread = 0;
                    response.data.data.forEach(function(elem, key){
                        if ((elem.created_by != SessionService.currentUser._id) && (!elem.admin_checked)) {
                            unread++;
                        }
                    });
                    if ($scope.allMemos.length > 0)
                        $scope.haveResult = true;
                    else
                        $scope.haveResult = false;
                    $scope.userRole = "admin";
                    //$scope.msgsCount = $scope.allMemos.length;
                    $scope.msgsCount = unread;
                    setPagingData($scope.allMemos);
                };    
            });
        }
        else if ( "manager" === SessionService.currentUser.roles[0] ) {
            $http.post("/api/getmemos", {userId: SessionService.currentUser._id, action: "managerInboxMsgs"}).then(function(response){
                console.log("GET MANAGER MEMO INBOX");
                if( "200" === response.data.status_code ) {
                    $scope.allMemos = response.data.data;
                    
                    var unread = 0;
                    response.data.data.forEach(function(elem, key){
                        elem.sent_to.forEach(function(elemsent, keysent){
                            if ((elemsent.user_id == SessionService.currentUser._id) && (!elemsent.mark_read)) {
                                unread++;
                            }
                        });
                    });
                    
                    if ($scope.allMemos.length > 0)
                        $scope.haveResult = true;
                    else
                        $scope.haveResult = false;
                    $scope.userRole = "other";
                    //$scope.msgsCount = $scope.allMemos.length;
                    $scope.msgsCount = unread;
                    setPagingData($scope.allMemos);
                };    
            });
        }
        else {
            $http.post("/api/getmemos", {userId: SessionService.currentUser._id, action: "empInboxMsgs"}).then(function(response){
                console.log("GET EMPLOYEE MEMO INBOX");
                if( "200" === response.data.status_code ) {
                    $scope.allMemos = response.data.data;
                    var unread = 0;
                    response.data.data.forEach(function(elem, key){
                        elem.sent_to.forEach(function(elemsent, keysent){
                            if ((elemsent.user_id == SessionService.currentUser._id) && (!elemsent.mark_read)) {
                                unread++;
                            }
                        });
                    });
                    if ($scope.allMemos.length > 0)
                        $scope.haveResult = true;
                    else
                        $scope.haveResult = false;
                        $scope.userRole = "other";
                        //$scope.msgsCount = $scope.allMemos.length;
                        $scope.msgsCount = unread;
                        setPagingData($scope.allMemos);
                };    
            });
        }
    };

    //Sent Mail
    $scope.sent = function() {
        $scope.colorSnt = 'btn-blue';
        $scope.colorInb = 'btn-dark';
        
        // SHOW MEMOS CREATED BY ITSELF
        $http.post("/api/getmemos", {userId: SessionService.currentUser._id, action: "getAllCreatedByMe"}).then(function(response){
            console.log("GET MEMOS RESPONSE");
            if( "200" === response.data.status_code ) {
                    $scope.allMemos = response.data.data;
                    if ($scope.allMemos.length > 0)
                        $scope.haveResult = true;
                    else
                        $scope.haveResult = false;
                $scope.mark_read = true;
            };
        });
    };
    
    //Mark Read
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
    
    //setPagingData($scope.allMemos);
    
    $scope.reverse = false;
    $scope.order = function(predicate, reverse) {
      $scope.allMemos = orderBy($scope.allMemos, predicate, reverse);
    };
    
    /** Pagination Code START **/
    function setPagingData(datam){
        $scope.allData = {};
        $scope.perPage = 5;
        //$scope.allData = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
        $scope.allData = datam;
        $scope.offset = 0;
        $scope.navButtons = [];
        
        $scope.isPreviousDisabled = false;
        $scope.isNextDisabled = false;

        $scope.buildNavButtons = function () {
            for (var i = 0, len = ($scope.allData.length / $scope.perPage); i < len; i = i + 1) {
                $scope.navButtons.push(i);
            }
            //alert("Nav Buttons : " + $scope.navButtons);
        }

        $scope.paginate = function() {
            $scope.allMemos = $scope.allData.slice($scope.offset, $scope.offset + $scope.perPage);
            //alert("Sliced Data : " + $scope.data);
        };

        $scope.previous = function() {                    
            $scope.offset = $scope.offset - $scope.perPage;
        };

        $scope.next = function() {
            //alert("offset value : "+os);
            $scope.offset = $scope.offset + $scope.perPage;
            
        };
        $scope.getoffset = function(offsetval){
             $scope.offset = offsetval;            
        }

        $scope.$watch('offset', function() {
            if( $scope.offset < 0 ){
                $scope.isPreviousDisabled = true;
                $scope.isNextDisabled = false;
                $scope.offset = 0;
                return false;
            }
            else{
                $scope.isPreviousDisabled = false;
            }
            
            //disable Next button
            //if( $scope.offset > (($scope.perPage * ($scope.allData.length/$scope.perPage))-1) ){
            if( $scope.offset > ($scope.allData.length-1) ){
                $scope.isNextDisabled = true;
                $scope.isPreviousDisabled = false;
                //alert("Next button disabled : "+$scope.offset);
                $scope.offset = ($scope.perPage * ($scope.allData.length/$scope.perPage));
                //alert("Offset Value changed to : "+$scope.offset);
                return false;
            }
            else{
                $scope.isNextDisabled = false;
            }
            $scope.paginate();
            //alert("In else...");
        });
        $scope.buildNavButtons();
    }            
    /** Pagination Code ENDS **/

});
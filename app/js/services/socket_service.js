angular.module("app").factory("SocketService", function($rootScope) {
  var socket = io('http://localhost:6868');
  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      //socket.emit('get notifications', {user_id: userId});
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if(callback)
            callback.apply(socket, args);
        });  
      });
    }
  };
});
angular.module("app").factory("getweekService", function() {

  return {
    getPrevPrevWeek: function(start) {
      //Calcing the starting point
      start = start || 0;
      var today = new Date(new Date().setHours(0, 0, 0, 0));
      var day = today.getDay() - start;
      var date = today.getDate() - day;
  
      // Grabbing Start/End Dates
      var EndDate = new Date(today.setDate(date));
      var StartDate = new Date(today.setDate(date - 6));
      return [StartDate, EndDate];
    },
    getPrevWeek: function(start) {
      //Calcing the starting point
      start = start || 0;
      var today = new Date(new Date().setHours(0, 0, 0, 0));
      var day = today.getDay() - start;
      var date = today.getDate() - day;
  
      // Grabbing Start/End Dates
      var EndDate = new Date(today.setDate(date));
      var StartDate = new Date(today.setDate(date - 6));
      return [StartDate, EndDate];
    },
    getCurrWeek: function() {
      var today = new Date(new Date().setHours(0, 0, 0, 0));
      var day = today.getDay();
      var date = today.getDate() - day;
      
      // Grabbing Start/End Dates
      var StartDate = new Date(today.setDate(date));
      var date = StartDate.getDate();
      var EndDate = new Date(today.setDate(date + 6));
      return [StartDate, EndDate];
    },
    getNextWeek: function(start) {
      //Calcing the starting point
      start = start || 0;
      var today = new Date(new Date().setHours(0, 0, 0, 0));
      var day = today.getDay() - start;
      var date = today.getDate() - day;
  
      // Grabbing Start/End Dates
      var StartDate = new Date(today.setDate(date));
      var date = StartDate.getDate();
      var EndDate = new Date(today.setDate(date + 6));
      return [StartDate, EndDate];
    },
  };
  
});
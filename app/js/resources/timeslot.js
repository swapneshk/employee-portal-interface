angular.module("app").factory("TimeSlotResource", function($resource) {
  
  return $resource('/api/timeslot');

});
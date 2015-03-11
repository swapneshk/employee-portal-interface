angular.module("app").directive("emNavigation", function() {

  return {
    restrict: "A",
    replace: true,
    transclude: true,
    template: JST["app/templates/navigation"],
    controller: "NavigationController"
  };
});
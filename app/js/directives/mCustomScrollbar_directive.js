angular.module("app").directive("mCustomScrollbar", function() {
    return {
        restrict: 'C',
        link: function (scope, el, attr, ngModel) {
            $(el).mCustomScrollbar({
			theme:"dark"
	    });
        }
    };
});
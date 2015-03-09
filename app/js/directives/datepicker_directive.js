angular.module("app").directive("datepicker", function() {
    return {
        restrict: 'C',
        require: 'ngModel',
        link: function (scope, el, attr, ngModel) {
            $(el).datetimepicker({
                format: 'm/d/Y',
                timepicker:false,
                onChangeDateTime:function(dp,$input){
                    scope.$apply(function () {
                        ngModel.$setViewValue($input.val());
                    });
                }
            });
        }
    };
});
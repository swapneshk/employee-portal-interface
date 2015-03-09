angular.module("app").directive("datetimepicker", function() {
    return {
        restrict: 'C',
        require: 'ngModel',
        link: function (scope, el, attr, ngModel) {
            $(el).datetimepicker({
                format: 'm/d/Y H:i',
                onChangeDateTime:function(dp,$input){
                    scope.$apply(function () {
                        ngModel.$setViewValue($input.val());
                    });
                }
            });
        }
    };
});
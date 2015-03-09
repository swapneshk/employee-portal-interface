angular.module("app").directive('chart', function() {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function($scope, element, attrs) {
            $scope.$watch(attrs.chk,function(){                
                jQuery('#chart').empty();
                var data  = $scope[attrs.data],
                xkey  = $scope[attrs.xkey],
                ykeys = $scope[attrs.ykeys],
                labels= $scope[attrs.labels];
                Morris.Bar({
                    element: element,
                    data: data,
                    xkey: xkey,
                    ykeys: ykeys,
                    labels: labels
                });
            });
        }
    };
});
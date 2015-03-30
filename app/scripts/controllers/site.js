'use strict';

/**
 * Site controller in case we need it.
 *
 * @author Mohamed Mansour 2015 (http://mohamedmansour.com)
 */
App.controller('SiteCtrl', ['$scope', 'progress', function ($scope, progress) {
    $scope.$watch( function () { return progress; }, function (data) {
        $scope.processMode = data.processMode;
        $scope.processDeterminateValue = data.processDeterminateValue;
        $scope.processTotal = data.processTotal;
        $scope.processCurrent= data.processCurrent;
        $scope.user = data.user;
    }, true);
}]);
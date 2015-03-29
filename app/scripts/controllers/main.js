'use strict';

/**
 * Core Angular Controller for the dashboard.
 *
 * @author Mohamed Mansour 2015 (http://mohamedmansour.com)
 */
App.controller('MainCtrl', ['$scope', 'facebookApi', 'utils', function ($scope, facebookApi, utils) {
    $scope.hello = 'Hey';

    // Make sure we are logged in to Facebook.
    facebookApi.Login().then(function(userId) {
        $scope.currentUser = userId;

        // Start fetching data.
        facebookApi.Fetch().then(function(permissions) {
            $scope.permissions = permissions;
        }, function(reason) {
            $scope.failed = reason;
        });
    }, function(reason) {
        $scope.failed = reason;
    });
    /*
    utils.Series(500, appIds, facebookApi.Delete, function (deleteResponses, executionTime) { 
        console.log('Successfully removed (' + deleteResponses.length + ') apps in ' + (exectionTime/1000) + 's');
    }, true);
    */
}]);

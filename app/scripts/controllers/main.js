'use strict';

/**
 * Core Angular Controller for the dashboard.
 *
 * @author Mohamed Mansour 2015 (http://mohamedmansour.com)
 */
App.controller('MainCtrl', ['$scope', 'facebookApi', 'utils', '$mdDialog', '$filter', 
        function ($scope, facebookApi, utils, $mdDialog, $filter) {

    $scope.processMode = null;
    $scope.processDeterminateValue = 0;
    $scope.processTotal = 0;
    $scope.processCurrent= 0;

    // Make sure we are logged in to Facebook.
    facebookApi.Login().then(function(userId) {
        $scope.currentUser = userId;

        // Start fetching data.
        facebookApi.Fetch().then(function(perms) {
            $scope.permissions = perms;
        }, function(reason) {
            $scope.failed = reason;
        });
    }, function(reason) {
        $scope.failed = reason;
    });

    /**
     * Revoking permission granted, start removing them.
     */
    function doRevoke() {
        var filter = $filter('filter');
        $scope.processMode = 'determinate';

        // Filter out the list of appIds so we can remove them.
        var appIds = filter($scope.permissions, { selected: true }).map(function(perm) {
            return perm.appId;
        });
        $scope.processTotal = appIds.length;
        $scope.processCurrent = 0;

        // Process them in series, 500ms at a time.
        utils.Series(500, appIds, facebookApi.Delete).then(function(deleteResponses) {
            $scope.processMode = null;
        }, function(reason) {
            console.error('Got error: ' + reason);
        }, function(update) {
            $scope.processCurrent = $scope.processCurrent + 1;
            $scope.processDeterminateValue = ($scope.processCurrent / $scope.processTotal) * 100;

            var permissionToRemove = filter($scope.permissions, {appId: update})[0];
            $scope.permissions.splice($scope.permissions.indexOf(permissionToRemove), 1);
        });
    }

    /**
     * Selects all permissions ready for removal.
     */
    $scope.selectAllPermissions = function() {
      angular.forEach($scope.permissions, function(item) {
         item.selected = true;
      });
    };

    /**
     * De-selects all permissions, implies user does not want to remove them.
     */
    $scope.deselectAllPermissions = function() {
      angular.forEach($scope.permissions, function(item) {
         item.selected = false;
      });
    };

    /**
     * Show the dialog to give the user one last time for revoking.
     * We need to pass permissions to this controller since it is an
     * isolated scope.
     */
    $scope.confirmRevoke = function($event) {
        var parentEl = angular.element(document.body);
        $mdDialog.show({
            parent: parentEl,
            targetEvent: $event,
            templateUrl: 'views/confirm_revoke_dialog.html',
            locals: {
                permissions: $filter('filter')($scope.permissions, { selected: true })
            },
            controller: function(scope, $mdDialog, permissions) {
                scope.permissions = permissions;
                scope.cancel = function() {
                    $mdDialog.cancel();
                };
                scope.revoke = function() {
                    $mdDialog.hide();
                };
            }
        }).then(doRevoke);
    };
}]);

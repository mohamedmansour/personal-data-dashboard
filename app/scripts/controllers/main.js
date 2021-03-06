'use strict';

/**
 * Core Angular Controller for the dashboard.
 *
 * @author Mohamed Mansour 2015 (http://mohamedmansour.com)
 */
App.controller('MainCtrl', ['$scope', 'facebookApi', 'utils', '$mdDialog', '$filter', 'authorization', 'progress',
        function ($scope, facebookApi, utils, $mdDialog, $filter, authorization, progress) {


    if (!authorization.authorize()) {
        return;
    }

    facebookApi.Fetch().then(function(perms) {
        $scope.permissions = perms;
    }, function(reason) {
        $scope.failed = reason;
    });

    /**
     * Revoking permission granted, start removing them.
     */
    function doRevoke() {
        var filter = $filter('filter');
        progress.processMode = 'determinate';

        // Filter out the list of appIds so we can remove them.
        var appIds = filter($scope.permissions, { selected: true }).map(function(perm) {
            return perm.appId;
        });
        progress.processTotal = appIds.length;
        progress.processCurrent = 0;

        // Process them in series, 500ms at a time.
        utils.Series(500, appIds, facebookApi.Delete).then(function(deleteResponses) {
            progress.processMode = null;
        }, function(reason) {
            console.error('Got error: ' + reason);
        }, function(update) {
            progress.processCurrent = progress.processCurrent + 1;
            progress.processDeterminateValue = (progress.processCurrent / progress.processTotal) * 100;

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
            clickOutsideToClose: true,
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

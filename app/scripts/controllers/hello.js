'use strict';

/**
 * Hello controller in case we need it.
 *
 * @author Mohamed Mansour 2015 (http://mohamedmansour.com)
 */
App.controller('HelloCtrl', ['$scope', '$state', 'facebookApi', 'progress', 
        function ($scope, $state, facebookApi, progress) {
    
    $scope.isReady = false;
    $scope.attemptingLogin = false;

    facebookApi.Login().then(function(userId) {
        progress.user = userId;
        $scope.isReady = false;
        $scope.attemptingLogin = false;
        $state.go('site.home');
    }, function(reason) {
        $scope.isReady = true;
        if (reason == 401) {
          $scope.error = 'Failed to login';
        }
        else {
          $scope.error = reason;
        }
    });

    $scope.gotoFacebook = function() {
        $scope.attemptingLogin = true;
        window.open('https://www.facebook.com/login.php');
    };

    $scope.refresh = function() {
        window.location.reload();
    };


}]);
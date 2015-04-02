'use strict';

/**
 * In charge of authorizing the user for specific pages.
 *
 * @author Mohamed Mansour 2015 (http://mohamedmansour.com)
 */
App.factory('authorization', ['$rootScope', '$state', 'progress', function($rootScope, $state, progress) {
    return {

        /**
         * Runs many callbacks in series and when done, it will fire a completion event.
         */
        authorize: function () {
            if (!progress.user && $rootScope.toState.data.roles && $rootScope.toState.data.roles.length) {
                // Now, send them to the signin state so they can log in
                $state.go('site.hello');
                return false;
            }
            return true;
        }
    };
}]);
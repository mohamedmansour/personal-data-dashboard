'use strict';

/**
 * Various Utils for Async callbacks.
 *
 * @author Mohamed Mansour 2015 (http://mohamedmansour.com)
 */
App.factory('utils', ['$q', function($q) {
    return {

        /**
         * Runs many callbacks in series and when done, it will fire a completion event.
         */
        Series: function (delay, listParameters, taskFn) {
            var deferred = $q.defer();
            var seriesResponses = [];
            var i = 0;

            var callNextTask = function () {
                if (i >= listParameters.length) {
                    deferred.resolve(seriesResponses);
                    return;
                }
                
                var parameter = listParameters[i++];
                taskFn(parameter).then(function (taskStatus) {
                    seriesResponses.push(taskStatus);
                    deferred.notify(parameter);
                    setTimeout(callNextTask, delay);
                });
            }

            callNextTask();

            return deferred.promise;
        }
    };
}]);

'use strict';

/**
 * Various Utils for Async callbacks.
 *
 * @author Mohamed Mansour 2015 (http://mohamedmansour.com)
 */
App.factory('utils', function() {
    return {

        /**
         * Runs many callbacks in series and when done, it will fire a completion event.
         */
        Series: function (delay, listParameters, taskFn, seriesCallback, loggingEnabled) {
            var seriesResponses = [];
            var i = 0;
            var totalExecutionTime = 0;
            var totalParameters = listParameters.length;

            var callNextTask = function () {
                if (i > listParameters.length) {
                    seriesCallback(seriesResponses, totalExecutionTime);
                    return;
                }
                
                var parameter = listParameters[i++];
                taskFn(parameter, function (taskStatus) {
                    seriesResponses.push(taskStatus);
                    setTimeout(callNextTask, delay);
                });

                totalExecutionTime = totalExecutionTime + delay;

                if (loggingEnabled) {
                    var remainderMilliseconds = totalExecutionTime % 2000;
                    if (remainderMilliseconds == 0) {
                        console.log("Executing " + i + '/' + totalParameters);
                    }
                }
            }

            callNextTask();
        }
    };
});

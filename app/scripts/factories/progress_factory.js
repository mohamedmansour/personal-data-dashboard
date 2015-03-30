'use strict';

/**
 * Progress for state saving.
 *
 * @author Mohamed Mansour 2015 (http://mohamedmansour.com)
 */
App.factory('progress', ['$q', function($q) {
    var processMode = 'query';
    var processDeterminateValue = 0;
    var processTotal = 0;
    var processCurrent= 0;
    var user = null;

    return {
        user: user,
        processMode: processMode,
        processDeterminateValue: processDeterminateValue,
        processTotal: processTotal,
        processCurrent: processCurrent
    };
}]);

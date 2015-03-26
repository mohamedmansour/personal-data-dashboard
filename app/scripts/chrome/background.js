'use strict';

// Mocking chrome variables for testing.
var EMPTY_FUNCTION = function() {};
var chrome = window.chrome || {
    browserAction: {
        onClicked: {
            addListener: EMPTY_FUNCTION
        }
    },
    extension: {
        getViews: EMPTY_FUNCTION,
        getURL: EMPTY_FUNCTION
    }
};

// Bind the browser action event to chrome. 
// Check if existing views for this extension that are running,
// when they are running, simply focus to them. Otherwise
// just refocus that tab.
chrome.browserAction.onClicked.addListener(function() {
	var views = chrome.extension.getViews({type:'tab'});
	if (!views.length) {
		window.open(chrome.extension.getURL('index.html'));
		return;
	}
	views[0].focus();
});
'use strict';

/**
 * Places a browser extension so accessing your private data would
 * be easily accessible anytime. 
 *
 * @author Mohamed Mansour 2015 (http://mohamedmansour.com)
 */

var openedTab = null;

// Bind the browser action event to chrome. 
// Check if existing views for this extension that are running,
// when they are running, simply focus to them. Otherwise
// just refocus that tab.
chrome.browserAction.onClicked.addListener(function() {
	var views = chrome.extension.getViews({type:'tab'});
	if (!views.length) {
        openedTab = window.open(chrome.extension.getURL('index.html'));
		return;
	}
    openedTab.focus();
});

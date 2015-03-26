// Mohamed Mansour 2015 http://mohamedmansour.com

// Bind the browser action event to chrome. 
// Check if existing views for this extension that are running,
// when they are running, simply focus to them. Otherwise
// just refocus that tab.
chrome.browserAction.onClicked.addListener(function(tab) {
	var views = chrome.extension.getViews({type:'tab'});
	if (!views.length) {
		window.open(chrome.extension.getURL('dashboard.html'));
		return;
	}
	views[0].focus();
});
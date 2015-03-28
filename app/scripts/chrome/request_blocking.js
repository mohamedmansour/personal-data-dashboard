'use strict';

/**
 * Updates the facebook extension requests to have the correct origin.
 *
 * Since we are running this extension in the background, cloak each request
 * as if it is coming from the website itself. For now deal with facebook
 * later on so we can be more strict and listen on our extension calls.
 *
 * Facebook refuses any request not coming from their origin, this hack makes
 * sure we are from the same origin. This allows us not to have facebook open
 * when using this extension. Convenient when we add the other sources. 
 *
 * @author Mohamed Mansour 2015 (http://mohamedmansour.com)
 */

var requestFilter = {
    urls: ["https://*.facebook.com/*"]
};

var extraInfoSpec = ['requestHeaders', 'blocking'];

var webRequestHandler = function(details) {
    var headers = details.requestHeaders;
    var blockingResponse = {};

    for (var i = 0, l = headers.length; i < l; ++i) {
        if (headers[i].name == 'Origin') {
            headers[i].value = "https://www.facebook.com";
            break;
        }
    }

    blockingResponse.requestHeaders = headers;
    return blockingResponse;
};


chrome.webRequest.onBeforeSendHeaders.addListener(
    webRequestHandler, 
    requestFilter, 
    extraInfoSpec);
'use strict';

/**
 * Facebook API to manage the privacy page. 
 *
 * @author Mohamed Mansour 2015 (http://mohamedmansour.com)
 */
angular.module('personalDataDashboardApp')
    .factory('facebookApi', ['$q', function($q) {
        const FB_LOGIN_URL = 'https://www.facebook.com/login.php?login_attempt=1';
        const FB_FETCH_URL = 'https://www.facebook.com/settings/applications/fetch_apps?tab=all&container_id=nill';
        const FB_DELETE_URL = 'https://www.facebook.com/ajax/settings/apps/delete_app.php?legacy=false&dialog=true&app_id=';

        // Setup the ajax response converter for facebook. This converter will decruft the 
        // json request from their server.
        $.ajaxSetup({
            converters: {
                "text json": function(result) {
                    return JSON.parse(result.replace('for (;;);', '')); 
                }
            }
        });

        // The secret token per session.
        var authToken = null;

        return {
            /**
             * Imitates Facebook XHR request with appropriate headers.
             */
            Post: function(url, data, callback, errorCallback) {

                // Fill up important details. These are required according to 
                // the AsyncRequest fb obj.
                data['__a'] = 1;
                data['fb_dtsg'] = authToken;

                // Fire off the request, everything should be in this contenttype, that is
                // what fb understands.
                $.ajax(url, {
                    data: data,
                    contentType: 'application/x-www-form-urlencoded',
                    type: 'POST',
                    dataType:"text json"
                }).done(function(resp) {
                    callback(resp);
                }).fail(function(jqXHR, textStatus ) {
                    errorCallback(textStatus);
                });
            },
            
            /**
             * Imitates Facebooks XHR calls, this was deofuscated by reversing the desktop
             * facebook requests. The AsyncRequest react class that facebook uses helped form
             * this request, we must have the fb_dtsg attribute in each post call to verify
             * the request origin. Since we cannot XHR the facebook.com url for CORS, 
             * the login url posting works great for POST requests and we use that to extract
             * the data we need.
             */
            Login: function() {
                var deferred = $q.defer();

                $.post(FB_LOGIN_URL, function(dom) {
                    var fbSig = dom.match(/name=\"fb_dtsg\" value=\"([\w-]+)\"/);
                    var userId = dom.match(/"USER_ID":"(\d+)"/);

                    // Check if we are logged in, otherwise exit.
                    if (!fbSig || !userId) {
                        deferred.reject(401);
                        return;
                    }

                    // Store the auth token so we can use it for every request.
                    authToken = fbSig[1];

                    deferred.resolve(userId[1]);
                });

                return deferred.promise;
            },

            /**
             * Does a App Id fetching. Since they are using React, the appId and templating
             * are separate. Here we merge the responses together.
             */
            Fetch: function() {
                var deferred = $q.defer();

                this.Post(FB_FETCH_URL, {}, function(responseJson) {
                    // The jsmods have all the appIds associated, thats how reactjs works/
                    var appIdArr = responseJson.jsmods.require.map(function(jsmod) {
                        if(jsmod[1] == 'registerApp') {
                            return jsmod[3][1];
                        }
                    });

                    // The associated dom for the core apps, they will have the images and
                    // the associated text names.
                    var p = 0;
                    var $permissions = $('div[id]', $(responseJson.domops[0][3].__html));
                    var permissions = [];
                    $permissions.each(function(idx, $perm) {
                        permissions.push({
                            img: $perm.querySelector('img').src,
                            appId: appIdArr[p++],
                            name: $perm.querySelector('.ellipsis').innerText,
                        });
                    });

                    deferred.resolve(permissions);
                }, function(errorCode) {
                    deferred.reject(errorCode);
                });

                return deferred.promise;
            },

            /**
             * Fires a request to delete the appId with appropriate data headers, again
             * verified from AsynRequest and browser sniffing.
             */
            Delete: function(appId) {
                var deferred = $q.defer();

                var data = {
                    app_id:appId,
                    legacy:false,
                    dialog:true,
                    confirmed:true,
                    ban_user:0
                };

                this.Post(FB_DELETE_URL + appId, data, function() {
                    deferred.resolve();
                }, function(error) {
                    deferred.reject(errorCode);;
                });

                return deferred.promise;
            }
        }
    }]);
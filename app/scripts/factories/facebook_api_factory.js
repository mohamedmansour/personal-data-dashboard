'use strict';

/**
 * Facebook API to manage the privacy page. 
 *
 * @author Mohamed Mansour 2015 (http://mohamedmansour.com)
 */
App.factory('facebookApi', ['$q', '$http', function($q, $http) {
    const FB_LOGIN_URL = 'https://www.facebook.com/login.php?login_attempt=1';
    const FB_FETCH_URL = 'https://www.facebook.com/settings/applications/fetch_apps?tab=all&container_id=nill';
    const FB_DELETE_URL = 'https://www.facebook.com/ajax/settings/apps/delete_app.php?legacy=false&dialog=true&app_id=';

    // The secret token per session.
    var authToken = null;

    return {
        /**
         * Imitates Facebook XHR request with appropriate headers.
         */
        Post: function(url, postData, callback, errorCallback) {

            // Fill up important details. These are required according to 
            // the AsyncRequest fb obj.
            postData['__a'] = 1;
            postData['fb_dtsg'] = authToken;

            // Fire off the request, everything should be in this contenttype, that is
            // what fb understands. We need to transform the request to key-value& pairs
            // since it doesn't operate the same way as jQuery
            $http({
                method: 'POST',
                url: url,
                data: postData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
            }).success(function(data) {
                callback(angular.fromJson(data.replace('for (;;);', '')));
            }).error(function(data) {
                errorCallback(data);
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

            $http.post(FB_LOGIN_URL).success(function(dom) {
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
            }).error(function(data) {
                deferred.reject(data);
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
                var rawHTML = responseJson.domops[0][3].__html;
                var unsanitizedPermissions = angular.element(rawHTML)[0].querySelectorAll('div[id]');
                var permissions = [];
                var permissionIndex = 0;
                angular.forEach(unsanitizedPermissions, function(perm) {
                    permissions.push({
                        img: perm.querySelector('img').src,
                        appId: appIdArr[permissionIndex++],
                        name: perm.querySelector('.ellipsis').innerText,
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
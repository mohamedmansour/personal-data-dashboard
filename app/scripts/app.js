'use strict';

/**
 * Main AngularJS Entry Point.
 *
 * @author Mohamed Mansour 2015 (http://mohamedmansour.com)
 */
var App = angular
    .module('personalDataDashboardApp', [
        'ui.router',
        'ngAnimate',
        'ngMaterial'
    ])
    .run(['$rootScope', '$state', '$stateParams', '$location', 'progress', 'authorization', 
                function ($rootScope, $state, $stateParams, $location, progress, authorization) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;


        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;
        });

        /*// Hookup Google Analytics for sub pages when viewed.
        $rootScope.$on('$viewContentLoaded', function(event) {
            $window.ga('send', 'pageview', { page: $location.url() });
        });*/
    }])
    .config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {
        $urlRouterProvider.otherwise('/hello');

        $stateProvider
            .state('site', {
                url: '/',
                abstract: true,
                views: {
                    'site@': {
                        templateUrl: 'views/site.html',
                        controller: 'SiteCtrl',
                    }
                }
            })
            .state('site.hello', {
                url: 'hello',
                views: {
                    'content': {
                        templateUrl: 'views/hello.html',
                        controller: 'HelloCtrl',
                    }
                },
                data: {
                    roles: []
                }
            })
            .state('site.home', {
                url: 'home',
                views: {
                    'content': {
                        templateUrl: 'views/main.html',
                        controller: 'MainCtrl',
                    }
                },
                data: {
                    roles: ['User']
                }
            })
            .state('site.donate', {
                url: 'donate',
                views: {
                    'content': {
                        templateUrl: 'views/donate.html',
                        controller: 'DonateCtrl'
                    }
                },
                data: {
                    roles: []
                }
            });

        $mdThemingProvider.theme('default')
            .primaryPalette('light-blue')
            .accentPalette('yellow')
            .warnPalette('grey');
    }]);
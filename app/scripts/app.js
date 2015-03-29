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
    .run(['$rootScope', '$state', '$stateParams', '$location', function ($rootScope, $state, $stateParams, $location) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        /*// Hookup Google Analytics for sub pages when viewed.
        $rootScope.$on('$viewContentLoaded', function(event) {
            $window.ga('send', 'pageview', { page: $location.url() });
        });*/
    }])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,   $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            });
    }]);
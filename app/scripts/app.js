'use strict';

/**
 * Main module of the application.
 */
angular
    .module('personalDataDashboardApp', [
        'ui.router',
        'ngAnimate',
        'ngResource',
        'ui.bootstrap'
    ])
    .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
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
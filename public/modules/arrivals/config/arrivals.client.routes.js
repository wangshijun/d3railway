'use strict';

//Setting up route
angular.module('arrivals').config(['$stateProvider',
    function($stateProvider) {
        // Arrivals state routing
        $stateProvider.
        state('listArrivals', {
            url: '/arrivals',
            templateUrl: 'modules/arrivals/views/list-arrivals.client.view.html'
        }).
        state('createArrival', {
            url: '/arrivals/create',
            templateUrl: 'modules/arrivals/views/create-arrival.client.view.html'
        }).
        state('viewArrival', {
            url: '/arrivals/:arrivalId',
            templateUrl: 'modules/arrivals/views/view-arrival.client.view.html'
        }).
        state('editArrival', {
            url: '/arrivals/:arrivalId/edit',
            templateUrl: 'modules/arrivals/views/edit-arrival.client.view.html'
        });
    }
]);

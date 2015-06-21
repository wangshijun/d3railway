'use strict';

//Setting up route
angular.module('departures').config(['$stateProvider',
    function($stateProvider) {
        // Departures state routing
        $stateProvider.
        state('listDepartures', {
            url: '/departures',
            templateUrl: 'modules/departures/views/list-departures.client.view.html'
        }).
        state('createDeparture', {
            url: '/departures/create',
            templateUrl: 'modules/departures/views/create-departure.client.view.html'
        }).
        state('viewDeparture', {
            url: '/departures/:departureId',
            templateUrl: 'modules/departures/views/view-departure.client.view.html'
        }).
        state('editDeparture', {
            url: '/departures/:departureId/edit',
            templateUrl: 'modules/departures/views/edit-departure.client.view.html'
        });
    }
]);

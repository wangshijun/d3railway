'use strict';

//Setting up route
angular.module('trains').config(['$stateProvider',
    function($stateProvider) {
        // Trains state routing
        $stateProvider.
        state('listTrains', {
            url: '/trains',
            templateUrl: 'modules/trains/views/list-trains.client.view.html'
        }).
        state('createTrain', {
            url: '/trains/create',
            templateUrl: 'modules/trains/views/create-train.client.view.html'
        }).
        state('viewTrain', {
            url: '/trains/:trainId',
            templateUrl: 'modules/trains/views/view-train.client.view.html'
        }).
        state('editTrain', {
            url: '/trains/:trainId/edit',
            templateUrl: 'modules/trains/views/edit-train.client.view.html'
        });
    }
]);

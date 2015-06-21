'use strict';

//Departures service used to communicate Departures REST endpoints
angular.module('departures').factory('Departures', ['$resource',
    function($resource) {
        return $resource('departures/:departureId', { departureId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

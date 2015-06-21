'use strict';

//Arrivals service used to communicate Arrivals REST endpoints
angular.module('arrivals').factory('Arrivals', ['$resource',
    function($resource) {
        return $resource('arrivals/:arrivalId', { arrivalId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

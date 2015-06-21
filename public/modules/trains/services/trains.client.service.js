'use strict';

//Trains service used to communicate Trains REST endpoints
angular.module('trains').factory('Trains', ['$resource',
    function($resource) {
        return $resource('trains/:trainId', { trainId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

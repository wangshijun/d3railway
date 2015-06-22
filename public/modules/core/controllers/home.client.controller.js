'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Trains',
    function($scope, Authentication, Trains) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        $scope.trains = Trains.query();
    }
]);

'use strict';

// Arrivals controller
angular.module('arrivals').controller('ArrivalsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Arrivals',
    function($scope, $stateParams, $location, Authentication, Arrivals) {
        $scope.authentication = Authentication;

        // Create new Arrival
        $scope.create = function() {
            // Create new Arrival object
            var arrival = new Arrivals ({
                name: this.name
            });

            // Redirect after save
            arrival.$save(function(response) {
                $location.path('arrivals');

                // Clear form fields
                $scope.name = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Arrival
        $scope.remove = function(arrival) {
            if ( arrival ) {
                arrival.$remove();

                for (var i in $scope.arrivals) {
                    if ($scope.arrivals [i] === arrival) {
                        $scope.arrivals.splice(i, 1);
                    }
                }
            } else {
                $scope.arrival.$remove(function() {
                    $location.path('arrivals');
                });
            }
        };

        // Update existing Arrival
        $scope.update = function() {
            var arrival = $scope.arrival;

            arrival.$update(function() {
                $location.path('arrivals');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Arrivals
        $scope.find = function() {
            $scope.arrivals = Arrivals.query();
        };

        // Find existing Arrival
        $scope.findOne = function() {
            $scope.arrival = Arrivals.get({
                arrivalId: $stateParams.arrivalId
            });
        };
    }
]);

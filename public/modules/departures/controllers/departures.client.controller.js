'use strict';

// Departures controller
angular.module('departures').controller('DeparturesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Departures',
    function($scope, $stateParams, $location, Authentication, Departures) {
        $scope.authentication = Authentication;

        // Create new Departure
        $scope.create = function() {
            // Create new Departure object
            var departure = new Departures ({
                name: this.name
            });

            // Redirect after save
            departure.$save(function(response) {
                $location.path('departures');

                // Clear form fields
                $scope.name = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Departure
        $scope.remove = function(departure) {
            if ( departure ) {
                departure.$remove();

                for (var i in $scope.departures) {
                    if ($scope.departures [i] === departure) {
                        $scope.departures.splice(i, 1);
                    }
                }
            } else {
                $scope.departure.$remove(function() {
                    $location.path('departures');
                });
            }
        };

        // Update existing Departure
        $scope.update = function() {
            var departure = $scope.departure;

            departure.$update(function() {
                $location.path('departures');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Departures
        $scope.find = function() {
            $scope.departures = Departures.query();
        };

        // Find existing Departure
        $scope.findOne = function() {
            $scope.departure = Departures.get({
                departureId: $stateParams.departureId
            });
        };
    }
]);

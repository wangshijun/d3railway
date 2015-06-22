'use strict';

// Trains controller
angular.module('trains').controller('TrainsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trains', 'Tracks', 'Arrivals', 'Departures',
    function($scope, $stateParams, $location, Authentication, Trains, Tracks, Arrivals, Departures) {
        $scope.authentication = Authentication;

        $scope.tracks = Tracks.query();
        $scope.arrivals = Arrivals.query();
        $scope.departures = Departures.query();

        $scope.arrivalTime = new Date();
        $scope.departureTime = new Date();

        // Create new Train
        $scope.create = function() {
            console.log(this);

            // Create new Train object
            var train = new Trains ({
                name: this.name,
                section: this.section,
                track: this.track,
                arrival: this.arrival,
                arrivalTime: this.arrivalTime,
                departure: this.departure,
                departureTime: this.departureTime,
            });

            // Redirect after save
            train.$save(function(response) {
                $location.path('trains');

                // Clear form fields
                $scope.name = '';
                $scope.section = '';
                $scope.track = '';
                $scope.arrival = '';
                $scope.arrivalTime = '';
                $scope.departure = '';
                $scope.departureTime = '';

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Train
        $scope.remove = function(train) {
            if ( train ) {
                train.$remove();

                for (var i in $scope.trains) {
                    if ($scope.trains [i] === train) {
                        $scope.trains.splice(i, 1);
                    }
                }
            } else {
                $scope.train.$remove(function() {
                    $location.path('trains');
                });
            }
        };

        // Update existing Train
        $scope.update = function() {
            var train = $scope.train;

            train.$update(function() {
                $location.path('trains');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Trains
        $scope.find = function() {
            $scope.trains = Trains.query();
        };

        // Find existing Train
        $scope.findOne = function() {
            $scope.train = Trains.get({
                trainId: $stateParams.trainId
            });
        };
    }
]);

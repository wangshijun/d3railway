'use strict';

// Trains controller
angular.module('trains').controller('TrainsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trains',
    function($scope, $stateParams, $location, Authentication, Trains) {
        $scope.authentication = Authentication;

        // Create new Train
        $scope.create = function() {
            // Create new Train object
            var train = new Trains ({
                name: this.name
            });

            // Redirect after save
            train.$save(function(response) {
                $location.path('trains/' + response._id);

                // Clear form fields
                $scope.name = '';
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
                $location.path('trains/' + train._id);
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

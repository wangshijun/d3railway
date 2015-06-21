'use strict';

(function() {
    // Trains Controller Spec
    describe('Trains Controller Tests', function() {
        // Initialize global variables
        var TrainsController,
        scope,
        $httpBackend,
        $stateParams,
        $location;

        // The $resource service augments the response object with methods for updating and deleting the resource.
        // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
        // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
        // When the toEqualData matcher compares two objects, it takes only object properties into
        // account and ignores methods.
        beforeEach(function() {
            jasmine.addMatchers({
                toEqualData: function(util, customEqualityTesters) {
                    return {
                        compare: function(actual, expected) {
                            return {
                                pass: angular.equals(actual, expected)
                            };
                        }
                    };
                }
            });
        });

        // Then we can start by loading the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
        // This allows us to inject a service but then attach it to a variable
        // with the same name as the service.
        beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
            // Set a new global scope
            scope = $rootScope.$new();

            // Point global variables to injected services
            $stateParams = _$stateParams_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;

            // Initialize the Trains controller.
            TrainsController = $controller('TrainsController', {
                $scope: scope
            });
        }));

        it('$scope.find() should create an array with at least one Train object fetched from XHR', inject(function(Trains) {
            // Create sample Train using the Trains service
            var sampleTrain = new Trains({
                name: 'New Train'
            });

            // Create a sample Trains array that includes the new Train
            var sampleTrains = [sampleTrain];

            // Set GET response
            $httpBackend.expectGET('trains').respond(sampleTrains);

            // Run controller functionality
            scope.find();
            $httpBackend.flush();

            // Test scope value
            expect(scope.trains).toEqualData(sampleTrains);
        }));

        it('$scope.findOne() should create an array with one Train object fetched from XHR using a trainId URL parameter', inject(function(Trains) {
            // Define a sample Train object
            var sampleTrain = new Trains({
                name: 'New Train'
            });

            // Set the URL parameter
            $stateParams.trainId = '525a8422f6d0f87f0e407a33';

            // Set GET response
            $httpBackend.expectGET(/trains\/([0-9a-fA-F]{24})$/).respond(sampleTrain);

            // Run controller functionality
            scope.findOne();
            $httpBackend.flush();

            // Test scope value
            expect(scope.train).toEqualData(sampleTrain);
        }));

        it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Trains) {
            // Create a sample Train object
            var sampleTrainPostData = new Trains({
                name: 'New Train'
            });

            // Create a sample Train response
            var sampleTrainResponse = new Trains({
                _id: '525cf20451979dea2c000001',
                name: 'New Train'
            });

            // Fixture mock form input values
            scope.name = 'New Train';

            // Set POST response
            $httpBackend.expectPOST('trains', sampleTrainPostData).respond(sampleTrainResponse);

            // Run controller functionality
            scope.create();
            $httpBackend.flush();

            // Test form inputs are reset
            expect(scope.name).toEqual('');

            // Test URL redirection after the Train was created
            expect($location.path()).toBe('/trains/' + sampleTrainResponse._id);
        }));

        it('$scope.update() should update a valid Train', inject(function(Trains) {
            // Define a sample Train put data
            var sampleTrainPutData = new Trains({
                _id: '525cf20451979dea2c000001',
                name: 'New Train'
            });

            // Mock Train in scope
            scope.train = sampleTrainPutData;

            // Set PUT response
            $httpBackend.expectPUT(/trains\/([0-9a-fA-F]{24})$/).respond();

            // Run controller functionality
            scope.update();
            $httpBackend.flush();

            // Test URL location to new object
            expect($location.path()).toBe('/trains/' + sampleTrainPutData._id);
        }));

        it('$scope.remove() should send a DELETE request with a valid trainId and remove the Train from the scope', inject(function(Trains) {
            // Create new Train object
            var sampleTrain = new Trains({
                _id: '525a8422f6d0f87f0e407a33'
            });

            // Create new Trains array and include the Train
            scope.trains = [sampleTrain];

            // Set expected DELETE response
            $httpBackend.expectDELETE(/trains\/([0-9a-fA-F]{24})$/).respond(204);

            // Run controller functionality
            scope.remove(sampleTrain);
            $httpBackend.flush();

            // Test array after successful delete
            expect(scope.trains.length).toBe(0);
        }));
    });
}());

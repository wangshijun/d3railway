'use strict';

(function() {
    // Arrivals Controller Spec
    describe('Arrivals Controller Tests', function() {
        // Initialize global variables
        var ArrivalsController,
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

            // Initialize the Arrivals controller.
            ArrivalsController = $controller('ArrivalsController', {
                $scope: scope
            });
        }));

        it('$scope.find() should create an array with at least one Arrival object fetched from XHR', inject(function(Arrivals) {
            // Create sample Arrival using the Arrivals service
            var sampleArrival = new Arrivals({
                name: 'New Arrival'
            });

            // Create a sample Arrivals array that includes the new Arrival
            var sampleArrivals = [sampleArrival];

            // Set GET response
            $httpBackend.expectGET('arrivals').respond(sampleArrivals);

            // Run controller functionality
            scope.find();
            $httpBackend.flush();

            // Test scope value
            expect(scope.arrivals).toEqualData(sampleArrivals);
        }));

        it('$scope.findOne() should create an array with one Arrival object fetched from XHR using a arrivalId URL parameter', inject(function(Arrivals) {
            // Define a sample Arrival object
            var sampleArrival = new Arrivals({
                name: 'New Arrival'
            });

            // Set the URL parameter
            $stateParams.arrivalId = '525a8422f6d0f87f0e407a33';

            // Set GET response
            $httpBackend.expectGET(/arrivals\/([0-9a-fA-F]{24})$/).respond(sampleArrival);

            // Run controller functionality
            scope.findOne();
            $httpBackend.flush();

            // Test scope value
            expect(scope.arrival).toEqualData(sampleArrival);
        }));

        it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Arrivals) {
            // Create a sample Arrival object
            var sampleArrivalPostData = new Arrivals({
                name: 'New Arrival'
            });

            // Create a sample Arrival response
            var sampleArrivalResponse = new Arrivals({
                _id: '525cf20451979dea2c000001',
                name: 'New Arrival'
            });

            // Fixture mock form input values
            scope.name = 'New Arrival';

            // Set POST response
            $httpBackend.expectPOST('arrivals', sampleArrivalPostData).respond(sampleArrivalResponse);

            // Run controller functionality
            scope.create();
            $httpBackend.flush();

            // Test form inputs are reset
            expect(scope.name).toEqual('');

            // Test URL redirection after the Arrival was created
            expect($location.path()).toBe('/arrivals/' + sampleArrivalResponse._id);
        }));

        it('$scope.update() should update a valid Arrival', inject(function(Arrivals) {
            // Define a sample Arrival put data
            var sampleArrivalPutData = new Arrivals({
                _id: '525cf20451979dea2c000001',
                name: 'New Arrival'
            });

            // Mock Arrival in scope
            scope.arrival = sampleArrivalPutData;

            // Set PUT response
            $httpBackend.expectPUT(/arrivals\/([0-9a-fA-F]{24})$/).respond();

            // Run controller functionality
            scope.update();
            $httpBackend.flush();

            // Test URL location to new object
            expect($location.path()).toBe('/arrivals/' + sampleArrivalPutData._id);
        }));

        it('$scope.remove() should send a DELETE request with a valid arrivalId and remove the Arrival from the scope', inject(function(Arrivals) {
            // Create new Arrival object
            var sampleArrival = new Arrivals({
                _id: '525a8422f6d0f87f0e407a33'
            });

            // Create new Arrivals array and include the Arrival
            scope.arrivals = [sampleArrival];

            // Set expected DELETE response
            $httpBackend.expectDELETE(/arrivals\/([0-9a-fA-F]{24})$/).respond(204);

            // Run controller functionality
            scope.remove(sampleArrival);
            $httpBackend.flush();

            // Test array after successful delete
            expect(scope.arrivals.length).toBe(0);
        }));
    });
}());

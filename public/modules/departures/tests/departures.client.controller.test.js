'use strict';

(function() {
    // Departures Controller Spec
    describe('Departures Controller Tests', function() {
        // Initialize global variables
        var DeparturesController,
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

            // Initialize the Departures controller.
            DeparturesController = $controller('DeparturesController', {
                $scope: scope
            });
        }));

        it('$scope.find() should create an array with at least one Departure object fetched from XHR', inject(function(Departures) {
            // Create sample Departure using the Departures service
            var sampleDeparture = new Departures({
                name: 'New Departure'
            });

            // Create a sample Departures array that includes the new Departure
            var sampleDepartures = [sampleDeparture];

            // Set GET response
            $httpBackend.expectGET('departures').respond(sampleDepartures);

            // Run controller functionality
            scope.find();
            $httpBackend.flush();

            // Test scope value
            expect(scope.departures).toEqualData(sampleDepartures);
        }));

        it('$scope.findOne() should create an array with one Departure object fetched from XHR using a departureId URL parameter', inject(function(Departures) {
            // Define a sample Departure object
            var sampleDeparture = new Departures({
                name: 'New Departure'
            });

            // Set the URL parameter
            $stateParams.departureId = '525a8422f6d0f87f0e407a33';

            // Set GET response
            $httpBackend.expectGET(/departures\/([0-9a-fA-F]{24})$/).respond(sampleDeparture);

            // Run controller functionality
            scope.findOne();
            $httpBackend.flush();

            // Test scope value
            expect(scope.departure).toEqualData(sampleDeparture);
        }));

        it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Departures) {
            // Create a sample Departure object
            var sampleDeparturePostData = new Departures({
                name: 'New Departure'
            });

            // Create a sample Departure response
            var sampleDepartureResponse = new Departures({
                _id: '525cf20451979dea2c000001',
                name: 'New Departure'
            });

            // Fixture mock form input values
            scope.name = 'New Departure';

            // Set POST response
            $httpBackend.expectPOST('departures', sampleDeparturePostData).respond(sampleDepartureResponse);

            // Run controller functionality
            scope.create();
            $httpBackend.flush();

            // Test form inputs are reset
            expect(scope.name).toEqual('');

            // Test URL redirection after the Departure was created
            expect($location.path()).toBe('/departures/' + sampleDepartureResponse._id);
        }));

        it('$scope.update() should update a valid Departure', inject(function(Departures) {
            // Define a sample Departure put data
            var sampleDeparturePutData = new Departures({
                _id: '525cf20451979dea2c000001',
                name: 'New Departure'
            });

            // Mock Departure in scope
            scope.departure = sampleDeparturePutData;

            // Set PUT response
            $httpBackend.expectPUT(/departures\/([0-9a-fA-F]{24})$/).respond();

            // Run controller functionality
            scope.update();
            $httpBackend.flush();

            // Test URL location to new object
            expect($location.path()).toBe('/departures/' + sampleDeparturePutData._id);
        }));

        it('$scope.remove() should send a DELETE request with a valid departureId and remove the Departure from the scope', inject(function(Departures) {
            // Create new Departure object
            var sampleDeparture = new Departures({
                _id: '525a8422f6d0f87f0e407a33'
            });

            // Create new Departures array and include the Departure
            scope.departures = [sampleDeparture];

            // Set expected DELETE response
            $httpBackend.expectDELETE(/departures\/([0-9a-fA-F]{24})$/).respond(204);

            // Run controller functionality
            scope.remove(sampleDeparture);
            $httpBackend.flush();

            // Test array after successful delete
            expect(scope.departures.length).toBe(0);
        }));
    });
}());

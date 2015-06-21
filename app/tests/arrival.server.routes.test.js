'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Arrival = mongoose.model('Arrival'),
    agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, arrival;

/**
 * Arrival routes tests
 */
describe('Arrival CRUD tests', function() {
    beforeEach(function(done) {
        // Create user credentials
        credentials = {
            username: 'username',
            password: 'password'
        };

        // Create a new user
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: credentials.username,
            password: credentials.password,
            provider: 'local'
        });

        // Save a user to the test db and create new Arrival
        user.save(function() {
            arrival = {
                name: 'Arrival Name'
            };

            done();
        });
    });

    it('should be able to save Arrival instance if logged in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Arrival
                agent.post('/arrivals')
                    .send(arrival)
                    .expect(200)
                    .end(function(arrivalSaveErr, arrivalSaveRes) {
                        // Handle Arrival save error
                        if (arrivalSaveErr) done(arrivalSaveErr);

                        // Get a list of Arrivals
                        agent.get('/arrivals')
                            .end(function(arrivalsGetErr, arrivalsGetRes) {
                                // Handle Arrival save error
                                if (arrivalsGetErr) done(arrivalsGetErr);

                                // Get Arrivals list
                                var arrivals = arrivalsGetRes.body;

                                // Set assertions
                                (arrivals[0].user._id).should.equal(userId);
                                (arrivals[0].name).should.match('Arrival Name');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save Arrival instance if not logged in', function(done) {
        agent.post('/arrivals')
            .send(arrival)
            .expect(401)
            .end(function(arrivalSaveErr, arrivalSaveRes) {
                // Call the assertion callback
                done(arrivalSaveErr);
            });
    });

    it('should not be able to save Arrival instance if no name is provided', function(done) {
        // Invalidate name field
        arrival.name = '';

        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Arrival
                agent.post('/arrivals')
                    .send(arrival)
                    .expect(400)
                    .end(function(arrivalSaveErr, arrivalSaveRes) {
                        // Set message assertion
                        (arrivalSaveRes.body.message).should.match('Please fill Arrival name');
                        
                        // Handle Arrival save error
                        done(arrivalSaveErr);
                    });
            });
    });

    it('should be able to update Arrival instance if signed in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Arrival
                agent.post('/arrivals')
                    .send(arrival)
                    .expect(200)
                    .end(function(arrivalSaveErr, arrivalSaveRes) {
                        // Handle Arrival save error
                        if (arrivalSaveErr) done(arrivalSaveErr);

                        // Update Arrival name
                        arrival.name = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update existing Arrival
                        agent.put('/arrivals/' + arrivalSaveRes.body._id)
                            .send(arrival)
                            .expect(200)
                            .end(function(arrivalUpdateErr, arrivalUpdateRes) {
                                // Handle Arrival update error
                                if (arrivalUpdateErr) done(arrivalUpdateErr);

                                // Set assertions
                                (arrivalUpdateRes.body._id).should.equal(arrivalSaveRes.body._id);
                                (arrivalUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Arrivals if not signed in', function(done) {
        // Create new Arrival model instance
        var arrivalObj = new Arrival(arrival);

        // Save the Arrival
        arrivalObj.save(function() {
            // Request Arrivals
            request(app).get('/arrivals')
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.an.Array.with.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });


    it('should be able to get a single Arrival if not signed in', function(done) {
        // Create new Arrival model instance
        var arrivalObj = new Arrival(arrival);

        // Save the Arrival
        arrivalObj.save(function() {
            request(app).get('/arrivals/' + arrivalObj._id)
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.an.Object.with.property('name', arrival.name);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should be able to delete Arrival instance if signed in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Arrival
                agent.post('/arrivals')
                    .send(arrival)
                    .expect(200)
                    .end(function(arrivalSaveErr, arrivalSaveRes) {
                        // Handle Arrival save error
                        if (arrivalSaveErr) done(arrivalSaveErr);

                        // Delete existing Arrival
                        agent.delete('/arrivals/' + arrivalSaveRes.body._id)
                            .send(arrival)
                            .expect(200)
                            .end(function(arrivalDeleteErr, arrivalDeleteRes) {
                                // Handle Arrival error error
                                if (arrivalDeleteErr) done(arrivalDeleteErr);

                                // Set assertions
                                (arrivalDeleteRes.body._id).should.equal(arrivalSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete Arrival instance if not signed in', function(done) {
        // Set Arrival user 
        arrival.user = user;

        // Create new Arrival model instance
        var arrivalObj = new Arrival(arrival);

        // Save the Arrival
        arrivalObj.save(function() {
            // Try deleting Arrival
            request(app).delete('/arrivals/' + arrivalObj._id)
            .expect(401)
            .end(function(arrivalDeleteErr, arrivalDeleteRes) {
                // Set message assertion
                (arrivalDeleteRes.body.message).should.match('User is not logged in');

                // Handle Arrival error error
                done(arrivalDeleteErr);
            });

        });
    });

    afterEach(function(done) {
        User.remove().exec();
        Arrival.remove().exec();
        done();
    });
});

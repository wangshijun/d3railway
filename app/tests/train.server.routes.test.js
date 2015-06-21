'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Train = mongoose.model('Train'),
    agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, train;

/**
 * Train routes tests
 */
describe('Train CRUD tests', function() {
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

        // Save a user to the test db and create new Train
        user.save(function() {
            train = {
                name: 'Train Name'
            };

            done();
        });
    });

    it('should be able to save Train instance if logged in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Train
                agent.post('/trains')
                    .send(train)
                    .expect(200)
                    .end(function(trainSaveErr, trainSaveRes) {
                        // Handle Train save error
                        if (trainSaveErr) done(trainSaveErr);

                        // Get a list of Trains
                        agent.get('/trains')
                            .end(function(trainsGetErr, trainsGetRes) {
                                // Handle Train save error
                                if (trainsGetErr) done(trainsGetErr);

                                // Get Trains list
                                var trains = trainsGetRes.body;

                                // Set assertions
                                (trains[0].user._id).should.equal(userId);
                                (trains[0].name).should.match('Train Name');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save Train instance if not logged in', function(done) {
        agent.post('/trains')
            .send(train)
            .expect(401)
            .end(function(trainSaveErr, trainSaveRes) {
                // Call the assertion callback
                done(trainSaveErr);
            });
    });

    it('should not be able to save Train instance if no name is provided', function(done) {
        // Invalidate name field
        train.name = '';

        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Train
                agent.post('/trains')
                    .send(train)
                    .expect(400)
                    .end(function(trainSaveErr, trainSaveRes) {
                        // Set message assertion
                        (trainSaveRes.body.message).should.match('Please fill Train name');
                        
                        // Handle Train save error
                        done(trainSaveErr);
                    });
            });
    });

    it('should be able to update Train instance if signed in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Train
                agent.post('/trains')
                    .send(train)
                    .expect(200)
                    .end(function(trainSaveErr, trainSaveRes) {
                        // Handle Train save error
                        if (trainSaveErr) done(trainSaveErr);

                        // Update Train name
                        train.name = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update existing Train
                        agent.put('/trains/' + trainSaveRes.body._id)
                            .send(train)
                            .expect(200)
                            .end(function(trainUpdateErr, trainUpdateRes) {
                                // Handle Train update error
                                if (trainUpdateErr) done(trainUpdateErr);

                                // Set assertions
                                (trainUpdateRes.body._id).should.equal(trainSaveRes.body._id);
                                (trainUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Trains if not signed in', function(done) {
        // Create new Train model instance
        var trainObj = new Train(train);

        // Save the Train
        trainObj.save(function() {
            // Request Trains
            request(app).get('/trains')
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.an.Array.with.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });


    it('should be able to get a single Train if not signed in', function(done) {
        // Create new Train model instance
        var trainObj = new Train(train);

        // Save the Train
        trainObj.save(function() {
            request(app).get('/trains/' + trainObj._id)
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.an.Object.with.property('name', train.name);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should be able to delete Train instance if signed in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Train
                agent.post('/trains')
                    .send(train)
                    .expect(200)
                    .end(function(trainSaveErr, trainSaveRes) {
                        // Handle Train save error
                        if (trainSaveErr) done(trainSaveErr);

                        // Delete existing Train
                        agent.delete('/trains/' + trainSaveRes.body._id)
                            .send(train)
                            .expect(200)
                            .end(function(trainDeleteErr, trainDeleteRes) {
                                // Handle Train error error
                                if (trainDeleteErr) done(trainDeleteErr);

                                // Set assertions
                                (trainDeleteRes.body._id).should.equal(trainSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete Train instance if not signed in', function(done) {
        // Set Train user 
        train.user = user;

        // Create new Train model instance
        var trainObj = new Train(train);

        // Save the Train
        trainObj.save(function() {
            // Try deleting Train
            request(app).delete('/trains/' + trainObj._id)
            .expect(401)
            .end(function(trainDeleteErr, trainDeleteRes) {
                // Set message assertion
                (trainDeleteRes.body.message).should.match('User is not logged in');

                // Handle Train error error
                done(trainDeleteErr);
            });

        });
    });

    afterEach(function(done) {
        User.remove().exec();
        Train.remove().exec();
        done();
    });
});

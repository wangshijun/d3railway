'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Departure = mongoose.model('Departure'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, departure;

/**
 * Departure routes tests
 */
describe('Departure CRUD tests', function() {
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

		// Save a user to the test db and create new Departure
		user.save(function() {
			departure = {
				name: 'Departure Name'
			};

			done();
		});
	});

	it('should be able to save Departure instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Departure
				agent.post('/departures')
					.send(departure)
					.expect(200)
					.end(function(departureSaveErr, departureSaveRes) {
						// Handle Departure save error
						if (departureSaveErr) done(departureSaveErr);

						// Get a list of Departures
						agent.get('/departures')
							.end(function(departuresGetErr, departuresGetRes) {
								// Handle Departure save error
								if (departuresGetErr) done(departuresGetErr);

								// Get Departures list
								var departures = departuresGetRes.body;

								// Set assertions
								(departures[0].user._id).should.equal(userId);
								(departures[0].name).should.match('Departure Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Departure instance if not logged in', function(done) {
		agent.post('/departures')
			.send(departure)
			.expect(401)
			.end(function(departureSaveErr, departureSaveRes) {
				// Call the assertion callback
				done(departureSaveErr);
			});
	});

	it('should not be able to save Departure instance if no name is provided', function(done) {
		// Invalidate name field
		departure.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Departure
				agent.post('/departures')
					.send(departure)
					.expect(400)
					.end(function(departureSaveErr, departureSaveRes) {
						// Set message assertion
						(departureSaveRes.body.message).should.match('Please fill Departure name');
						
						// Handle Departure save error
						done(departureSaveErr);
					});
			});
	});

	it('should be able to update Departure instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Departure
				agent.post('/departures')
					.send(departure)
					.expect(200)
					.end(function(departureSaveErr, departureSaveRes) {
						// Handle Departure save error
						if (departureSaveErr) done(departureSaveErr);

						// Update Departure name
						departure.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Departure
						agent.put('/departures/' + departureSaveRes.body._id)
							.send(departure)
							.expect(200)
							.end(function(departureUpdateErr, departureUpdateRes) {
								// Handle Departure update error
								if (departureUpdateErr) done(departureUpdateErr);

								// Set assertions
								(departureUpdateRes.body._id).should.equal(departureSaveRes.body._id);
								(departureUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Departures if not signed in', function(done) {
		// Create new Departure model instance
		var departureObj = new Departure(departure);

		// Save the Departure
		departureObj.save(function() {
			// Request Departures
			request(app).get('/departures')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Departure if not signed in', function(done) {
		// Create new Departure model instance
		var departureObj = new Departure(departure);

		// Save the Departure
		departureObj.save(function() {
			request(app).get('/departures/' + departureObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', departure.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Departure instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Departure
				agent.post('/departures')
					.send(departure)
					.expect(200)
					.end(function(departureSaveErr, departureSaveRes) {
						// Handle Departure save error
						if (departureSaveErr) done(departureSaveErr);

						// Delete existing Departure
						agent.delete('/departures/' + departureSaveRes.body._id)
							.send(departure)
							.expect(200)
							.end(function(departureDeleteErr, departureDeleteRes) {
								// Handle Departure error error
								if (departureDeleteErr) done(departureDeleteErr);

								// Set assertions
								(departureDeleteRes.body._id).should.equal(departureSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Departure instance if not signed in', function(done) {
		// Set Departure user 
		departure.user = user;

		// Create new Departure model instance
		var departureObj = new Departure(departure);

		// Save the Departure
		departureObj.save(function() {
			// Try deleting Departure
			request(app).delete('/departures/' + departureObj._id)
			.expect(401)
			.end(function(departureDeleteErr, departureDeleteRes) {
				// Set message assertion
				(departureDeleteRes.body.message).should.match('User is not logged in');

				// Handle Departure error error
				done(departureDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Departure.remove().exec();
		done();
	});
});
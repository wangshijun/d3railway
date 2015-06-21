'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var departures = require('../../app/controllers/departures.server.controller');

	// Departures Routes
	app.route('/departures')
		.get(departures.list)
		.post(users.requiresLogin, departures.create);

	app.route('/departures/:departureId')
		.get(departures.read)
		.put(users.requiresLogin, departures.hasAuthorization, departures.update)
		.delete(users.requiresLogin, departures.hasAuthorization, departures.delete);

	// Finish by binding the Departure middleware
	app.param('departureId', departures.departureByID);
};

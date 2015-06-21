'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var trains = require('../../app/controllers/trains.server.controller');

	// Trains Routes
	app.route('/trains')
		.get(trains.list)
		.post(users.requiresLogin, trains.create);

	app.route('/trains/:trainId')
		.get(trains.read)
		.put(users.requiresLogin, trains.hasAuthorization, trains.update)
		.delete(users.requiresLogin, trains.hasAuthorization, trains.delete);

	// Finish by binding the Train middleware
	app.param('trainId', trains.trainByID);
};

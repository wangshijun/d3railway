'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var arrivals = require('../../app/controllers/arrivals.server.controller');

    // Arrivals Routes
    app.route('/arrivals')
        .get(arrivals.list)
        .post(users.requiresLogin, arrivals.create);

    app.route('/arrivals/:arrivalId')
        .get(arrivals.read)
        .put(users.requiresLogin, arrivals.hasAuthorization, arrivals.update)
        .delete(users.requiresLogin, arrivals.hasAuthorization, arrivals.delete);

    // Finish by binding the Arrival middleware
    app.param('arrivalId', arrivals.arrivalByID);
};

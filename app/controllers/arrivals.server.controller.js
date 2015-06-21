'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Arrival = mongoose.model('Arrival'),
    _ = require('lodash');

/**
 * Create a Arrival
 */
exports.create = function(req, res) {
    var arrival = new Arrival(req.body);
    arrival.user = req.user;

    arrival.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(arrival);
        }
    });
};

/**
 * Show the current Arrival
 */
exports.read = function(req, res) {
    res.jsonp(req.arrival);
};

/**
 * Update a Arrival
 */
exports.update = function(req, res) {
    var arrival = req.arrival ;

    arrival = _.extend(arrival , req.body);

    arrival.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(arrival);
        }
    });
};

/**
 * Delete an Arrival
 */
exports.delete = function(req, res) {
    var arrival = req.arrival ;

    arrival.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(arrival);
        }
    });
};

/**
 * List of Arrivals
 */
exports.list = function(req, res) { 
    Arrival.find().sort('-created').populate('user', 'displayName').exec(function(err, arrivals) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(arrivals);
        }
    });
};

/**
 * Arrival middleware
 */
exports.arrivalByID = function(req, res, next, id) { 
    Arrival.findById(id).populate('user', 'displayName').exec(function(err, arrival) {
        if (err) return next(err);
        if (! arrival) return next(new Error('Failed to load Arrival ' + id));
        req.arrival = arrival ;
        next();
    });
};

/**
 * Arrival authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.arrival.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};

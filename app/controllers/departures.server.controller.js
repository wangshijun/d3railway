'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Departure = mongoose.model('Departure'),
    _ = require('lodash');

/**
 * Create a Departure
 */
exports.create = function(req, res) {
    var departure = new Departure(req.body);
    departure.user = req.user;

    departure.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(departure);
        }
    });
};

/**
 * Show the current Departure
 */
exports.read = function(req, res) {
    res.jsonp(req.departure);
};

/**
 * Update a Departure
 */
exports.update = function(req, res) {
    var departure = req.departure ;

    departure = _.extend(departure , req.body);

    departure.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(departure);
        }
    });
};

/**
 * Delete an Departure
 */
exports.delete = function(req, res) {
    var departure = req.departure ;

    departure.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(departure);
        }
    });
};

/**
 * List of Departures
 */
exports.list = function(req, res) { 
    Departure.find().sort('-created').populate('user', 'username').exec(function(err, departures) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(departures);
        }
    });
};

/**
 * Departure middleware
 */
exports.departureByID = function(req, res, next, id) { 
    Departure.findById(id).populate('user', 'displayName').exec(function(err, departure) {
        if (err) return next(err);
        if (! departure) return next(new Error('Failed to load Departure ' + id));
        req.departure = departure ;
        next();
    });
};

/**
 * Departure authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.departure.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};

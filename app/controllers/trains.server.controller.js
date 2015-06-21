'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Train = mongoose.model('Train'),
	_ = require('lodash');

/**
 * Create a Train
 */
exports.create = function(req, res) {
	var train = new Train(req.body);
	train.user = req.user;

	train.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(train);
		}
	});
};

/**
 * Show the current Train
 */
exports.read = function(req, res) {
	res.jsonp(req.train);
};

/**
 * Update a Train
 */
exports.update = function(req, res) {
	var train = req.train ;

	train = _.extend(train , req.body);

	train.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(train);
		}
	});
};

/**
 * Delete an Train
 */
exports.delete = function(req, res) {
	var train = req.train ;

	train.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(train);
		}
	});
};

/**
 * List of Trains
 */
exports.list = function(req, res) { 
	Train.find().sort('-created').populate('user', 'displayName').exec(function(err, trains) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trains);
		}
	});
};

/**
 * Train middleware
 */
exports.trainByID = function(req, res, next, id) { 
	Train.findById(id).populate('user', 'displayName').exec(function(err, train) {
		if (err) return next(err);
		if (! train) return next(new Error('Failed to load Train ' + id));
		req.train = train ;
		next();
	});
};

/**
 * Train authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.train.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

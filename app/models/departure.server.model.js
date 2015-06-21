'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Departure Schema
 */
var DepartureSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Departure name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Departure', DepartureSchema);
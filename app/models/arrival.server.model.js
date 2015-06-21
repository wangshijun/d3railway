'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Arrival Schema
 */
var ArrivalSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Arrival name',
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

mongoose.model('Arrival', ArrivalSchema);
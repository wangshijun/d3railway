'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Train Schema
 */
var TrainSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Train name',
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

mongoose.model('Train', TrainSchema);
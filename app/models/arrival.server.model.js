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
        required: '请输入到达方向名称',
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

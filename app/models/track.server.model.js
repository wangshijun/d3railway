'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Track Schema
 */
var TrackSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: '请输入股道名称',
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

mongoose.model('Track', TrackSchema);

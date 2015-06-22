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
    name: {         // 列车编号
        type: String,
        default: '',
        required: '请输入到达方向名称',
        trim: true
    },
    track: {    // 停留股道
        type: Schema.ObjectId,
        required: '请输入停留股道',
        ref: 'Track'
    },
    arrival: {      // 到达方向
        type: Schema.ObjectId,
        required: '请输入到达方向',
        ref: 'Arrival'
    },
    arrivalTime: {   // 到达时间
        type: String,
        default: '',
    },
    departure: {    // 出发方向
        type: Schema.ObjectId,
        required: '请输入出发方向',
        ref: 'Departure'
    },
    departureTime: {   // 出发时间
        type: String,
        default: '',
        required: '请输入出发时间',
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


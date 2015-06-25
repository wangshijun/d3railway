'use strict';

var init = require('../config/init')(),
    config = require('../config/config'),
    mongoose = require('mongoose');

var path = require('path');
var fs = require('fs');
var unorm = require('unorm');
var csv = require('csv');
var Q = require('q');

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
    if (err) {
        console.error(chalk.red('Could not connect to MongoDB!'));
        console.log(chalk.red(err));
    }
});

// Globbing model files
config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
    require(path.resolve(modelPath));
});

var User = mongoose.model('User');
var Train = mongoose.model('Train');
var Track = mongoose.model('Track');
var Arrival = mongoose.model('Arrival');
var Departure = mongoose.model('Departure');

// parse csv files
var data = fs.readFileSync('./data/trains.csv');
csv.parse(data, function (err, items) {
    // items.shift();

    var arrivals = [];
    var tracks = [];
    var departures = [];
    var trains = [];

    items.forEach(function (item) {
        var train = {
            name: item[0],
            arrival: item[1],
            departure: item[2],
            arrivalTime: getTime(item[3]),
            departureTime: getTime(item[4]),
            track: item[5],
        };

        if (item[1] && arrivals.indexOf(item[1]) === -1) {
            arrivals.push(item[1]);
        }
        if (item[2] && departures.indexOf(item[2]) === -1) {
            departures.push(item[2]);
        }
        if (item[5] && tracks.indexOf(item[5]) === -1) {
            tracks.push(item[5]);
        }

        if (item[1] && item[2] && item[5]) {
            trains.push(train);
        }
    });

    var u;

    getUser()
        .then(function (user) {
            u = user;
            return addArrivals(arrivals, u);
        })
        .then(function (map) {
            trains.forEach(function (train) {
                train.arrival = map[train.arrival];
            });

            return addTracks(tracks, u);
        })
        .then(function (map) {
            trains.forEach(function (train) {
                train.track = map[train.track];
            });

            return addDepartures(departures, u);
        })
        .then(function (map) {
            trains.forEach(function (train) {
                train.departure = map[train.departure];
            });

            return addTrains(trains, u);
        })
        .then(function () {
            process.exit(0);
        });
});

function getUser() {
    var d = Q.defer();

    User.findOne({}, function (err, user) {
        if (err) { console.log('getUser:', err); }
        console.log('getUser: %s', user.toObject());
        d.resolve(user);
    });

    return d.promise;
};

function addArrivals(names, user) {
    var d = Q.defer();
    var map = {};
    var tasks = names.map(function (name) {
        var d = Q.defer();

        var item = new Arrival({ name: name, user: user });
        item.save(function (err, obj) {
            if (err) { console.log('addArrival:', err); }
            console.log('addArrival: %s => %s', name, obj._id.toString());
            map[name] = obj._id;
            d.resolve(obj);
        });

        return d.promise;
    });

    Q.all(tasks).then(function () {
        d.resolve(map);
    }).done();

    return d.promise;
}

function addTracks(names, user) {
    var d = Q.defer();
    var map = {};
    var tasks = names.map(function (name) {
        console.log(name, unorm.nfd(name), unorm.nfc(name), unorm.nfkd(name), unorm.nfkc(name));
        var d = Q.defer();
        var item = new Track({ name: unorm.nfkd(name), user: user });
        item.save(function (err, obj) {
            if (err) { console.log('addTrack: %s', name, err); }
            console.log('addTrack: %s => %s', name, obj._id.toString());
            map[name] = obj._id;
            d.resolve(obj);
        });

        return d.promise;
    });

    Q.all(tasks).then(function () {
        d.resolve(map);
    }).done();

    return d.promise;
}

function addDepartures(names, user) {
    var d = Q.defer();
    var map = {};
    var tasks = names.map(function (name) {
        var d = Q.defer();

        var item = new Departure({ name: name, user: user });
        item.save(function (err, obj) {
            if (err) { console.log('addDeparture:', err); }
            console.log('addDeparture: %s => %s', name, obj._id.toString());
            map[name] = obj._id;
            d.resolve(obj);
        });

        return d.promise;
    });

    Q.all(tasks).then(function () {
        d.resolve(map);
    }).done();

    return d.promise;
}

function addTrains(items, user) {
    var d = Q.defer();
    var tasks = items.map(function (item) {
        var d = Q.defer();

        item.user = user;
        var item = new Train(item);
        item.save(function (err, obj) {
            if (err) { console.log('addTrain:', err); }
            console.log('addTrain: ', obj.toObject());
            d.resolve(obj);
        });

        return d.promise;
    });

    Q.all(tasks).then(function () {
        d.resolve();
    }).done();

    return d.promise;
}

function getTime(time) {
    if (time) {
        var date = new Date();
        date.setHours(parseInt(time.split(':').shift()));
        date.setMinutes(parseInt(time.split(':').pop()));
        return date.toString();
    } else {
        return '';
    }
}

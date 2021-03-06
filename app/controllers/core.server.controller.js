'use strict';

var sys = require('sys'),
    tmp = require('tmp'),
    fs = require('fs'),
    exec = require('child_process').exec;

var Svg = require('svgutils').Svg;

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
    res.render('index', {
        user: req.user || null,
        request: req
    });
};

exports.download = function (req, res) {
    console.log(req.body);

    // output format (svg or png )
    tmp.file({postfix: '.svg'}, function _tempFileCreated(err, inputFilePath, fd) {
        if (err) { return res.status(500).jsonp({ error: err, stage: 'tmp' }); }

        fs.writeFile(inputFilePath, req.body.data, function (err) {
            if (err) { return res.status(500).jsonp({ error: err, stage: 'writetmp' }); }

            Svg.fromSvgDocument(inputFilePath, function (err, svg) {
                if (err) { return res.status(500).jsonp({ error: err, stage: 'fromsvg' }); }

                var outputFilePath = './' + (new Date).getTime() + '.' + req.body.format;

                if (req.body.format === 'svg') {
                    svg.save({ output : outputFilePath }, function (err, filename) {
                        if (err) { return res.status(500).jsonp({ error: err, stage: 'writesvg' }); }
                        res.attachment(outputFilePath);
                        res.sendfile(outputFilePath);
                    });
                } else {
                    svg.savePng({ output : outputFilePath }, function (err, filename) {
                        if (err) { return res.status(500).jsonp({ error: err, stage: 'writepng' }); }
                        res.attachment(outputFilePath);
                        res.sendFile(outputFilePath);
                    });
                }
            });
        });
    });
};

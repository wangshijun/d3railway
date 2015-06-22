'use strict';

var sys = require('sys'),
    tmp = require('tmp'),
    fs = require('fs'),
    exec = require('child_process').exec;

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
    // output format (pdf or png )

    tmp.file({postfix: '.svg'}, function _tempFileCreated(err, inputFilePath, fd) {

        if (err) {
            res.json(500, err);
        } else {
            fs.writeFile(inputFilePath, req.body.data, function(err) {
                if (err) {
                    res.json(500, err);
                } else {
                    tmp.file({postfix: '.' + req.body.format}, function _tempFileCreated(err, outputFilePath, fd) {
                        if (err) {
                            res.json(500, err);
                        } else {
                            var cmd = "rsvg-convert -z 5 --background-color white -a";
                            cmd += " -f " + req.body.format;
                            cmd += " -o " + outputFilePath;
                            cmd += " " + inputFilePath;

                            exec(cmd, function (error, stdout, stderr) {
                                if (error !== null) {
                                    res.json(500, error);
                                } else {
                                    res.attachment(outputFilePath);
                                    res.sendfile(outputFilePath);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

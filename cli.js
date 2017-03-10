#! /usr/bin/env node

const path = require('path');
const argv = require('optimist').argv;
const args = argv._;
const help = 'The perfect companion for Benchpress Performance Toolkit';

if ((argv.h) || (argv.help)) {
    console.log(help);
    console.log('Usage: perfy protractor.conf.js')
    process.exit(0);
}

if (Array.isArray(args) && args.length === 1 && args[0].indexOf('protractor') !== -1) {
    const configPath = path.resolve(process.cwd(), args[0]);
    const protractorConfigFile = require(configPath);
    const perfyConfig = (protractorConfigFile.config) && protractorConfigFile.config.perfy;

    if (!perfyConfig) {
        console.error('Entry "perfy" is missing in protractor config file');
        process.exit(1);
    } else {
        if (!perfyConfig.reportsFolder) {
            console.error('Entry "perfy.reportsFolder" is missing in protractor config file');
            process.exit(1);
        }
        if (!perfyConfig.reportsDataFolder) {
            console.error('Entry "perfy.reportsDataFolder" is missing in protractor config file');
            process.exit(1);
        }
        if (!perfyConfig.reportsFiles) {
            console.error('Entry "perfy.reportsFiles" is missing in protractor config file');
            process.exit(1);
        }
    }

    require('./lib/write-files')({
        perfyConfig
    });
}
#! /usr/bin/env node

const path = require('path');
const argv = require('optimist').argv,
    help = 'The perfect companion for Benchpress Performance Toolkit';

if ((argv.h) || (argv.help)) {
    console.log(help);
    process.exit(0);
}

const pattern = path.resolve(argv.pattern || 'public/reports/*_*.json');

require('./lib/write-files')({
    pattern
});
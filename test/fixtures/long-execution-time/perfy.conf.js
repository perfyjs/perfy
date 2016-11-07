'use strict';

const path = require('path');

const publicDir = path.join(__dirname, '.public');

exports.config = {
	publicDir,
	pattern: '*_*.json'
};

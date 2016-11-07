'use strict';

const path = require('path');

const defaultProtractorConfig = require('../../../protractor.conf.js').config;
const perfyOptions = require('./perfy.conf.js').config;

exports.config = Object.assign(
  defaultProtractorConfig,
	{
		perfyOptions,

		specs: [
			'./index.spec.js'
		]
	}
);

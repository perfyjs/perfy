const benchpress = require('@angular/benchpress');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const config = require('../benchpress.config');
const runner = new benchpress.Runner(config.options(benchpress, 'react'));

let TEST = {
  SAMPLE_SIZE: 10,
  ADDRESS: 'http://localhost:5555/index.html',
  COUNTS: [10, 100, 500, 1000, 2000, 3000, 4000, 5000],
  TIMEOUT_INTERVAL_VAR: 10000
};

jasmine.DEFAULT_TIMEOUT_INTERVAL = TEST.COUNTS[TEST.COUNTS.length - 1] * TEST.TIMEOUT_INTERVAL_VAR;

afterEach(async( () => {
  await (global.browser.quit());
}) );

describe('React App: Web Components Performance Compaign', function () {

  function testPaintingTime(count) {

    const executionBlock = () => {
      // run code here
    };

    it('time to paint (without web component)', async( (done) => {
      
      browser.ignoreSynchronization = true;
      await (browser.get(`${TEST.ADDRESS}?use-wc=false`));

      runner.sample({
        id: 'paint-without-web-component',
        execute: async( executionBlock )
      }).then(done, done.fail);

    }) );

    it('time to paint (with web component)', async( (done) => {
      
      browser.ignoreSynchronization = true;
      await (browser.get(`${TEST.ADDRESS}?use-wc=true`));

      runner.sample({
        id: 'paint-with-web-component',
        execute: async( executionBlock )
      }).then(done, done.fail);

    } ));
  }

  for (let x = 0; x < TEST.COUNTS.length; x++) {
    testPaintingTime();
  }

});
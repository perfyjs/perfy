const benchpress = require('@angular/benchpress');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const config = require('../benchpress.config');
const runner = new benchpress.Runner(config.options(benchpress, 'angular'));

let TEST = {
  ADDRESS: 'http://localhost:4200/index.html',
  COUNTS: [10, 100, 500, 1000, 2000, 3000, 4000, 5000],
  TIMEOUT_INTERVAL_VAR: 10000
};

jasmine.DEFAULT_TIMEOUT_INTERVAL = TEST.COUNTS[TEST.COUNTS.length - 1] * TEST.TIMEOUT_INTERVAL_VAR;

afterEach(async( () => {
  
  await(
    require('../lib/write-files')({
      pattern: 'public/reports/*_*.json'
    })
  )

  await (global.browser.quit());
}) );

describe('Angular App: Web Components Performance Compaign', function () {

  function testPaintingTime(count) {

    const executionBlock = () => {
      // run code here
    };

    xit('time to paint (without any component)', async( (done) => {
      
      browser.ignoreSynchronization = true;
      await (browser.get(`${TEST.ADDRESS}?use-wc=false`));

      runner.sample({
        id: 'no-component-at-all',
        execute: async( executionBlock )
      }).then(done, done.fail);

    }) );

    xit('time to paint (with web component)', async( (done) => {
      
      browser.ignoreSynchronization = true;
      await (browser.get(`${TEST.ADDRESS}?use-wc=false`));

      runner.sample({
        id: 'with-web-component',
        execute: async( executionBlock )
      }).then(done, done.fail);

    }) );

    it('time to paint (with angular composant)', async( (done) => {
      
      browser.ignoreSynchronization = true;
      await (browser.get(`${TEST.ADDRESS}?use-wc=true`));

      runner.sample({
        id: 'xxxxx-with-ng-component',
        execute: async( executionBlock )
      }).then(done, done.fail);

    } ));
  }

  for (let x = 0; x < TEST.COUNTS.length; x++) {
    testPaintingTime();
  }

});
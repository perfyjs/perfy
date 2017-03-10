const benchpress = require('@angular/benchpress');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const socket = require('../lib/socket');
const perfy = require('../protractor.conf').config.perfy;
const runner = new benchpress.Runner(perfy.providers(benchpress));

let TEST = {
    ADDRESS: 'http://localhost:4200/index.html',
    COUNTS: 1,
    TIMEOUT_INTERVAL_VAR: 10000
};

jasmine.DEFAULT_TIMEOUT_INTERVAL = TEST.COUNTS * 2 * TEST.TIMEOUT_INTERVAL_VAR;

afterEach(async((done) => {

    // require('../lib/write-files')({
    //     pattern: 'public/reports/ng-*_*.json'
    // })

    await (protractor.browser.quit());
    done();

}));

describe('Angular App: Web Components Performance Compaign', function() {

    function testPaintingTime(count) {

        const executionBlock = () => {
            // do nothing
        };

        it('time to paint (without any component)', async((done) => {

            browser.ignoreSynchronization = true;
            await (browser.get(`${TEST.ADDRESS}?it=1`));

            runner.sample({
                id: 'ng-no-component',
                execute: async(executionBlock),
                prepare: function() {

                    }
                    // emit: function(metricValues) {
                    //     socket.broadcast(metricValues);
                    // }
            }).then(done, done.fail);

        }));

        it('time to paint (with web component)', async((done) => {

            browser.ignoreSynchronization = true;
            await (browser.get(`${TEST.ADDRESS}?it=2`));

            runner.sample({
                id: 'ng-web-component',
                execute: async(executionBlock)
            }).then(done, done.fail);

        }));

        it('time to paint (with angular composant)', async((done) => {

            browser.ignoreSynchronization = true;
            await (browser.get(`${TEST.ADDRESS}?it=3`));

            runner.sample({
                id: 'ng-component',
                execute: async(executionBlock)
            }).then(done, done.fail);

        }));
    }

    for (let x = 0; x < TEST.COUNTS; x++) {
        testPaintingTime();
    }

});
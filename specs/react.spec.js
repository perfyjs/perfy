const benchpress = require('@angular/benchpress');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const perfy = require('../protractor.conf').config.perfy;
const runner = new benchpress.Runner(perfy.providers(benchpress));

let TEST = {
    ADDRESS: 'http://localhost:8081/index.html',
    COUNTS: 1,
    TIMEOUT_INTERVAL_VAR: 10000
};

jasmine.DEFAULT_TIMEOUT_INTERVAL = TEST.COUNTS * 2 * TEST.TIMEOUT_INTERVAL_VAR;

afterEach(async((done) => {

    // require('../lib/write-files')({
    //     pattern: 'public/reports/rc-*_*.json'
    // })

    await (global.browser.close());
    done();
}));

describe('React App: Web Components Performance Compaign', function() {

    function testPaintingTime(count) {

        const executionBlock = () => {
            // do nothing
        };

        it('time to paint (without any component)', async((done) => {

            browser.ignoreSynchronization = true;
            await (browser.get(`${TEST.ADDRESS}?it=1`));

            runner.sample({
                id: 'rc-no-component',
                execute: async(executionBlock)
            }).then(done, done.fail);

        }));

        it('time to paint (with web component)', async((done) => {

            browser.ignoreSynchronization = true;
            await (browser.get(`${TEST.ADDRESS}?it=2`));

            runner.sample({
                id: 'rc-web-component',
                execute: async(executionBlock)
            }).then(done, done.fail);

        }));

        it('time to paint (with react composant)', async((done) => {

            browser.ignoreSynchronization = true;
            await (browser.get(`${TEST.ADDRESS}?it=3`));

            runner.sample({
                id: 'rc-component',
                execute: async(executionBlock)
            }).then(done, done.fail);

        }));
    }

    for (let x = 0; x < TEST.COUNTS; x++) {
        testPaintingTime();
    }

});
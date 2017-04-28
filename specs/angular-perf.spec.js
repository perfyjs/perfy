const benchpress = require('@angular/benchpress');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const socket = require('../lib/socket');
const perfy = require('../protractor.conf').config.perfy;
const runner = new benchpress.Runner(perfy.providers(benchpress));

let TEST = {
    ADDRESS: {
        JIT: 'http://localhost:4200/index.html',
        AOT: 'http://localhost:8888/index.html'
    },
    COUNTS: 1,
    TIMEOUT_INTERVAL_VAR: 10000
};

jasmine.DEFAULT_TIMEOUT_INTERVAL = TEST.COUNTS * 2 * TEST.TIMEOUT_INTERVAL_VAR;

afterEach(async((done) => {

    // require('../lib/write-files')({
    //     pattern: 'public/reports/ng-*_*.json'
    // })

    //await (protractor.browser.quit());
    done();

}));

describe('Angular Perf: AOT/JIT Performance Compaign', function() {

    function testPaintingTime(count) {

        const executionBlock = () => {
            // do nothing
        };

        it('time to paint (JIT MODE)', async((done) => {

            browser.ignoreSynchronization = true;
            await (browser.get(`${TEST.ADDRESS.JIT}`));

            runner.sample({
                id: 'ng-jit',
                execute: async(executionBlock),
                prepare: function() {

                    }
                    // emit: function(metricValues) {
                    //     socket.broadcast(metricValues);
                    // }
            }).then(done, done.fail);

        }));

        it('time to paint (AOT MODE)', async((done) => {

            browser.ignoreSynchronization = true;
            await (browser.get(`${TEST.ADDRESS.AOT}`));

            runner.sample({
                id: 'ng-aot',
                execute: async(executionBlock)
            }).then(done, done.fail);

        }));
    }

    for (let x = 0; x < TEST.COUNTS; x++) {
        testPaintingTime();
    }

});
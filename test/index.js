'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');

const execa = require('execa');
const del = require('del');

const PROTRACTOR_BIN = 'protractor';
const FIXTURES_PATH = path.resolve(__dirname, '..', 'test', 'fixtures');

const fixtures = fs.readdirSync(FIXTURES_PATH);
// NOTE(douglasduteil): to run only some of them us an array like so
// const fixtures = [
//     'long-execution-time'
// ];

describe('"e2e"', function () {
    this.bail(true);

    fixtures.map(describeFixtureTest);
});

//

function describeFixtureTest(fixtureName) {
    describe(fixtureName, function () {
        const fixturePath = path.join(FIXTURES_PATH, fixtureName);
        const publicPath = path.join(fixturePath, '.public');

        before(function () {
            return del(publicPath);
        });

        it('should run with no error', function () {
            this.slow(1000 * 60 * 5); // 5min
            this.timeout(1000 * 60 * 10); // 10min

            const promise = execa(PROTRACTOR_BIN, [path.join(fixturePath, 'protractor.conf.js')]);

            // NOTE(douglasduteil): to display protractor output
            promise.stdout.pipe(process.stdout);

            return promise.then((result) => {
                // HACK(douglasduteil): manually remove node 7 warning
                // This DeprecationWarning is popping from i-don't-know-where...
                // (node:xxxxx) DeprecationWarning: os.tmpDir() is deprecated. Use os.tmpdir() instead
                result.stderr = result.stderr.split('\n').slice(1).join('\n');
                assert.strictEqual(result.stderr, '', 'Expect no stderr messages');
            });
        });

        it('should create a ".public" directory', function () {
            return exists(publicPath);
        });

        it('should have in the ".public" directory default files', function () {
            return Promise.all([
                'lib/plotly.min.js',
                'index.html'
            ]
                .map((filePath) => path.join(publicPath, ...filePath.split('/')))
                .map(exists));
        });

        it('should have merged reports in ".public/reports" directory', function () {
            return Promise.all([
                'long-execution-time-d10-i10.json',
                'long-execution-time-d50-i10.json',
                'long-execution-time-d100-i10.json',
                'long-exec  ution-time-d150-i10.json'
            ]
                .map((filePath) => path.join(publicPath, 'reports', ...filePath.split('/')))
                .map(exists)
            );
        });
    });
}

function exists(path) {
    return new Promise((res, rej) => {
        fs.stat(
            path,
            (error, stats) => error ? rej(error) : res(stats)
        );
    });
}

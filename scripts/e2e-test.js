'use strict';

const path = require('path');
const crossSpawn = require('cross-spawn');
const {createServer} = require('http-server');
const portfinder = require('portfinder');

//

const port = parseInt(process.env.PORT, 10) || 9999;
// HACK(douglasduteil): cheat code because only one option
const watchMode = process.argv[2] === '--watch';
const host = 'localhost';

const options = {
    root: path.resolve(__dirname, '..')
};
const server = createServer(options);

//

Promise.resolve()
    .then(openServer)
    .then(launchTests.bind(null, watchMode))
    .then(closeServer)
    .catch((error) => {
        console.error(error);
        closeServer(1);
    })
;

//

process.on('SIGINT',closeServer);
process.on('SIGTERM', closeServer);

//

function launchTests (watchMode) {
    return new Promise ((resolve, reject) => {
        const watchArgs = watchMode ? ['--watch'] : [];
        const child = crossSpawn('yarn', ['run', 'test:e2e', '--'].concat(watchArgs), {stdio: 'inherit'});
        child.on('error', reject);
        child.on('close', resolve);
    })
}
function openServer () {
    return new Promise ((resolve) => {
        server.listen(port, host,  function () {
            console.log(`
Starting up http-server, serving ${server.root}
Available on:
  http://${host}:${port}
 
Hit CTRL-C to stop the server
`);
            resolve();
        });
    })
}

function closeServer (exitCode) {
    server.close();
    console.log('http-server stopped.');
    process.exit(exitCode || 0)
}

const httpServer = require('http-server');
const port = '4242';
const host = '0.0.0.0';
const options = {
    root: './public',
    cache: 1
};
var server = httpServer.createServer(options);
server.listen(port, host, () => {
    require('./lib/socket').start();
    console.log(`Starting up http-server, on http://${host}:${port}`);
    console.info('Hit CTRL-C to stop the server');
});
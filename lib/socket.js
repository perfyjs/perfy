const rws = require('ws');
const port = '4243';
const host = '0.0.0.0';
const connections = [];
const broadcast = (data) => connections.map( cn => cn.send(data) );
const start = () => {
    const WebSocketServer = rws.Server;
    const wss = new WebSocketServer({port});
    wss.on('connection', function(connection) {
        connections.push(connection);
    });
    console.log(`Starting up socket-server, on http://${host}:${port}`);
}
module.exports.start = start;
module.exports.broadcast = broadcast;
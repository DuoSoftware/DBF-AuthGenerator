const restify = require('restify');
const config = require('config');
const jwt = require('restify-jwt');
const corsMiddleware = require('restify-cors-middleware');
const TokenSwap = require('./Worker/TokenSwap');
const MongooseConnection = new require('dbf-dbmodels/MongoConnection');
let connection  = new MongooseConnection();

const port = config.Host.port || 3000;
const version=config.Host.version;
const hpath=config.Host.hostpath;


const server = restify.createServer({
    name: "AuthGenerator",
    version: '1.0.0'
},function(req,res)
{

});



const cors = corsMiddleware({
    allowHeaders: ['authorization']
});

server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.queryParser({
    mapParams: true
}));
server.use(restify.plugins.bodyParser({
    mapParams: true
}));
process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});

server.listen(port, () => {
    console.log('%s listening at %s', server.name, server.url);
});







//Login

server.post('/DBF/API/:version/auth',TokenSwap.getNewToken);


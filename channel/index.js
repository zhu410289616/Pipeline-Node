var net = require('net');
var logger = require('log4js').getLogger('channel');
var config = require('./tcp-config.json');
var pipeline = require('./tcp-pipeline.js');
// var channel = require('./channel.js');

var localTcpHost = config['LocalTcpServer']['Host'];
var localTcpPort = config['LocalTcpServer']['Port'];
var remoteTcpHost = config['RemoteTcpServer']['Host'];
var remoteTcpPort = config['RemoteTcpServer']['Port'];

var pipelineList = [];

var clientList = [];
var server;
var client;

var serviceSocket;

function startTcpProxyServer(tcpPort, remoteTcpHost, remoteTcpPort) {
    try {
        server = net.createServer(function (clientSocket) {
            console.log('---------------> 新的连接');
            var pl = pipeline.open(clientSocket, remoteTcpHost, remoteTcpPort, function () {
                pipelineList.pop(pl);
            });
            pipelineList.push(pl);
        });
        
        server.listen(tcpPort, function() {
            logger.info('绑定服务器:' + localTcpHost + ':' +localTcpPort);
            console.log('绑定服务器:' + localTcpHost + ':' +localTcpPort);
        });
    } catch (error) {
        
    }
}

startTcpProxyServer(localTcpPort, remoteTcpHost, remoteTcpPort);

function startTcpServer(tcpPort, remoteTcpHost, remoteTcpPort) {
    try {
        server = net.createServer(function (clientSocket) {
            console.log('---------------> 新的连接');
            //新的连接
            clientSocket.on('connect', function() {
                clientList.push(clientSocket);
            });
            clientSocket.on('data', function(data) {
                console.log('---------------> data: ' + data);
                if (serviceSocket) {
                    serviceSocket.write(data);
                } else {
                    serviceSocket = net.connect({port:remoteTcpPort}, function() {
                        serviceSocket.write(data);
                    });
                    serviceSocket.on('data', function(data) {
                        clientSocket.write(data);
                    });
                    serviceSocket.on('end', function() {
                        console.log(' == serviceSocket disconnected from server');
                    });
                    serviceSocket.on('error', function(error) {
                        console.error(' == serviceSocket has error ' + error);
                        clientSocket.end();
                    });
                }
    
            });
            clientSocket.on('end', function(data) {
                console.log('连接断开');
            });
        });
        
        server.listen(tcpPort, function() {
            logger.info('绑定服务器:' + localTcpHost + ':' +localTcpPort);
            console.log('绑定服务器:' + localTcpHost + ':' +localTcpPort);
        });
    } catch (error) {
        
    }
}

function startTcpClient(tcpHost, tcpPort) {
    client = net.connect({port:tcpPort}, function() {
        console.log('服务器已连接');
    });
    client.on('data', function(data) {
        console.log('data: ' + data);
    });
    client.on('end', function() {
        console.log('服务器关闭');
    });
}

// startTcpServer(localTcpPort, remoteTcpHost, remoteTcpPort);
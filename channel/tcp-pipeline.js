var net = require('net');
var logger = require('log4js').getLogger('pipeline');
var codec = require('./tcp-codec.js');

//https://blog.csdn.net/ma_shen/article/details/80835431
var clientSocket;
var serverSocket;

var downstreamBuffer;
var upstreamBuffer = [];

var pipeline = {};

var decodeData = function(downstreamData, callback) {
    if (downstreamBuffer) {
        downstreamBuffer = Buffer.concat([downstreamData]);
    } else {
        downstreamBuffer = downstreamData;
    }

    codec.delimiterDecoder(downstreamBuffer, function(downstreamData, packetData, callback) {
        if (packetData) {
            console.log('---------------> delimiterDecoder packetData: ' + packetData);
            serverSocket.write(packetData);
        }
    });
}

var encodeData = function(upstreamPacket, callback) {
    upstreamBuffer.push(upstreamPacket);

    upstreamBuffer.forEach(function(packet) {
        codec.delimiterEncoder(packet, function(packetData) {
            callback(packetData);
        });
    });
}

pipeline.open = function (clientSocket, serverHost, serverPort, callback) {

    try {
        clientSocket.on('data', function(data) {
            console.log('---------------> data: ' + data);

            if (serverSocket) {
                // serverSocket.write(data);
                decodeData(data, null);
            } else {
                serverSocket = net.connect(serverPort, serverHost, function() {
                    // serverSocket.write(data);
                    decodeData(data, null);
                });
                serverSocket.on('data', function(data) {
                    clientSocket.write(data);
                });
                serverSocket.on('end', function() {
                    clientSocket.end();
                    clientSocket = null;
                    console.error('---------------> serverSocket 连接断开');
                    callback();
                });
                serverSocket.on('error', function(error) {
                    console.error('---------------> serverSocket has error ' + error);
                    clientSocket.end();
                });
                serverSocket.on('timeout', function() {
                    clientSocket.end();
                    clientSocket = null;
                    console.error('---------------> serverSocket 超时');
                    callback();
                });
            }
    
        });
        clientSocket.on('end', function() {
            serverSocket.end();
            serverSocket = null;
            console.error('---------------> clientSocket 连接断开');
            callback();
        });
        clientSocket.on('error', function(error) {
            console.error('---------------> clientSocket has error ' + error);
            serverSocket.end();
        });
        clientSocket.on('timeout', function() {
            serverSocket.end();
            serverSocket = null;
            console.error('---------------> clientSocket 超时');
            callback();
        });
    } catch (error) {
        console.error('---------------> tcpPipeline has error ' + error);
    }
    
    return this;
}

pipeline.close = function (callback) {
    try {
        if (clientSocket) {
            clientSocket.end();
        }
    } catch (error) {
        console.error('---------------> close has error ' + error);
    }
}

pipeline.writeToServer = function (data) {
    try {
        if (serverSocket) {
            serverSocket.write(data);
        }
    } catch (error) {
        console.error('---------------> writeToServer has error ' + error);
    }
}

pipeline.writePacketToServer = function (packet) {
    encodeData(packet, function(packetData) {
        pipeline.writeToServer(packetData);
    });
}

pipeline.writeToClient = function (data) {
    try {
        if (clientSocket) {
            clientSocket.write(data);
        }
    } catch (error) {
        console.error('---------------> writeToClient has error ' + error);
    }
}

pipeline.writePacketToClient = function (packet) {
    encodeData(packet, function(packetData) {
        pipeline.writeToClient(packetData);
    });
}

module.exports = pipeline;
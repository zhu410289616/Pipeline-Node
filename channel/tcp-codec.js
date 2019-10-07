var packet = require('./tcp-packet.js');

var delimiterData = "\r\n";

var codec = {}

codec.decode = function (downstreamData, callback) {

}

codec.variableLengthEncoder = function (upstreamPacket, callback) {
    // packet.upstream = upstreamPacket;
}

codec.variableLengthDecoder = function (downstreamData, callback) {
    console.log('begin downstreamData:' + downstreamData);
    if (Buffer.isBuffer(downstreamData)) {
        var bufferData = downstreamData;
        var start = 0;
        while (1) {
            var index = bufferData.indexOf(delimiterData, start);
            console.log('start: ' + start + ', index: ' + index);
            if (index !== -1) {
                var packetData = bufferData.subarray(start, index + delimiterData.length);
                callback(null, packetData, callback);
                start = index + delimiterData.length;
            } else {
                break;
            }
        }
        downstreamData = downstreamData.subarray(start);
    }
    console.log('end downstreamData:' + downstreamData);
    callback(downstreamData, null, callback);
}

codec.delimiterEncoder = function (upstreamPacket, callback) {
    // packet.upstream = upstreamPacket;
}

codec.delimiterDecoder = function (downstreamData, callback) {
    console.log('begin downstreamData:' + downstreamData);
    if (Buffer.isBuffer(downstreamData)) {
        var bufferData = downstreamData;
        var start = 0;
        while (1) {
            var index = bufferData.indexOf(delimiterData, start);
            console.log('start: ' + start + ', index: ' + index);
            if (index !== -1) {
                var packetData = bufferData.subarray(start, index + delimiterData.length);
                callback(null, packetData, callback);
                start = index + delimiterData.length;
            } else {
                break;
            }
        }
        downstreamData = downstreamData.subarray(start);
    }
    console.log('end downstreamData:' + downstreamData);
    callback(downstreamData, null, callback);
}

module.exports = codec;
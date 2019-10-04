
var packet = {}

packet.downstream = function (obj, pid) {
    this.obj = obj;
    this.pid = pid;
    return this;
}

packet.upstream = function (obj, pid, timeout) {
    this.obj = obj;
    this.pid = pid;
    this.timeout = timeout;
    return this;
}

module.exports = packet;
"use strict"
const Server = require("../Server");
const dgram = require("dgram");

// ================================================================================
// * SubServer <SDUDOC Server Plugin>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   [Warning] You need SDUDOC Server to apply this plugin.
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/04/20 - Version 1.0.0
//     - Server core
// ================================================================================

// ================================================================================
// * SubServer
// --------------------------------------------------------------------------------
function SubServer(){
    this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
SubServer.prototype._filename = null;
// --------------------------------------------------------------------------------
SubServer.prototype._port = null;
SubServer.prototype._udp_server = null;
// --------------------------------------------------------------------------------
SubServer.prototype._document = null;
// --------------------------------------------------------------------------------
SubServer.prototype._usermap = {};
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
SubServer.prototype.initialize = function(filename){
    this.clear();
    this.load(filename);
    this.startSocket();
};
// --------------------------------------------------------------------------------
SubServer.prototype.clear = function(){
    this._filename = null;
    this._port = null;
    this._udp_server = null;
};
SubServer.prototype.startSocket = function(){
    this._udp_server = dgram.createSocket('udp4');
    this._port = this._udp_server.address().port;
    this._udp_server.on('listening', function () {
        this.onSocketListening();

    });
    this._udp_server.on('message', function (cs_buffer, c_info) {
        let cs_msg = JSON.parse(cs_buffer.toString());
        this.onSocketMessage(cs_msg, c_info);
    });
    this._udp_server.on('error', function (error) {
        this.onSocketError(error);
    });
    this._udp_server.bind(0);
};
SubServer.prototype.shutdown = function(){
    this.save();
    this._udp_server.close();
}
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(SubServer.prototype, 'port', {
    get: function() {
        return this._port;
    },
    configurable: true
});
// --------------------------------------------------------------------------------
// * User Map
// --------------------------------------------------------------------------------
SubServer.prototype.noUser = function(){
    return this._usermap.keys().length === 0;
};
SubServer.prototype.addUser = function(username){
    this._usermap[username] = new Date().getTime();
};
SubServer.prototype.refreshUser = function(username){
    if (this._usermap[username]){
        this._usermap[username] = new Date().getTime();
    }
};
SubServer.prototype.checkUser = function(){
    let remove_list = [];
    let current_time = new Date().getTime();
    for (let username in this._usermap){
        if (current_time - this._usermap[username] > 1000 * 60 * 30){
            remove_list.push(username);
        }
    }
    for (let i = 0; i < remove_list.length; i++){
        this.removeUser(remove_list[i]);
    }
};
SubServer.prototype.removeUser = function(username){
    if (this._usermap[username]){
        delete this._usermap[username];
    }
    if (this.noUser()){
        Server.removeSubServer(this._filename);
    }
};
// --------------------------------------------------------------------------------
// * Socket Event
// --------------------------------------------------------------------------------
SubServer.prototype.onSocketListening = function(){
    console.log('SDUDOC SubServer <' + this._filename + '> start on port:' + Server.PORT + ' <udp4>');
};
SubServer.prototype.onSocketMessage = function(cs_msg, c_info){
    let sc_msg = this.processMessage(cs_msg);
    let sc_buffer = JSON.stringify(sc_msg);
    this._udp_server.send(sc_buffer, 0, sc_buffer.length, c_info.port, c_info.address);
};
SubServer.prototype.onSocketError = function(error){
    console.log(error);
};
// --------------------------------------------------------------------------------
// * Process Message
// --------------------------------------------------------------------------------
SubServer.prototype.processMessage = function(cs_msg){
    let msg_id = cs_msg.msgid;
    let process_func = this['msg_' + msg_id];
    return (!process_func || typeof process_func !== 'function') ? {} : process_func(cs_msg);
};
// --------------------------------------------------------------------------------
SubServer.prototype.msg_LOGIN_REQ = function(cs_msg){
    let sc_msg = {}
    sc_msg.msgid = 'LOGIN_RSP';
    return sc_msg;
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
SubServer.prototype.load = function(filename){

};
SubServer.prototype.save = function(){

};
// ================================================================================

// ================================================================================
module.exports = SubServer;
// ================================================================================
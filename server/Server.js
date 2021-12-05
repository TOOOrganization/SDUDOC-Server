"use strict"
const SubServer = require("./core/SubServer");
const dgram = require('dgram');

// ================================================================================
// * Server <SDUDOC Server Plugin>
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
// * Server
// --------------------------------------------------------------------------------
function Server(){
    throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Server.PORT = 6000;
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Server._udp_server = null;
Server._sub_server_map = {};
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Server.initialize = function(){
    this.clear();
    this.startSocket();
};
Server.clear = function(){
    this._udp_server = null;
    this._sub_server_map = {};
};
Server.startSocket = function(){
    this._udp_server = dgram.createSocket('udp4');
    this._udp_server.bind(Server.PORT);
    this._udp_server.on('listening', function () {
        Server.onSocketListening();
    });
    this._udp_server.on('message', function (cs_buffer, c_info) {
        let cs_msg = JSON.parse(cs_buffer.toString());
        Server.onSocketMessage(cs_msg, c_info);
    });
    this._udp_server.on('error', function (error) {
        Server.onSocketError(error);
    });
};
// --------------------------------------------------------------------------------
// * Socket Event
// --------------------------------------------------------------------------------
Server.onSocketListening = function(){
    console.log('SDUDOC Server start on port:' + Server.PORT + ' <udp4>');
};
Server.onSocketMessage = function(cs_msg, c_info){
    let sc_msg = this.processMessage(cs_msg);
    let sc_buffer = JSON.stringify(sc_msg);
    this._udp_server.send(sc_buffer, 0, sc_buffer.length, c_info.port, c_info.address);
};
Server.onSocketError = function(error){
    console.log(error);
};
// --------------------------------------------------------------------------------
// * Process Message
// --------------------------------------------------------------------------------
Server.processMessage = function(cs_msg){
    let msg_id = cs_msg.msg_id;
    let process_func = Server['msg_' + msg_id];
    return (!process_func || typeof process_func !== 'function') ? {} : process_func(cs_msg);
};
// --------------------------------------------------------------------------------
Server.msg_LOGIN_REQ = function(cs_msg){
    let sc_msg = {}
    sc_msg.msgid = 'LOGIN_RSP';
    return sc_msg;
};
Server.msg_LOGOUT_REQ = function(cs_msg){
    let sc_msg = {}
    sc_msg.msgid = 'LOGOUT_RSP';
    return sc_msg;
};
Server.msg_DOCUMENT_OPEN_REQ = function(cs_msg){
    if (!this._sub_server_map[cs_msg.filename]){
        this._sub_server_map[cs_msg.filename] = new SubServer();
        this._sub_server_map[cs_msg.filename].load(cs_msg.filename);
    }
    let sub_server = this._sub_server_map[cs_msg.filename];
    sub_server.addUser(cs_msg.username);

    let sc_msg = {}
    sc_msg.msgid = 'DOCUMENT_OPEN_RSP';
    sc_msg.port = sub_server.port;
    sc_msg.document = sub_server.save();
    return sc_msg;
};
Server.msg_CS_DOCUMENT_CLOSE_REQ = function(cs_msg){
    if (this._sub_server_map[cs_msg.filename]){
        let sub_server = this._sub_server_map[cs_msg.filename];
        sub_server.removeUser(cs_msg.username);
        if (sub_server.noUser()) {
            sub_server.close();
            delete this._sub_server_map[cs_msg.filename];
        }
    }

    let sc_msg = {}
    sc_msg.msgid = 'DOCUMENT_CLOSE_RSP';
    return sc_msg;
};
// ================================================================================

// ================================================================================
Server.initialize();
// ================================================================================

// ================================================================================
module.exports = Server;
// ================================================================================
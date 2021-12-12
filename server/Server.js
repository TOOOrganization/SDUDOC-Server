"use strict"
const SubServer = require("./core/SubServer");
const http = require('http');

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
Server.PORT = 7000;
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Server._http_server = null;
// --------------------------------------------------------------------------------
Server._sub_server_map = {};
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Server.initialize = function(){
    this.clear();
    this.startSocket();
};
// --------------------------------------------------------------------------------
Server.clear = function(){
    this._http_server = null;
    this._sub_server_map = {};
};
Server.startSocket = function(){
    this._http_server = http.createServer();
    this._http_server.on('listening', function () {
        Server.onHttpListening();
    });
    this._http_server.on('request', function(request, response){
        let params = '';
        request.on('data', function(param){
            params += param;
        });
        request.on('end',function(){
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS, DELETE');
            response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            response.writeHead(200, {
                'Content-Type' : 'application/json'
            });
            if(params){
                let cs_msg = JSON.parse(params);
                console.log(cs_msg);
                let sc_msg = {}
                let code = Server.onHttpRequest(cs_msg, sc_msg);
                let data = { code: code, sc_msg: sc_msg, }
                response.write(JSON.stringify(data));
            }
            response.end();
        });
    });
    this._http_server.listen(Server.PORT);
};
// --------------------------------------------------------------------------------
// * Sub Server
// --------------------------------------------------------------------------------
Server.addSubServer = function(filename){
    if (!this._sub_server_map[filename]) {
        this._sub_server_map[filename] = new SubServer(filename);
    }
};
Server.removeSubServer = function(filename){
    let sub_server = this._sub_server_map[filename];
    if (sub_server && sub_server.noUser()) {
        sub_server.shutdown();
        delete this._sub_server_map[filename];
    }
};
// --------------------------------------------------------------------------------
// * Socket Event
// --------------------------------------------------------------------------------
Server.onHttpListening = function(){
    console.log('SDUDOC Server start on port: ' + Server.PORT);
};
Server.onHttpRequest = function(cs_msg, sc_msg){
    return this.processMessage(cs_msg, sc_msg);
};
// --------------------------------------------------------------------------------
// * Process Message
// --------------------------------------------------------------------------------
Server.processMessage = function(cs_msg, sc_msg){
    let msg_id = cs_msg.msg_id;
    let process_func = Server['msg_' + msg_id];
    return (!process_func || typeof process_func !== 'function') ? {} : process_func(cs_msg, sc_msg);
};
// --------------------------------------------------------------------------------
Server.msg_LOGIN_REQ = function(cs_msg, sc_msg){
    sc_msg.msg_id = 'LOGIN_RSP';
    sc_msg.token = cs_msg.username;
    return 200;
};
Server.msg_LOGOUT_REQ = function(cs_msg, sc_msg){
    sc_msg.msg_id = 'LOGOUT_RSP';
    return 200;
};
Server.msg_DOCUMENT_OPEN_REQ = function(cs_msg){
    if (!this._sub_server_map[cs_msg.filename]){
        this.addSubServer(cs_msg.filename);
    }
    let sub_server = this._sub_server_map[cs_msg.filename];
    sub_server.addUser(cs_msg.username);

    let sc_msg = {}
    sc_msg.msg_id = 'DOCUMENT_OPEN_RSP';
    sc_msg.port = sub_server.port;
    sc_msg.document = sub_server.save();
    return sc_msg;
};
Server.msg_CS_DOCUMENT_CLOSE_REQ = function(cs_msg){
    if (this._sub_server_map[cs_msg.filename]){
        let sub_server = this._sub_server_map[cs_msg.filename];
        sub_server.removeUser(cs_msg.username);
    }

    let sc_msg = {}
    sc_msg.msg_id = 'DOCUMENT_CLOSE_RSP';
    return sc_msg;
};
// ================================================================================

// ================================================================================
Server.initialize();
// ================================================================================

// ================================================================================
module.exports = Server;
// ================================================================================
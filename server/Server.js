'use strict'
const SubServer = require('./core/SubServer');
const ElementManager = require('./manager/ElementManager');
const http = require('http');
const fs = require('fs');

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
Server.DOCUMENT_PATH = '../document/';
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
    this.start();

    ElementManager.initialize();
};
// --------------------------------------------------------------------------------
Server.clear = function(){
    this._http_server = null;
    this._sub_server_map = {};
};
Server.start = function(){
    this._http_server = http.createServer();
    this._http_server.on('listening', function () {
        Server.onHttpListening();
    });
    this._http_server.on('request', function(request, response){
        let params = '';
        request.on('data', function(param){
            params += param;
        });
        request.on('end',async function(){
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
                let code = await Server.onHttpRequest(cs_msg, sc_msg);
                console.log(sc_msg);
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
Server.addSubServer = async function(filename){
    if (!this._sub_server_map[filename]) {
        this._sub_server_map[filename] = new SubServer(filename);
        return await this._sub_server_map[filename].start();
    }
};
Server.removeSubServer = function(filename){
    let sub_server = this._sub_server_map[filename];
    if (sub_server && sub_server.noUser()) {
        sub_server.stop();
        delete this._sub_server_map[filename];
    }
};
// --------------------------------------------------------------------------------
// * Http Event
// --------------------------------------------------------------------------------
Server.onHttpListening = function(){
    console.log('SDUDOC Server start on port: ' + Server.PORT);
};
Server.onHttpRequest = async function(cs_msg, sc_msg){
    return await this.processMessage(cs_msg, sc_msg);
};
// --------------------------------------------------------------------------------
// * Process Message
// --------------------------------------------------------------------------------
Server.processMessage = async function (cs_msg, sc_msg) {
    let msg_id = cs_msg.msg_id;
    let process_func = Server['msg_' + msg_id];
    return (!process_func || typeof process_func !== 'function') ? {} : await process_func(cs_msg, sc_msg);
};
// --------------------------------------------------------------------------------
Server.msg_LOGIN_REQ = async function(cs_msg, sc_msg){
    sc_msg.msg_id = 'LOGIN_RSP';
    sc_msg.token = cs_msg.username;
    return 200;
};
Server.msg_LOGOUT_REQ = async function(cs_msg, sc_msg){
    sc_msg.msg_id = 'LOGOUT_RSP';
    return 200;
};
Server.msg_GET_CLOUD_DOCUMENT_LIST_REQ = async function(cs_msg, sc_msg){
    return new Promise((resolve) => {
        fs.readdir(Server.DOCUMENT_PATH, function(error, files){
            if(error){
                console.log(error);
                resolve(500);
            }
            sc_msg.msg_id = 'GET_CLOUD_DOCUMENT_LIST_RSP';
            sc_msg.cloud_document_list = [
                { filename: '新建云文档' },
            ];
            for(let i = 0; i < files.length; i++){
                sc_msg.cloud_document_list.push({
                    filename: files[i],
                });
            }
            resolve(200);
        });
    });
};
Server.msg_NEW_CLOUD_DOCUMENT_REQ = async function(cs_msg, sc_msg){
    if (!Server._sub_server_map[cs_msg.filename]){
        await Server.addSubServer(cs_msg.filename);
    }
    let sub_server = Server._sub_server_map[cs_msg.filename];
    sub_server.addUser(cs_msg.username);

    sc_msg.msg_id = 'NEW_CLOUD_DOCUMENT_RSP';
    sc_msg.port = sub_server.port;
    sc_msg.filename = sub_server.filename;
    sc_msg.document = sub_server.saveJson();
    return 200;
};
Server.msg_OPEN_CLOUD_DOCUMENT_REQ = async function(cs_msg, sc_msg){
    if (!Server._sub_server_map[cs_msg.filename]){
        await Server.addSubServer(cs_msg.filename);
    }
    let sub_server = Server._sub_server_map[cs_msg.filename];
    sub_server.addUser(cs_msg.username);

    sc_msg.msg_id = 'OPEN_CLOUD_DOCUMENT_RSP';
    sc_msg.port = sub_server.port;
    sc_msg.filename = sub_server.filename;
    sc_msg.document = sub_server.saveJson();
    return 200;
};
Server.msg_CLOSE_CLOUD_DOCUMENT_REQ = async function(cs_msg, sc_msg){
    if (Server._sub_server_map[cs_msg.filename]){
        let sub_server = Server._sub_server_map[cs_msg.filename];
        sub_server.removeUser(cs_msg.username);
    }

    sc_msg.msg_id = 'CLOSE_CLOUD_DOCUMENT_RSP';
    return 200;
};
// ================================================================================

// ================================================================================
Server.initialize();
// ================================================================================

// ================================================================================
module.exports = Server;
// ================================================================================
'use strict'
const Document = require('../core/Document')
const http = require('http');
const fs = require('fs');
const Server = require("../Server");

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
SubServer.prototype._http_server = null;
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
};
// --------------------------------------------------------------------------------
SubServer.prototype.clear = function(){
    this._filename = null;
    this._port = null;
    this._http_server = null;
};
SubServer.prototype.start = async function(){
    let that = this;
    return new Promise((resolve) => {
        that._http_server = http.createServer();
        that._http_server.on('listening', function () {
            that._port = that._http_server.address().port;
            that.onHttpListening();
            resolve(that._port);
        });
        that._http_server.on('request', function(request, response){
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
                    let code = await that.onHttpRequest(cs_msg, sc_msg);
                    console.log(sc_msg);
                    let data = { code: code, sc_msg: sc_msg, }
                    response.write(JSON.stringify(data));
                }
                response.end();
            });
        });
        that._http_server.listen(0);
    });
};
SubServer.prototype.stop = function(){
    this.save();
    this._http_server.close();
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
Object.defineProperty(SubServer.prototype, 'filename', {
    get: function() {
        return this._filename;
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
        const Server = require('../Server');
        Server.removeSubServer(this._filename);
    }
};
// --------------------------------------------------------------------------------
// * Http Event
// --------------------------------------------------------------------------------
SubServer.prototype.onHttpListening = function(){
    console.log('SDUDOC Sub Server start on port: ' + this._port);
};
SubServer.prototype.onHttpRequest = async function(cs_msg, sc_msg){
    return await this.processMessage(cs_msg, sc_msg);
};
// --------------------------------------------------------------------------------
// * Process Message
// --------------------------------------------------------------------------------
SubServer.prototype.processMessage = async function(cs_msg, sc_msg){
    let msg_id = cs_msg.msgid;
    let process_func = this['msg_' + msg_id];
    return (!process_func || typeof process_func !== 'function') ? {} : await process_func(cs_msg, sc_msg);
};
// --------------------------------------------------------------------------------
SubServer.prototype.msg_LOGIN_REQ = async function(cs_msg, sc_msg){
    sc_msg.msgid = 'LOGIN_RSP';
    return 200;
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
SubServer.prototype.load = function(filename){
    this._document = new Document();
    this._filename = filename;

    const Server = require('../Server');
    let file_data = fs.readFileSync(Server.DOCUMENT_PATH + this._filename);
    let json_object = JSON.parse(String(file_data));
    this.loadJson(json_object);
};
SubServer.prototype.save = function(){
    let json_object = this.saveJson();
    let file_data = JSON.stringify(json_object);
    const Server = require('../Server');
    fs.writeFileSync(Server.DOCUMENT_PATH + this._filename + '1', file_data);
};
// --------------------------------------------------------------------------------
SubServer.prototype.loadJson = function(json_object){
    this._document.loadJson(json_object);
};
SubServer.prototype.saveJson = function(){
    return this._document.saveJson();
};
// ================================================================================

// ================================================================================
module.exports = SubServer;
// ================================================================================
"use strict"
const PLUGIN_LIST = require('../plugins.json').PLUGIN_LIST;

// ================================================================================
// * ElementManager <SDUDOC Server>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/10 - Version 1.0.0
//     - Server core
// ================================================================================

// ================================================================================
// * ElementManager
// --------------------------------------------------------------------------------
function ElementManager(){
    throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
ElementManager.SAPARATOR = '_';
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
ElementManager._element_object = [];
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
ElementManager.initialize = function(){
    this.loadObject();
};
// --------------------------------------------------------------------------------
ElementManager.loadObject = function(){
    this._element_object = {};
    const PageObject = require('../object/Page');
    this._element_object[PageObject.TAG] = PageObject;
    for (let i = 0; i < PLUGIN_LIST.length; i++){
        const PluginObject = require('../plugin/' + PLUGIN_LIST[i]);
        this._element_object[PluginObject.TAG] = Object;
    }
};
// --------------------------------------------------------------------------------
ElementManager.newElement = function(type){
    return this._element_object[type].newElement();
};
// ================================================================================

// ================================================================================
module.exports = ElementManager;
// ================================================================================
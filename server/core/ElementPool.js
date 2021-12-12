'use strict'
const ElementManager = require('../manager/ElementManager');

// ================================================================================
// * ElementPool <SDUDOC Server>
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
// * ElementPool
// --------------------------------------------------------------------------------
function ElementPool(){
    this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
ElementPool.prototype._next_index = {};
ElementPool.prototype._element_pool_dict = {};
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
ElementPool.prototype.initialize = function(){
    this.clear();
};
ElementPool.prototype.clear = function(){
    this._next_index = {};
    this._element_pool_dict = {};
};
// --------------------------------------------------------------------------------
// * Element
// --------------------------------------------------------------------------------
ElementPool.prototype.initializePool = function(type){
    this._element_pool_dict[type] = this._element_pool_dict[type] || {};
};
ElementPool.prototype.initializeIndex = function(type){
    this._next_index[type] = this._next_index[type] || 1;
};
// --------------------------------------------------------------------------------
ElementPool.prototype.isElementExist = function(type, id){
    return id && this._element_pool_dict[type] && this._element_pool_dict[type][id];
}
// --------------------------------------------------------------------------------
ElementPool.prototype.addElement = function(type, element){
    this.initializePool(type);
    if (this.isElementExist(type, element.id)) return;
    this._element_pool_dict[type][element.id] = element;
};
ElementPool.prototype.removeElement = function(type, id){
    if (!this.isElementExist(type, id)) return;
    delete this._element_pool_dict[type][id];
};
ElementPool.prototype.updateElement = function(type, id, json_object){
    if (!this.isElementExist(type, id)) return;
    for(let key in json_object) {
        if(key.startsWith('_')){
            this._element_pool_dict[type][id][key] = json_object[key];
        }
    }
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
ElementPool.prototype.getNextIndex = function(type){
    this.initializeIndex(type);
    return type + ElementManager.SAPARATOR + (this._next_index[type] ++);
}
ElementPool.prototype.makeElement = function(type, pages){
    let element = ElementManager.newElement(type);
    arguments[0] = this.getNextIndex(type);
    element.initialize.apply(element, arguments);
    return element;
}
// --------------------------------------------------------------------------------
// * Get Element
// --------------------------------------------------------------------------------
ElementPool.prototype.getAllElement = function(){
    return this._element_pool_dict;
}
ElementPool.prototype.getElements = function(type){
    if (!this._element_pool_dict[type]) return {};
    return this._element_pool_dict[type];
}
ElementPool.prototype.getElement = function(type, id){
    if(!this.isElementExist(type, id)) return null;
    return this._element_pool_dict[type][id];
}
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
ElementPool.prototype.loadJson = function(json_object){
    this._next_index = json_object.Index;

    this._element_pool_dict = {};
    for(let type in json_object.Data){
        this._element_pool_dict[type] = {};
        for(let key in json_object.Data[type]){
            let element = ElementManager.newElement(type);
            element.loadJson(json_object.Data[type][key]);
            this._element_pool_dict[type][element.id] = element;
        }
    }
}
ElementPool.prototype.saveJson = function(){
    let output = {};

    output.Index = this._next_index;
    output.Data = {}

    for(let type in this._element_pool_dict){
        output.Data[type] = [];
        for(let id in this._element_pool_dict[type]){
            output.Data[type].push(this._element_pool_dict[type][id].saveJson());
        }
    }
    return output;
}
// ================================================================================

// ================================================================================
module.exports = ElementPool;
// ================================================================================
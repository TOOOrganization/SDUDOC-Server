"use strict"

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
// * Constant
// --------------------------------------------------------------------------------
ElementPool.SAPARATOR = '_';
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
ElementManager.isElementExist = function(type, id){
    return id && this._element_pool_dict[type] && this._element_pool_dict[type][id];
}
ElementManager.isFilteredElementExist = function(type, id){
    return id && this._filtered_pool_dict[type] && this._filtered_pool_dict[type][id];
}
// --------------------------------------------------------------------------------
ElementManager.addElement = function(type, element){
    this.initializePool(type);
    if (this.isElementExist(type, element.id)) return;
    this._element_pool_dict[type][element.id] = element;
    element.onAwake.call(element);
};
ElementManager.removeElement = function(type, id){
    if (!this.isElementExist(type, id)) return;
    this._element_pool_dict[type][id].onRemove.call(this._element_pool_dict[type][id]);
    delete this._element_pool_dict[type][id];
};
ElementManager.updateElement = function(type, id, json_object){
    if (!this.isElementExist(type, id)) return;
    for(let key in json_object) {
        this._element_pool_dict[type][id][key] = json_object[key];
    }
    this._element_pool_dict[type][id].onUpdate.call(this._element_pool_dict[type][id]);
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
ElementManager.getNextIndex = function(type){
    this.initializeIndex(type);
    return type + this.SAPARATOR + (this._next_index[type] ++);
}
ElementManager.makeElement = function(type, pages){
    let element = window[type].prototype.newElement();
    arguments[0] = this.getNextIndex(type);
    element.initialize.apply(element, arguments);
    return element;
}
// --------------------------------------------------------------------------------
// * Get Element
// --------------------------------------------------------------------------------
ElementManager.getAllElement = function(){
    return this._element_pool_dict;
}
ElementManager.getElements = function(type){
    if (!this._element_pool_dict[type]) return {};
    return this._element_pool_dict[type];
}
ElementManager.getElement = function(type, id){
    if(!this.isElementExist(type, id)) return null;
    return this._element_pool_dict[type][id];
}
// --------------------------------------------------------------------------------
ElementManager.getAllFilteredElement = function(){
    return this._filtered_pool_dict;
}
ElementManager.getFilteredElements = function(type){
    if (!this._filtered_pool_dict[type]) return {};
    return this._filtered_pool_dict[type];
}
ElementManager.getFilteredElement = function(type, id){
    if(!this.isFilteredElementExist(type, id)) return null;
    return this._filtered_pool_dict[type][id];
}
// --------------------------------------------------------------------------------
// * Filter
// --------------------------------------------------------------------------------
ElementManager.isElementInPage = function(element, page_id){
    return element.pages && element.pages.indexOf(page_id) !== -1;
}
ElementManager.updateFilteredDict = function(page_id){
    this._filtered_pool_dict = {};
    for(let type in this._element_pool_dict){
        this._filtered_pool_dict[type] = {}
        for(let id in this._element_pool_dict[type]){
            if(this.isElementInPage(this._element_pool_dict[type][id], page_id)){
                this._filtered_pool_dict[type][id] = this._element_pool_dict[type][id];
            }
        }
    }
}
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
ElementManager.loadJson = function(json_object){
    this._next_index = json_object.Index;

    this._element_pool_dict = {};
    for(let type in json_object.Data){
        this._element_pool_dict[type] = {};
        for(let key in json_object.Data[type]){
            let element = window[type].prototype.newElement();
            element.loadJson(json_object.Data[type][key]);
            this._element_pool_dict[type][element.id] = element;
        }
    }
}
ElementManager.saveJson = function(){
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
ElementManager.exportJson = function(){
    let output = {};
    for(let type in this._element_pool_dict){
        for(let id in this._element_pool_dict[type]){
            let json_object = this._element_pool_dict[type][id].exportJson();
            if(json_object) {
                output[type] = output[type] || [];
                output[type].push(json_object);
            }
        }
    }
    return output;
}
// ================================================================================


// ================================================================================
module.exports = ElementPool;
// ================================================================================
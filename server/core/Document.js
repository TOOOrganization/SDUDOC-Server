'use strict'
const Header = require('../core/Header');
const PageArray = require('../core/PageArray');
const ElementPool = require('../core/ElementPool');
const Page = require('../object/Page');

// ================================================================================
// * Document <SDUDOC Server Plugin>
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
// * Document
// --------------------------------------------------------------------------------
function Document(){
    this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Document.prototype._filename = null;
Document.prototype._header = null;
Document.prototype._page_array = null;
Document.prototype._element_pool = null;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Document.prototype.initialize = function(){
    this._filename = null;
    this.clearData();
};
Document.prototype.clear = function(){
    this._filename = null;
    this.clearData();
};
Document.prototype.clearData = function(){
    this._header = new Header();
    this._page_array = new PageArray();
    this._element_pool = new ElementPool();
};
// --------------------------------------------------------------------------------
// * Document
// --------------------------------------------------------------------------------
Document.prototype.new = function(){
    this.newDocument();
};
Document.prototype.newDocument = function(){
    this.clear();
}
// --------------------------------------------------------------------------------
// * Header
// --------------------------------------------------------------------------------
Document.prototype.getHeaderTooltip = function(){
    return this._header.getTextArray()
}
Document.prototype.getHeaderData = function(){
    return this._header.getDataArray()
}
Document.prototype.setHeaderData = function(data){
    this._header.setDataArray(data)
}
// --------------------------------------------------------------------------------
// * Element
// --------------------------------------------------------------------------------
Document.prototype.addElement = function(type, element){
    this._element_pool.addElement(type, element);
};
Document.prototype.removeElement = function(type, id){
    this._element_pool.removeElement(type, id);
};
Document.prototype.updateElement = function(type, id, data){
    this._element_pool.updateElement(type, id, data);
};
// --------------------------------------------------------------------------------
// * Page
// --------------------------------------------------------------------------------
Document.prototype.addAfterPage = function(index, page_object){
    this.addElement(Page.TAG, page_object);
    this._page_array.addAfterCurrentPage(page_object.id);
}
Document.prototype.removePage = function(page_id){
    this._page_array.removePage(page_id);
    this.removeElement(Page.TAG, page_id);
}
// --------------------------------------------------------------------------------
Document.prototype.addAfterCurrentPage = async function(filename, src){
    let request_src = await HttpRequest.uploadWebPage(filename, src);
    if(!request_src) return;
    let page = ElementManager.makeElement(Page.TAG, request_src);
    this.addElement(Page.TAG, page);
    this._page_array.addAfterCurrentPage(page.id);
    await this.afterChangePage();
    Engine.progress(100);
}
Document.clearCurrentPage = function(){
    let page = this.getCurrentPageObject();
    page.onRemove.call(page);
    this.afterChangeElement();
}
Document.removeCurrentPage = async function(){
    let page = this._page_array.removeCurrentPage();
    this.removeElement(Page.TAG, page);
    await this.afterChangePage();
}
// --------------------------------------------------------------------------------
Document.getCurrentPage = function(){
    return this._page_array.getCurrentPage();
}
Document.getCurrentPageId = function(){
    return this._page_array.getCurrentPageId();
}
Document.getCurrentPageObject = function(){
    return ElementManager.getElement(Page.TAG, this.getCurrentPageId());
}
// --------------------------------------------------------------------------------
Document.setCurrentPageIndex = async function(index){
    await this.setCurrentPage(index + 1);
}
Document.setCurrentPage = async function(index){
    this._page_array.setCurrentPage(index);
    await this.afterChangePage();
}
// --------------------------------------------------------------------------------
Document.moveCurrentPageForward = async function(){
    this._page_array.moveCurrentPageForward();
    await this.afterChangePage();
}
Document.moveCurrentPageBackward = async function(){
    this._page_array.moveCurrentPageBackward();
    await this.afterChangePage();
}
Document.moveCurrentPageTo = async function(target){
    this._page_array.moveCurrentPageTo(target);
    await this.afterChangePage();
}
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Document.prototype.getSaveFilename = function(){
    return (this._filename ? this._filename : 'Untitled') + '.sjs';
};
// --------------------------------------------------------------------------------
Document.prototype.load = async function(filename, json){
    this.clear();
    this._filename = filename.split('.');
    this._filename.pop();
    this._filename = this._filename.join('.');

    let json_object = JSON.parse(json);
    this.loadJson(json_object);
};
Document.prototype.save = function(){
    return JSON.stringify(this.saveJson());
};
// --------------------------------------------------------------------------------
Document.prototype.loadJson = function(json_object){
    this.clearData();
    this._header.loadJson(json_object.Header);
    this._page_array.loadJson(json_object.PageList);
    this._element_pool.loadJson(json_object.Elements);
};
Document.prototype.saveJson = function(){
    let output = {};
    output.Header = this._header.saveJson();
    output.PageList = this._page_array.saveJson();
    output.Elements = this._element_pool.saveJson();
    return output;
};
// ================================================================================

// ================================================================================
module.exports = Document;
// ================================================================================
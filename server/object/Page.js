'use strict'
const Element = require('../object/Element');

// ================================================================================
// * Page <SDUDOC Server Plugin>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   [Warning] You need SDUDOC Server to apply this plugin.
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/10 - Version 1.0.0
//     - Initial
// ================================================================================

// ================================================================================
// * Page
// --------------------------------------------------------------------------------
function Page(){
  this.initialize.apply(this, arguments);
}
Page.prototype = Object.create(Element.prototype);
Page.prototype.constructor = Page;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Page.TAG = 'Page';
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Page.prototype._src = '';
// --------------------------------------------------------------------------------
Page.prototype._width = 0;
Page.prototype._height = 0;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Page.prototype.initialize = function(id, src){
  Element.prototype.initialize.call(this, id, []);
  this._src = src;
  this._width = 0;
  this._height = 0;
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Page.prototype.newElement = function(){
  return new Page('', '');
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Page.prototype.loadJson = function(json_object){
  Element.prototype.loadJson.call(this, json_object);
  this._src    = json_object._src    === undefined ? this._src    : json_object._src;
  this._width  = json_object._width  === undefined ? this._width  : json_object._width;
  this._height = json_object._height === undefined ? this._height : json_object._height;
};
Page.prototype.saveJson = function(){
  let output = Element.prototype.saveJson.call(this);
  delete output._pages;
  output._src    = this._src;
  output._width  = this._width;
  output._height = this._height;
  return output;
};
// ================================================================================

// ================================================================================
module.exports = Page;
// ================================================================================
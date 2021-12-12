'use strict'
const Element = require('../object/Element');

// ================================================================================
// * Polygon <SDUDOC Server Plugin>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   [Warning] You need SDUDOC Server to apply this plugin.
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/19 - Version 1.0.0
//     - Server core
// ================================================================================

// ================================================================================
// * Polygon2D
// --------------------------------------------------------------------------------
function Polygon2D(){
  this.initialize.apply(this, arguments);
}
Polygon2D.prototype = Object.create(Element.prototype);
Polygon2D.prototype.constructor = Polygon2D;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Polygon2D.TAG = 'Polygon2D';
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Polygon2D.prototype._points = [];
// --------------------------------------------------------------------------------
Polygon2D.prototype._character = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Polygon2D.prototype.initialize = function(id, pages, points){
  Element.prototype.initialize.call(this, id, pages);

  this._points = points;
  this._character = '';
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Polygon2D.prototype.newElement = function(){
  return new Polygon2D('', [], []);
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Polygon2D.prototype.loadJson = function(json_object){
  Element.prototype.loadJson.call(this, json_object);
  this._points    = json_object._points    === undefined ? this._points    : json_object._points;
  this._character = json_object._character === undefined ? this._character : json_object._character;
};
Polygon2D.prototype.saveJson = function(){
  let output = Element.prototype.saveJson.call(this);
  output._points    = this._points;
  output._character = this._character;
  return output;
};
// ================================================================================

// ================================================================================
module.exports = Polygon2D;
// ================================================================================
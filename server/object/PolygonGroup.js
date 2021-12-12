'use strict'
const Element = require('../object/Element');

// ================================================================================
// * PolygonGroup <SDUDOC Server Plugin>
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
// * PolygonGroup
// --------------------------------------------------------------------------------
function PolygonGroup() {
  this.initialize.apply(this, arguments);
}
PolygonGroup.prototype = Object.create(Element.prototype);
PolygonGroup.prototype.constructor = PolygonGroup;
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
PolygonGroup.prototype._father = '';
PolygonGroup.prototype._children = [];
PolygonGroup.prototype._points = {};
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
PolygonGroup.prototype.initialize = function(id, pages){
  Element.prototype.initialize.call(this, id, pages);
  this._children = [];
  this._father = '';
  this._points = {};
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
PolygonGroup.prototype.newElement = function(){
  return new PolygonGroup('', []);
};
// --------------------------------------------------------------------------------
PolygonGroup.prototype.loadJson = function(json_object){
  Element.prototype.loadJson.call(this, json_object);
  this._children = json_object._children === undefined ? this._children : json_object._children;
  this._father   = json_object._father   === undefined ? this._father   : json_object._father;
  this._points   = json_object._points   === undefined ? this._points   : json_object._points;
};
PolygonGroup.prototype.saveJson = function(){
  let output = Element.prototype.saveJson.call(this);
  output._children = this._children;
  output._father   = this._father;
  output._points   = this._points;
  return output;
};
// ================================================================================

// ================================================================================
module.exports = PolygonGroup;
// ================================================================================

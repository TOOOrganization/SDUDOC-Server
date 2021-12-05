"use strict"
let Element = require("../object/Element");

// ================================================================================
// * Line2D <SDUDOC Server Plugin>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   [Warning] You need SDUDOC Server to apply this plugin.
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/17 - Version 1.0.0
//     - Server core
// ================================================================================

// ================================================================================
// * Line2D
// ================================================================================
function Line2D(){
  this.initialize.apply(this, arguments);
}
Line2D.prototype = Object.create(Element.prototype);
Line2D.prototype.constructor = Line2D;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Line2D.TAG = 'Line2D';
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Line2D.prototype._start = '';
Line2D.prototype._end = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Line2D.prototype.initialize = function(id, pages, start, end){
  Element.prototype.initialize.call(this, id, pages);

  this._start = start;
  this._end = end;
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Line2D.prototype.newElement = function(){
  return new Line2D('', [], '', '');
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Line2D.prototype.loadJson = function(json_object){
  Element.prototype.loadJson.call(this, json_object);
  this._start = json_object._start === undefined ? this._start : json_object._start;
  this._end   = json_object._end   === undefined ? this._end   : json_object._end;
};
Line2D.prototype.saveJson = function(){
  let output = Element.prototype.saveJson.call(this);
  output._start = this._start;
  output._end   = this._end;
  return output;
};
// ================================================================================

// ================================================================================
module.exports = Line2D;
// ================================================================================
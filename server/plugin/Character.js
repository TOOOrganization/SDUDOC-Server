'use strict'
const Element = require('../object/Element');

// ================================================================================
// * Character <SDUDOC Server Plugin>
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
// * Character
// --------------------------------------------------------------------------------
function Character(){
  this.initialize.apply(this, arguments);
}
Character.prototype = Object.create(Element.prototype);
Character.prototype.constructor = Character;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Character.TAG = 'Character';
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Character.prototype._char = '';
Character.prototype._remark = '';
// --------------------------------------------------------------------------------
Character.prototype._polygon = '';
Character.prototype._father = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Character.prototype.initialize = function(id, pages, polygon, char, remark){
  Element.prototype.initialize.call(this, id, pages);

  this._polygon = polygon;
  this._char = char;
  this._remark = remark;

  this._father = '';
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Character.prototype.newElement = function(){
  return new Character('', [], '', '', '');
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Character.prototype.loadJson = function(json_object){
  Element.prototype.loadJson.call(this, json_object);
  this._char    = json_object._char    === undefined ? this._char    : json_object._char;
  this._remark  = json_object._remark  === undefined ? this._remark  : json_object._remark;
  this._father  = json_object._father  === undefined ? this._father  : json_object._father;
  this._polygon = json_object._polygon === undefined ? this._polygon : json_object._polygon;
};
Character.prototype.saveJson = function(){
  let output = Element.prototype.saveJson.call(this);
  output._char    = this._char;
  output._remark  = this._remark;
  output._father  = this._father;
  output._polygon = this._polygon;
  return output;
};
// ================================================================================

// ================================================================================
module.exports = Character;
// ================================================================================
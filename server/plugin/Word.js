'use strict'
const PolygonGroup = require('../object/PolygonGroup');

// ================================================================================
// * Word <SDUDOC Server Plugin>
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
// * Word
// --------------------------------------------------------------------------------
function Word(){
  this.initialize.apply(this, arguments);
}
Word.prototype = Object.create(PolygonGroup.prototype);
Word.prototype.constructor = Word;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Word.TAG = 'Word';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Word.prototype.initialize = function(id, pages){
  PolygonGroup.prototype.initialize.call(this, id, pages);
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Word.prototype.newElement = function(){
  return new Word('', []);
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Word.prototype.loadJson = function(json_object){
  PolygonGroup.prototype.loadJson.call(this, json_object);
};
Word.prototype.saveJson = function(){
  return PolygonGroup.prototype.saveJson.call(this);
};
// ================================================================================

// ================================================================================
module.exports = Word;
// ================================================================================
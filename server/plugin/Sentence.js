"use strict"
let PolygonGroup = require("../object/PolygonGroup");

// ================================================================================
// * Sentence <SDUDOC Server Plugin>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   [Warning] You need SDUDOC Server to apply this plugin.
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/04/21 - Version 1.0.0
//     - Server core
// ================================================================================

// ================================================================================
// * Sentence
// --------------------------------------------------------------------------------
function Sentence(){
  this.initialize.apply(this, arguments);
}
Sentence.prototype = Object.create(PolygonGroup.prototype);
Sentence.prototype.constructor = Sentence;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Sentence.TAG = 'Sentence';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Sentence.prototype.initialize = function(id, pages){
  PolygonGroup.prototype.initialize.call(this, id, pages);
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Sentence.prototype.newElement = function(){
  return new Sentence('', []);
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Sentence.prototype.loadJson = function(json_object){
  PolygonGroup.prototype.loadJson.call(this, json_object);
};
Sentence.prototype.saveJson = function(){
  return PolygonGroup.prototype.saveJson.call(this);
};
// ================================================================================

// ================================================================================
module.exports = Sentence;
// ================================================================================
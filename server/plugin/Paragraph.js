"use strict"
let PolygonGroup = require("../object/PolygonGroup");

// ================================================================================
// * Paragraph <SDUDOC Server Plugin>
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
// * Paragraph
// --------------------------------------------------------------------------------
function Paragraph(){
  this.initialize.apply(this, arguments);
}
Paragraph.prototype = Object.create(PolygonGroup.prototype);
Paragraph.prototype.constructor = Paragraph;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Paragraph.TAG = 'Paragraph';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Paragraph.prototype.initialize = function(id, pages){
  PolygonGroup.prototype.initialize.call(this, id, pages);
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Paragraph.prototype.newElement = function(){
  return new Paragraph('', []);
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Paragraph.prototype.loadJson = function(json_object){
  PolygonGroup.prototype.loadJson.call(this, json_object);
};
Paragraph.prototype.saveJson = function(){
  return PolygonGroup.prototype.saveJson.call(this);
};
// ================================================================================

// ================================================================================
module.exports = Paragraph;
// ================================================================================
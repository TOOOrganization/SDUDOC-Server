"use strict"
const PolygonGroup = require("../object/PolygonGroup");

// ================================================================================
// * Article <SDUDOC Server Plugin>
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
// * Article
// --------------------------------------------------------------------------------
function Article(){
  this.initialize.apply(this, arguments);
}
Article.prototype = Object.create(PolygonGroup.prototype);
Article.prototype.constructor = Article;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Article.TAG = 'Article';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Article.prototype.initialize = function(id, pages){
  PolygonGroup.prototype.initialize.call(this, id, pages);
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Article.prototype.newElement = function(){
  return new Article('', []);
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Article.prototype.loadJson = function(json_object){
  PolygonGroup.prototype.loadJson.call(this, json_object);
};
Article.prototype.saveJson = function(){
  return PolygonGroup.prototype.saveJson.call(this);
};
// ================================================================================

// ================================================================================
module.exports = Article;
// ================================================================================
'use strict'
const Element = require('../object/Element');

// ================================================================================
// * Dot2D <SDUDOC Server Plugin>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   [Warning] You need SDUDOC Server to apply this plugin.
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/10 - Version 1.0.0
//     - Server core
// ================================================================================

// ================================================================================
// * Dot2D
// --------------------------------------------------------------------------------
function Dot2D() {
    this.initialize.apply(this, arguments);
}
Dot2D.prototype = Object.create(Element.prototype);
Dot2D.prototype.constructor = Dot2D;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Dot2D.TAG = 'Dot2D';
// --------------------------------------------------------------------------------
// * Enum
// --------------------------------------------------------------------------------
Dot2D.Type = {
    FREE: 0, DEPENDENT: 1, INTERSECTION: 2
};
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Dot2D.prototype._type = Dot2D.Type.FREE;
// --------------------------------------------------------------------------------
Dot2D.prototype._x = 0;
Dot2D.prototype._y = 0;
// --------------------------------------------------------------------------------
Dot2D.prototype._father = '';
Dot2D.prototype._position = 0;
// --------------------------------------------------------------------------------
Dot2D.prototype._father1 = '';
Dot2D.prototype._father2 = '';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Dot2D.prototype.initialize = function(id, pages, type, arg1, arg2){
    Element.prototype.initialize.call(this, id, pages);

    this._type = type;
    switch (this._type) {
        case Dot2D.Type.FREE: default:
            this._x = arg1;
            this._y = arg2;
            break;
        case Dot2D.Type.DEPENDENT:
            this._father = arg1;
            this._position = arg2;
            break;
        case Dot2D.Type.INTERSECTION:
            this._father1 = arg1;
            this._father2 = arg2;
            break;
    }
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Dot2D.prototype.newElement = function(){
    return new Dot2D('', [], Dot2D.Type.FREE, 0, 0);
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Dot2D.prototype.loadJson = function(json_object){
    Element.prototype.loadJson.call(this, json_object);
    this._type     = json_object._type     === undefined ? this._type     : json_object._type;
    this._x        = json_object._x        === undefined ? this._x        : json_object._x;
    this._y        = json_object._y        === undefined ? this._y        : json_object._y;
    this._father   = json_object._father   === undefined ? this._father   : json_object._father;
    this._position = json_object._position === undefined ? this._position : json_object._position;
    this._father1  = json_object._father1  === undefined ? this._father1  : json_object._father1;
    this._father2  = json_object._father2  === undefined ? this._father2  : json_object._father2;
};
Dot2D.prototype.saveJson = function(){
    let output = Element.prototype.saveJson.call(this);
    output._type     = this._type;
    output._x        = this._x;
    output._y        = this._y;
    output._father   = this._father;
    output._position = this._position;
    output._father1  = this._father1;
    output._father2  = this._father2;
    return output;
};
// ================================================================================

// ================================================================================
module.exports = Dot2D;
// ================================================================================

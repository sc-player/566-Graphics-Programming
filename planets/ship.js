//Ship data stored here.
var Ship = function(){
  WObject.call(this, "ship");
  this.drawType=gl.TRIANGLE_STRIP;
};

Ship.prototype = Object.create(WObject.prototype);
Ship.prototype.constructor = Ship;

/**
 * Draw object.
 */
Ship.prototype.draw= function(){
  if(player.fuel <= 0) return;
  WObject.prototype.draw.call(this);
};

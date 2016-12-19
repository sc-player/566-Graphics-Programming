/**
 * Philip Strachan
 * environment.js
 * Controls lighting and other environmental effects.
 */
var Environment = function(){
  this.ambient = [.2, .2, .2];
  this.lights = [[13, 2, 4], [13, 2, -4]];
  this.lightColors = [[1, 0, 0], [0, 0, 1]];
  this.enabled = [[1], [1]];
  this.objects = [
    new Sun()
  ];
  this.sun=this.objects[0];
};

//Animate the environment.
Environment.prototype.animate = function(){
  this.objects.forEach(function(val){
    val.animate();
  });
};

//Directional light data.
Sun = function(){
  this.dir = [-1, 0, 0];
  this.increasing = [true, true, true];
  this.color = [0, 0, 0];
  this.night = true;
};

/**
 * Animates the light direction in a circular "orbit".  Lowers and raises the 
 * color values appropriately based on the angle of the sun.
 */
Sun.prototype.animate = function(){
  for(var i=0; i<2; ++i){ 
    this.dir[i] += (this.increasing[i] ? 1 : -1) * deltaTime * orbitSpeed;
    if(this.dir[i] > 1 || this.dir[i] < -1) 
      this.increasing[i] = !this.increasing[i];
    else if(i === 1 && (
        (this.dir[i] > 0.2 && this.color[0] <  0 &&  this.night) || 
        (this.dir[i] < 0.2 && this.color[0] > .8 && !this.night)
      )
    ) this.night = !this.night;
  }
  if(this.night && this.color[0] >= 0) for(var i=0; i<3; ++i) 
    this.color[i]-=.0002 * deltaTime;
  else if(!this.night && this.color[0] <= .8) for(var i=0; i<3; ++i) 
    this.color[i]+=.0002 * deltaTime;
};


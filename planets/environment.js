var Environment = function(){
  this.ambient = [.8, .8, .8];
  this.objects = [
    new Sun()
  ];
  this.sun=this.objects[0];
};

Environment.prototype.animate = function(){
  this.objects.forEach(function(val){
    val.animate();
  });
};

Sun = function(){
  this.dir = [-1, 0, 0];
  this.increasing = [true, true, true];
  this.color = [0, 0, 0];
  this.night = true;
};

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

//Player state stored here.
var Player=function(p){
  this.visited=[];
  this.money=30;
  this.fuel=100;
  this.planet=-1;
  this.planets=p;
  this.centers=[]; 
  for(i=0; i<this.planets.points.length; i+=(circleDegrees+2)*4){
    this.centers.push(this.planets.points[i]);
    this.centers.push(this.planets.points[i+1]);
  }
  this.worldPos=[0, 0, 0];
  this.worldFacing=[0, 0, -1];
  this.worldTop=[0, 1, 0];
  this.view=new Matrix4();
  this.perspective = new Matrix4();
  this.perspective.setPerspective(30, canvas.width/canvas.height, 1, 100);
};

Player.prototype.updateCamera = function(){
  if(currentlyPressedKeys[38]){
    this.move(true);
  }
  if(currentlyPressedKeys[40]){
    this.move(false);
  }
  this.view.setLookAt(
    this.worldPos[0], this.worldPos[1], this.worldPos[2], 
    this.worldPos[0] + this.worldFacing[0], 
    this.worldPos[1] + this.worldFacing[1], 
    this.worldPos[2] + this.worldFacing[2], 
    this.worldTop[0], this.worldTop[1], this.worldTop[2]
  );
};

/**
 * Updates html elements on page to display information.
 */
Player.prototype.updateHud=function(){
  var planetType=this.planets.types[this.planet];
  document.getElementById("money-box").innerHTML = "Credits: " + this.money.toString();
  document.getElementById("gas-box").innerHTML = "Fuel: " + this.fuel.toString();
  document.getElementById("planets-box").innerHTML = "Planets left: " + (planetCount-this.visited.length).toString();
  document.getElementById("title-box").innerHTML = (this.planet>0 ? "You are on a " + planetTypes[planetType] + " planet" : "You are in open space.");
  document.getElementById("planet-image").src=(this.planet>0 ? textures[planetTypes[planetType]+".gif"].image.src : spaceImage);
  if(this.planet<0){
    document.getElementById("planet-pop").innerHTML = "";
    document.getElementById("planet-fuel").innerHTML = ""; 
    if(this.landButton){
      document.getElementById("planet-land").removeChild(this.landButton);
      this.landButton=null;
    }
    return;
  }
  document.getElementById("planet-pop").innerHTML = (this.planets.populated[this.planet])?"Populated":"Not Populated";
  document.getElementById("planet-fuel").innerHTML = "Fuel: " + this.planets.fuel[this.planet]; 
  if(this.landButton) return;
  this.landButton = document.createElement('input');
  this.landButton.type="button";
  this.landButton.value=(onPlanet ? "Leave" : "Land");
  this.landButton.onclick = function(){
    if(onPlanet){
      drawArraySurface.forEach(function(val){
        if(val.textured) val["releaseTextureUnits"]();
      });
      drawArraySpace.forEach(function(val){
        if(val.textured) val["gatherTextureUnits"]();
      });
    } else {
      drawArraySpace.forEach(function(val){
        if(val.textured) val["releaseTextureUnits"]();
      });
      drawArraySurface.forEach(function(val){
        if(val.textured) val["gatherTextureUnits"]();
      });
    }
    onPlanet=!onPlanet;
  }
  document.getElementById("planet-land").appendChild(this.landButton);
}; 

/**
 * Compare ship location with planet locations, and take appropriate actions if
 * we are on a planet.
 */
Player.prototype.checkPlanet=function(){
  for(i=0; i<planetCount*2; i+=2){
    if(cameraTranslation[0].toFixed(2)==-this.centers[i].toFixed(2) && cameraTranslation[1].toFixed(2)==-this.centers[i+1].toFixed(2)){
      this.planet=i/2;
      this.fuel+=this.planets.fuel[this.planet];
      if(this.visited.indexOf(this.planet) < 0) this.visited.push(this.planet);
      return;
    }
  }
  this.planet=-1;
};

Player.prototype.rotate=function(pos){
  
};

Player.prototype.move=function(pos){
  if(pos){
    this.worldPos[0]+=moveSpeed*this.worldFacing[0]*deltaTime;
    this.worldPos[1]+=moveSpeed*this.worldFacing[1]*deltaTime;
    this.worldPos[2]+=moveSpeed*this.worldFacing[2]*deltaTime;
  } else {
    this.worldPos[0]-=moveSpeed*this.worldFacing[0]*deltaTime;
    this.worldPos[1]-=moveSpeed*this.worldFacing[1]*deltaTime;
    this.worldPos[2]-=moveSpeed*this.worldFacing[2]*deltaTime;
  }
};

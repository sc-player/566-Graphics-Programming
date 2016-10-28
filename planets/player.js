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
  this.view=new Matrix4();
  this.perspective = new Matrix4();
  this.view.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
  this.perspective.setPerspective(30, canvas.width/canvas.height, 1, 100);
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
  document.getElementById("planet-image").src=(this.planet>0 ? this.planets.spaceTextures[planetType].image.src : spaceImage);
  if(this.planet<0){
    document.getElementById("planet-pop").innerHTML = "";
    document.getElementById("planet-fuel").innerHTML = ""; 
    return;
  }
  document.getElementById("planet-pop").innerHTML = (this.planets.populated[this.planet])?"Populated":"Not Populated";
    document.getElementById("planet-fuel").innerHTML = "Fuel: " + this.planets.fuel[this.planet]; 
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

player={
  visited: [],
  money: 30,
  fuel: 100,
  planet: -1,
  updateHud: function(){
    var planetType=planets.types[player.planet];
    document.getElementById("money-box").innerHTML = "Credits: " + player.money.toString();
    document.getElementById("gas-box").innerHTML = "Fuel: " + player.fuel.toString();
    document.getElementById("planets-box").innerHTML = "Planets left: " + (planetCount-player.visited.length).toString();
    document.getElementById("title-box").innerHTML = (player.planet>0 ? "You are on a " + planetTypes[planetType] + " planet" : "You are in open space.");
    document.getElementById("planet-image").src=(player.planet>0 ? planets.textures[planetType].image.src : spaceImage);
    if(player.planet<0){
      document.getElementById("planet-pop").innerHTML = "";
      document.getElementById("planet-fuel").innerHTML = ""; 
      return;
    }
    document.getElementById("planet-pop").innerHTML = (planets.populated[player.planet])?"Populated":"Not Populated";
      document.getElementById("planet-fuel").innerHTML = "Fuel: " + planets.fuel[player.planet]; 
  }, 
  init: function(){
    player.centers=[];
    for(i=0; i<planets.points.length; i+=(circleDegrees+2)*4){
      player.centers.push(planets.points[i]);
      player.centers.push(planets.points[i+1]);
    }
  },
  checkPlanet: function(){
    for(i=0; i<planetCount*2; i+=2){
      if(cameraTranslation[0].toFixed(2)==-player.centers[i].toFixed(2) && cameraTranslation[1].toFixed(2)==-player.centers[i+1].toFixed(2)){
        player.planet=i/2;
        player.fuel+=planets.fuel[player.planet];
        if(!player.visited.includes(player.planet)) player.visited.push(player.planet);
        return;
      }
    }
    player.planet=-1;
  }
}

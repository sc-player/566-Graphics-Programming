player={
  visited: [],
  money: 30,
  fuel: 25,
  updateHud: function(){
    document.getElementById("money-box").innerHTML = "Credits: " + player.money.toString();
    document.getElementById("gas-box").innerHTML = "Fuel: " + player.fuel.toString();
    document.getElementById("planets-box").innerHTML = "Planets left: " + (planetCount-player.visited.length).toString();
  }, 
  checkPlanet: function(){
    for(i=0; i<planetCount*2; i+=2){
      if(cameraTranslation[0].toFixed(2)==-planets.centers[i].toFixed(2) && cameraTranslation[1].toFixed(2)==-planets.centers[i+1].toFixed(2)){
        player.planet=i/2;
        player.fuel+=planets.fuel[player.planet];
        if(!player.visited.includes(player.planet)) player.visited.push(player.planet);
        return;
      }
    }
  }
}



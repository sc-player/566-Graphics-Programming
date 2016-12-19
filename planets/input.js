/**
 * Philip Strachan
 * input.js
 * Input handler.
 */

//What keys are we pressing?
var currentlyPressedKeys = {};
var deltaTime=0.0;
var lastFrame=0.0;

/**
 * function updateTime
 * updates global deltaTime variable.
 */
function updateTime(){
  var current = Date.now();
  deltaTime=current-lastFrame;
  lastFrame=current;
}

/**
 * function handleKeyDown
 * Key Down event handler.
 */
function handleKeyDown(event, ship){
  if(!onPlanet) handleKeyDownSpace(event, ship);
  else handleKeyDownSurface(event);
  currentlyPressedKeys[event.keyCode]=true;
}

/**
 * function handleKeyDownSurface
 * Turns on and off lights.
 */
function handleKeyDownSurface(event){
  if(event.keyCode === 65) {
    env.enabled[0][0] = !env.enabled[0][0];
  } else if(event.keyCode === 83)
    env.enabled[1][0] = !env.enabled[1][0];
};

/**
 * function handleKeyDownSpace
 *
 * Update position of player and subtract fuel.
 */
function handleKeyDownSpace(event, ship){
  if(currentlyPressedKeys[event.keyCode]==true) return;
  switch(event.keyCode){
    case 37:  //left arrow
      if(cameraTranslation[0]<galaxySize/2 && player.fuel>0){
        cameraTranslation[0]+=tileSize;
        ship.shaderVars.u_Model.data.setRotate(0, 0, 0, 1);
        player.fuel--;
        player.checkPlanet();
      }
      break;
    case 38:  //up arrow
      if(cameraTranslation[1]>-galaxySize/2 && player.fuel>0){
        cameraTranslation[1]-=tileSize;
        ship.shaderVars.u_Model.data.setRotate(-90, 0, 0, 1);
        player.fuel--;
        player.checkPlanet();
      }
      break;
    case 39:  //right arrow
      if(cameraTranslation[0]>-galaxySize/2 && player.fuel>0){
        cameraTranslation[0]-=tileSize;
        ship.shaderVars.u_Model.data.setRotate(180, 0, 0, 1);
        ship.shaderVars.u_Model.data.rotate(180, 1, 0, 0);
        player.fuel--;
        player.checkPlanet();
      }
      break;
    case 40:  //down arrow
      if(cameraTranslation[1]<galaxySize/2 && player.fuel>0){
        cameraTranslation[1]+=tileSize;
        ship.shaderVars.u_Model.data.setRotate(90, 0, 0, 1);
        player.fuel--;
        player.checkPlanet();
      }
      break;
    default:
      break;
  }
  planets.shaderVars.u_Model.data.elements[12]=cameraTranslation[0];
  planets.shaderVars.u_Model.data.elements[13]=cameraTranslation[1];
  drawArraySpace[0].shaderVars.u_Model.data.elements[12]=cameraTranslation[0]; 
  drawArraySpace[0].shaderVars.u_Model.data.elements[13]=cameraTranslation[1];
}

/**
 * Called when a key is released. Disables boolean corresponding to the key
 * that was released.
 */
function handleKeyUp(event){
  currentlyPressedKeys[event.keyCode] = false;
}

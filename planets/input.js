//What keys are we pressing?
var currentlyPressedKeys = {};
var deltaTime=0.0;
var lastFrame=0.0;

function updateTime(){
  var current = Date.now();
  deltaTime=current-lastFrame;
  lastFrame=current;
}

function handleKeyDown(event, ship){
  if(!onPlanet) handleKeyDownSpace(event, ship);
  currentlyPressedKeys[event.keyCode]=true;
}

/**
 * function handleKeyDown
 *
 * Called on key press. Enables the variable corresponding to the keycode of
 * the key that was pressed.  If it is an arrow key, change camera position and
 * update the player.
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

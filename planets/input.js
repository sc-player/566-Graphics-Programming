//What keys are we pressing?
var currentlyPressedKeys = {};

/**
 * function handleKeyDown
 *
 * Called on key press. Enables the variable corresponding to the keycode of
 * the key that was pressed.  If it is an arrow key, change camera position and
 * update the player.
 */
function handleKeyDown(event){
  if(currentlyPressedKeys[event.keyCode]==true) return;
  shouldDraw=true;
  currentlyPressedKeys[event.keyCode] = true;
  switch(event.keyCode){
    case 37:  //left arrow
      if(cameraTranslation[0]<galaxySize/2 && player.fuel>0){
        cameraTranslation[0]+=tileSize;
        ship.modelMatrix.setRotate(0, 0, 0, 1);
        player.fuel--;
        player.checkPlanet();
      }
      break;
    case 38:  //up arrow
      if(cameraTranslation[1]>-galaxySize/2 && player.fuel>0){
        cameraTranslation[1]-=tileSize;
        ship.modelMatrix.setRotate(90, 0, 0, 1);
        player.fuel--;
        player.checkPlanet();
      }
      break;
    case 39:  //right arrow
      if(cameraTranslation[0]>-galaxySize/2 && player.fuel>0){
        cameraTranslation[0]-=tileSize;
        ship.modelMatrix.setRotate(180, 0, 0, 1);
        ship.modelMatrix.rotate(180, 1, 0, 0);
        player.fuel--;
        player.checkPlanet();
      }
      break;
    case 40:  //down arrow
      if(cameraTranslation[1]<galaxySize/2 && player.fuel>0){
        cameraTranslation[1]+=tileSize;
        ship.modelMatrix.setRotate(-90, 0, 0, 1);
        player.fuel--;
        player.checkPlanet();
      }
      break;
    default:
      break;
  }
}

/**
 * Called when a key is released. Disables boolean corresponding to the key
 * that was released.
 */
function handleKeyUp(event){
  currentlyPressedKeys[event.keyCode] = false;
}

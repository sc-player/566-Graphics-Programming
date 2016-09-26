//What keys are we pressing?
var currentlyPressedKeys = {};

/**
 * Called on key press. Enables the variable corresponding to the keycode of
 * the key that was pressed.  If it is an arrow key, change camera position.
 */
function handleKeyDown(event){
  if(currentlyPressedKeys[event.keyCode]==true) return;
  currentlyPressedKeys[event.keyCode] = true;
  switch(event.keyCode){
    case 37:  //left arrow
      if(cameraTranslation[0]<galaxySize/2)
        cameraTranslation[0]+=tileSize;
      break;
    case 38:  //up arrow
      if(cameraTranslation[1]>-galaxySize/2)
      cameraTranslation[1]-=tileSize;
      break;
    case 39:  //right arrow
      if(cameraTranslation[0]>-galaxySize/2)
      cameraTranslation[0]-=tileSize;
      break;
    case 40:  //down arrow
      if(cameraTranslation[1]<galaxySize/2)
      cameraTranslation[1]+=tileSize;
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

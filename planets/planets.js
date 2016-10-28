/**
 * Philip Strachan
 * planets.js
 * Creates a space scene that you can move around in a 2d space. 
 */

//GL global references and config.
var cameraTranslation = [0,0,0,0];
var shouldDraw=true;
var drawArraySpace = [
  new Stars(), 
  new Grid(), 
  new Ship(), 
  new Planets(), 
  new Shooter()
];

var drawArraySurface = [
  new Ground(drawArraySpace[3])
];

var drawSpaceLen = drawArraySpace.length;
var drawSurfLen = drawArraySurface.length;

var onPlanet=true;

var player=new Player(drawArraySpace[3]);

/* function initGL
 *
 * Creates shaders, sets event handlers, and initializes objects.
 */
function initGL(){
  document.onkeydown = function(event){handleKeyDown(event, drawArraySpace[2]);};
  document.onkeyup = handleKeyUp;
  function ResizeWindow(){
    canvas.height=window.innerHeight;
    canvas.width=window.innerHeight*1.2;
    gl.viewport(0,0,canvas.width, canvas.height);
  };
  window.onresize = ResizeWindow;
  ResizeWindow();
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.enable(gl.BLEND);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
}

/**
 * Will return false once everything is loaded.
 */
function checkForLoaded(){
  drawArraySpace.forEach(function(val){
    if(!val["loaded"]) return true;
  });
  return false;
}

/**
 * Clears the background and draws each object.
 */
function drawScene(){
  gl.clear(gl.COLOR_BUFFER_BIT);
  if(onPlanet) for(var i=0; i<drawSurfLen; ++i){
    gl.useProgram(drawArraySurface[i]["program"]);
    drawArraySurface[i]["draw"]();
  }
  else for(var i=0; i<drawSpaceLen; ++i){
    gl.useProgram(drawArraySpace[i]["program"]);
    drawArraySpace[i]["draw"]();
  }
}

/**
 * Updates all animated parameters.
 */
function animate(){
  if(onPlanet) for(var i=0; i<drawSurfLen; ++i){
    if(drawArraySurface[i].__proto__.hasOwnProperty('animate'))
      drawArraySurface[i]['animate']();  
  }
  else for(var i=0; i<drawSpaceLen; ++i){
    if(drawArraySpace[i].__proto__.hasOwnProperty('animate'))
      drawArraySpace[i]['animate']();  
  }
}

/**
 * Main loop
 */
function tick(){
  requestAnimationFrame(tick);
  player.updateHud();
  animate();
  drawScene();
}

/**
 *  Entry point.
 *   Initialization
 *   Begin loop
 */
function main(){
  initGL(); 
  while(checkForLoaded()){}
  tick();
}

/**
 * Philip Strachan
 * planets.js
 * Creates a space scene that you can move around in a 2d space. 
 */

//GL global references and config.
var cameraTranslation = [0,0,0,0];
var shouldDraw=true;
var drawArray = [
  new Stars(), 
  new Grid(), 
  new Ship(), 
  new Planets(), 
  new Shooter()
];
var player=new Player(drawArray[3]);

/* function initGL
 *
 * Creates shaders, sets event handlers, and initializes objects.
 */
function initGL(){
  document.onkeydown = function(event){handleKeyDown(event, drawArray[2]);};
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
  drawArray.forEach(function(val){
    val["program"]=createShaderProgram(val["vshader"], val["fshader"]);
    gl.bindAttribLocation(val["program"], 0, 'a_Position');
    val["init"]();
  });
}

/**
 * Will return false once everything is loaded.
 */
function checkForLoaded(){
  drawArray.forEach(function(val){
    if(!val["loaded"]) return true;
  });
  return false;
}

/**
 * Clears the background and draws each object.
 */
function drawScene(){
  gl.clear(gl.COLOR_BUFFER_BIT);
  drawArray.forEach(function(val){
    gl.useProgram(val["program"]);
    val["draw"]();
  });
}

/**
 * Updates all animated parameters.
 */
function animate(){
  drawArray.forEach(function(val){
    if(val.hasOwnProperty('animate')) val['animate'];
  });
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

/**
 * Philip Strachan
 * planets.js
 * Creates a space scene that you can move around in a 2d space. 
 */

//GL global references and config.
var gl;
var canvas;
var cameraTranslation = [0,0,0,0];
var shouldDraw=true;
var drawArray = [stars, grid, ship, planets, shooter];

/* function initGL
 *
 * Sets the global context reference, and sets event handlers.
 */
function initGL(){
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
  function ResizeWindow(){
    canvas.height=window.innerHeight;
    canvas.width=window.innerHeight*1.2;
    gl.viewport(0,0,canvas.width, canvas.height);
  };
  window.onresize = ResizeWindow;
  ResizeWindow();
  player.init();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  drawArray.forEach(function(val){
    val["program"]=createShaderProgram(val["vshader"], val["fshader"]);
    gl.bindAttribLocation(val["program"], 0, 'a_Position');
    val["init"]();
  });
}

function checkForLoaded(){
  drawArray.forEach(function(val){
    if(!val["loaded"]) return true;
  });
  return false;
}

/**
 * Gets camera location and draws the scene.
 */
function drawScene(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  drawArray.forEach(function(val){
    gl.useProgram(val["program"]);
    if(val["blend"]){
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.enable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
    } else {
      gl.disable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST);
    }
    val["draw"]();
  });
}

/**
 * Updates all animated parameters.
 */
function animate(){
  var shootRoll=Math.random()*1000; 
  if(shootRoll>shootChance && shooter.speed<=0){
    shouldDraw=true;
    shooter.color=shooterColor;
    shooter.speed=Math.random()/15+.09;
    shooter.size=Math.random()*3;
    var length=Math.random()*2+1;
    shooter.angle=Math.random()*30-15;
    shooter.modelMatrix.setTranslate(0, -1, 0);
    shooter.modelMatrix.rotate(shooter.angle, 0, 0, 1); 
    shooter.modelMatrix.scale(1, length, 1);
    shooter.modelMatrix.translate(Math.random()*2-1, 1, 0);
  } else if(shooter.speed>0){
    if(shooter.modelMatrix.elements[13]+shooter.modelMatrix.elements[5]<=-1){
      shooter.color=[0,0,0,1];
      shooter.speed=0;
      shooter.size=0;
      shooter.angle=0;
      shooter.modelMatrix.setIdentity();
    } else{
      shouldDraw=true;
      shooter.modelMatrix.translate(shooter.speed*Math.sin(shooter.angle*(Math.PI/180)), -shooter.speed*Math.cos(shooter.angle*(Math.PI/180)), 0);
    }
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

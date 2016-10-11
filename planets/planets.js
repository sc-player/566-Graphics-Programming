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
var drawArray = [stars, grid, planets, shooter];

/* function initGL
 *
 * Sets the global context reference, and sets event handlers.
 */
function initGL(){
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
  function ResizeWindow(){
    canvas.height=window.innerHeight;
    canvas.width=window.innerHeight;
    gl.viewport(0,0,canvas.width, canvas.width);
  };
  window.onresize = ResizeWindow;
  ResizeWindow();
  planets.centers=[];
  for(i=0; i<planetCount*74; i+=74){
    planets.centers.push(planets.points[i]);
    planets.centers.push(planets.points[i+1]);
  }
  drawArray.forEach(function(val){
    val["program"]=createShaderProgram(val["vshader"], val["fshader"]);
    gl.bindAttribLocation(val["program"], 0, 'a_Position');
    val["init"]();
  });
}

/**
 * Gets camera location and draws the scene.
 */
function drawScene(){
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  drawArray.forEach(function(val){
    gl.useProgram(val["program"]);
    val["draw"]();
  });
  shouldDraw=false;
}

/**
 * Updates all animated parameters.
 */
function animate(){
  var shootRoll=Math.random()*1000; 
  if(shootRoll>shootChance && shooter.speed<=0){
    shouldDraw=true;
    shooter.color=shooterColor;
    shooter.speed=Math.random()/10+.1;
    shooter.size=Math.random()*3;
    var length=Math.random()*50+50;
    shooter.angle=Math.random()*30-15;
    shooter.modelMatrix.setScale(1, length, 1);
    shooter.modelMatrix.setRotate(shooter.angle, 0, 0, 1);
    shooter.modelMatrix.setTranslate(Math.random()*2-1, 1, 0);
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
 *   Set up Shaders
 *   Set up Data
 *   Create and set up buffers
 *   Begin loop
 */
function main(){
  initGL(); 
  tick();
}

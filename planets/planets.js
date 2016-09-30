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
var drawArray = [stars, grid, ship, shooter];

/* function initGL
 *
 * Sets the global context reference, and sets event handlers.
 */
function initGL(){
  canvas=document.getElementById('webgl');
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
  function ResizeWindow(){
    canvas.height=window.innerHeight;
    canvas.width=window.innerHeight;
  };
  window.onresize = ResizeWindow;
  ResizeWindow();
  gl=getWebGLContext(canvas);
  if(!gl){
    console.log('Failed to get rendering context for WebGL');
    return;
  }
}

/* function DoShaders
 *
 * Initialize shaders.
 */
function initShaders(){
  stars.program = createShaderProgram("vstar.glsl", "fstar.glsl");
  gl.bindAttribLocation(stars.program, 0, 'a_Position');
  if(!stars.program){
    console.log('Failed to initialize shaders.');
    return;
  }

  //Get attribute locations
  stars.program.a_Position = gl.getAttribLocation(stars.program, 'a_Position');
  stars.program.a_Size = gl.getAttribLocation(stars.program, 'a_Size');
  stars.program.a_Color = gl.getAttribLocation(stars.program, 'a_Color');
  if(stars.program.a_Position<0 || stars.program.a_Size<0 || stars.program.a_Color<0){
    console.log('Failed to get the storage location of attributes');
    return;
  }

  //Get uniform locations.
  stars.program.u_Translation = gl.getUniformLocation(stars.program, "u_Translation");
  if(stars.program.u_Translation < 0){ 
    console.log("Translation location not found.");
    return;
  }

  grid.program = createShaderProgram("vgrid.glsl", "fgrid.glsl");
  gl.bindAttribLocation(grid.program, 0, 'a_Position');
  if(!grid.program){
    console.log('Failed to initialize shaders.');
    return;
  }

  //Get attribute locations
  grid.program.a_Position = gl.getAttribLocation(grid.program, 'a_Position');
  if(grid.program.a_Position<0){
    console.log('Failed to get the storage location of attributes');
    return;
  }

  //Get uniform locations.
  grid.program.u_Color = gl.getUniformLocation(grid.program, 'u_Color');
  grid.program.u_Translation = gl.getUniformLocation(grid.program, "u_Translation");
  if(grid.program.u_Color < 0 || grid.program.u_Translation < 0){ 
    console.log("Translation location not found.");
    return;
  }
  
  ship.program = createShaderProgram("vship.glsl", "fship.glsl");
  gl.bindAttribLocation(grid.program, 0, 'a_Position');
  if(!ship.program){
    console.log('Failed to initialize shaders.');
    return;
  }

  //Get attribute locations
  ship.program.a_Position = gl.getAttribLocation(ship.program, 'a_Position');
  if(ship.program.a_Position<0){
    console.log('Failed to get the storage location of attributes');
    return;
  }

  //Get uniform locations.
  ship.program.u_Color = gl.getUniformLocation(ship.program, 'u_Color');
  ship.program.u_Model = gl.getUniformLocation(ship.program, 'u_Model');
  if(ship.program.u_Color < 0 || ship.program.u_Model < 0){ 
    console.log("Translation location not found.");
    return;
  }

  shooter.program = createShaderProgram("vshoot.glsl", "fshoot.glsl");
  gl.bindAttribLocation(shooter.program, 0, 'a_Position');
  if(!shooter.program){
    console.log('Failed to initialize shaders.');
    return;
  }

  //Get attribute locations
  shooter.program.a_Position = gl.getAttribLocation(shooter.program, 'a_Position');
  if(shooter.program.a_Position<0){
    console.log('Failed to get the storage location of attributes');
    return;
  }

  //Get uniform locations.
  shooter.program.u_Color = gl.getUniformLocation(shooter.program, 'u_Color');
  shooter.program.u_Model = gl.getUniformLocation(shooter.program, 'u_Model');
  if(shooter.program.u_Color < 0 || shooter.program.u_Model < 0){ 
    console.log("Translation location not found.");
    return;
  }

}

/* function initBuffers
 *
 * Sets up star absolute position buffer, size buffer, and color buffer.
 */
function initBuffers(){

  //Create buffers
  grid.vertexBuffer=createBuffer();

  ship.vertexBuffer=createBuffer();
  ship.windowBuffer=createBuffer();
  ship.thrustBuffer=createBuffer();
  ship.flameBuffer=createBuffer();

  stars.vertexBuffer = createBuffer();
  stars.colorBuffer = createBuffer();
  stars.sizeBuffer = createBuffer();
  
  shooter.vertexBuffer=createBuffer();

  //GRID
  //Set up position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, grid.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, grid.points, gl.STATIC_DRAW);

  //SHIP
  //Set up position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, ship.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, ship.points, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, ship.windowBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, ship.wind, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, ship.thrustBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, ship.thruster, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, ship.flameBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, ship.flame, gl.STATIC_DRAW);

  //STARS
  //Set up position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, stars.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, stars.points, gl.STATIC_DRAW);

  //Set up size buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, stars.sizeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, stars.sizes, gl.STATIC_DRAW);

  //Set up color buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, stars.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, stars.colors, gl.STATIC_DRAW);
  
  //SHOOTING STAR
  //Set up position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, shooter.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, shooter.points, gl.STREAM_DRAW);
}

/**
 * Gets camera location and draws the scene.
 */
function drawScene(){
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  drawArray.forEach(function(val){
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
  initShaders();
  initBuffers();
  tick();
}

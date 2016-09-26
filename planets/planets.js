/**
 * Philip Strachan
 * planets.js
 * Creates a space scene that you can move around in a 2d space. 
 */

//GL global references.
var gl;
var canvas;
var shaderProgram = {};
var cameraTranslation = [0,0,0,0];

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
function DoShaders(){
  var VSHADER_STAR = loadExternalShader("vstar.glsl");
  var FSHADER_STAR = loadExternalShader("fstar.glsl");
  if(!VSHADER_STAR || !FSHADER_STAR){
    console.log("Star shaders cant be found");
    return;
  }
  shaderProgram.program=createProgram(gl, VSHADER_STAR, FSHADER_STAR);
  gl.bindAttribLocation(shaderProgram.program, 0, 'a_Position');
  if(!shaderProgram.program){
    console.log('Failed to initialize shaders.');
    return;
  }
  gl.useProgram(shaderProgram.program);
}

/* function initBuffers
 *
 * Sets up star absolute position buffer, size buffer, and color buffer.
 */
function initBuffers(){

  //Create buffers
  grid.vertexBuffer=gl.createBuffer();
  if(!grid.vertexBuffer){
    console.log('Failed to create the buffer objects for grid');
    return;
  }

  ship.vertexBuffer=gl.createBuffer();
  ship.windowBuffer=gl.createBuffer();
  ship.thrustBuffer=gl.createBuffer();
  ship.flameBuffer=gl.createBuffer();
  if(!ship.vertexBuffer || !ship.windowBuffer || !ship.thrustBuffer || !ship.flameBuffer){
    console.log('Failed to create the buffer objects for ship');
    return;
  }

  stars.vertexBuffer = gl.createBuffer();
  stars.colorBuffer = gl.createBuffer();
  stars.sizeBuffer = gl.createBuffer();
  if(!stars.vertexBuffer || !stars.colorBuffer || !stars.sizeBuffer){
    console.log('Failed to create the buffer objects for stars');
    return;
  }
  
  shootBuffer.vertexBuffer=gl.createBuffer();
  if(!shootBuffer.vertexBuffer){
    console.log('Failed to create the buffer objects for shooting star');
    return;
  }
  
  //Get attribute locations
  shaderProgram.a_Position = gl.getAttribLocation(shaderProgram.program, 'a_Position');
  shaderProgram.a_Size = gl.getAttribLocation(shaderProgram.program, 'a_Size');
  shaderProgram.a_Color = gl.getAttribLocation(shaderProgram.program, 'a_Color');
  if(shaderProgram.a_Position<0 || shaderProgram.a_Size<0 || shaderProgram.a_Color<0){
    console.log('Failed to get the storage location of attributes');
    return;
  }

  //Get uniform locations.
  shaderProgram.u_Translation = gl.getUniformLocation(shaderProgram.program, "u_Translation");
  shaderProgram.u_Color = gl.getUniformLocation(shaderProgram.program, "uColor");
  shaderProgram.uni = gl.getUniformLocation(shaderProgram.program, "uni");
  if(shaderProgram.u_Translation < 0 || shaderProgram.u_Color < 0 || shaderProgram.uni < 0){
    console.log("Translation location not found.");
    return;
  }

  //GRID
  //Set up position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, grid.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, grid.points, gl.STATIC_DRAW);

  //SHIP
  //Set up position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, ship.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ship.points), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, ship.windowBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ship.wind), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, ship.thrustBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ship.thruster), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, ship.flameBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ship.flame), gl.STATIC_DRAW);

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
  gl.bindBuffer(gl.ARRAY_BUFFER, shootBuffer.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shooter.getPoints()), gl.STREAM_DRAW);
}

/**
 * Gets camera location and draws the scene.
 */
function drawScene(){
  setUniform(shaderProgram.u_Translation, cameraTranslation, true);
  setUniform(shaderProgram.uni, 1, false);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  drawGrid();
  setUniform(shaderProgram.uni, 0, false);
  drawStars();
  setUniform(shaderProgram.uni, 1, false);
  setUniform(shaderProgram.u_Translation, [0,0,0,0], true);
  drawShip();
  drawShoot();
}

/**
 * Draw grid. 
 */
function drawGrid(){
  initAttribute(shaderProgram.a_Position, grid.vertexBuffer, 2, gl.FLOAT);
  setUniform(shaderProgram.u_Color, grid.color, true);
  gl.vertexAttrib1f(shaderProgram.a_Size, grid.size);
  gl.drawArrays(gl.LINES, 0, grid.points.length/2);
  gl.disableVertexAttribArray(shaderProgram.a_Position);
}

/**
 * Draw Stars 
 */
function drawStars(){ 
  initAttribute(shaderProgram.a_Position, stars.vertexBuffer, 2, gl.FLOAT);
  initAttribute(shaderProgram.a_Color, stars.colorBuffer, 3, gl.FLOAT);
  initAttribute(shaderProgram.a_Size, stars.sizeBuffer, 1, gl.FLOAT);
  gl.drawArrays(gl.POINTS, 0, starCount);
  gl.disableVertexAttribArray(shaderProgram.a_Position);
  gl.disableVertexAttribArray(shaderProgram.a_Color);
  gl.disableVertexAttribArray(shaderProgram.a_Size);
}

/**
 * Draw Ship 
 */
function drawShip(){
  initAttribute(shaderProgram.a_Position, ship.windowBuffer, 2, gl.FLOAT);
  setUniform(shaderProgram.u_Color, ship.windowColor, true);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 69);
  gl.disableVertexAttribArray(shaderProgram.a_Position);
  initAttribute(shaderProgram.a_Position, ship.vertexBuffer, 2, gl.FLOAT);
  setUniform(shaderProgram.u_Color, ship.color, true);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.disableVertexAttribArray(shaderProgram.a_Position);
  initAttribute(shaderProgram.a_Position, ship.thrustBuffer, 2, gl.FLOAT);
  setUniform(shaderProgram.u_Color, ship.thrustColor, true);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5);
  gl.disableVertexAttribArray(shaderProgram.a_Position);
  initAttribute(shaderProgram.a_Position, ship.flameBuffer, 2, gl.FLOAT);
  setUniform(shaderProgram.u_Color, ship.flameColor, true);
  for(i=0; i<numFlames; ++i){
    gl.drawArrays(gl.LINE_LOOP, flameDegrees*i, flameDegrees);
  }
  gl.disableVertexAttribArray(shaderProgram.a_Position);
}

/**
 * Draw shooting star. 
 */
function drawShoot(){ 
  gl.bindBuffer(gl.ARRAY_BUFFER, shootBuffer.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shooter.getPoints()), gl.STREAM_DRAW);
  initAttribute(shaderProgram.a_Position, shootBuffer.vertexBuffer, 2, gl.FLOAT);
  setUniform(shaderProgram.u_Color, shooter.color, true);
  gl.vertexAttrib1f(shaderProgram.a_Size, 1);
  gl.drawArrays(gl.LINES, 0, 2);
  gl.disableVertexAttribArray(shootBuffer.a_Position);
}

/**
 * Updates all animated parameters.
 */
function animate(){
  var shootRoll=Math.random()*1000; 
  if(shootRoll>shootChance && shooter.length<=0){
    shooter.x=Math.random()*2-1;    
    shooter.y=1;
    shooter.color=shooterColor;
    shooter.speed=Math.random()/10+.1;
    shooter.size=Math.random()*3;
    shooter.length=Math.random()/2+.02;
    shooter.angle=Math.random()*30-15;
  } else if(shooter.length>0){
    if(shooter.y+length<=-1){
      shooter.x=galaxySize;
      shooter.y=galaxySize;
      color=[0,0,0,0];
      shooter.length=0;
    } else{
      shooter.x+=shooter.speed*Math.sin(shooter.angle*(Math.PI/180));
      shooter.y-=shooter.speed*Math.cos(shooter.angle*(Math.PI/180));
    }
  }
}

/**
 * Main loop
 */
function tick(){
  requestAnimationFrame(tick);
  drawScene();
  animate();
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
  DoShaders();
  initBuffers();
  tick();
}

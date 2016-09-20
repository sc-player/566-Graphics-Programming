/* Philip Strachan
 * planets.js
 * Creates a background of stars that you can move around in a 2d space.
 */

//GL context global reference.
var gl;
var canvas;
var shaderProgram = {};

//Galazy configuration
var galaxySize = 10;
var tileSize = .2;
var galaxyTileSize=galaxySize/tileSize;

//Ship configuration
var shipLength = tileSize*2/3;
var shipWidth = tileSize/2;
var windowRadius = tileSize/8;
var thrustShortWidth = shipWidth/2;
var thrustLongWidth = shipWidth*3/4;
var thrustLength = shipLength/6;
var flameOffset = shipLength/2;
var flameRx = shipLength/12;
var flameRy = shipWidth/4;
var numFlames = 3;
var flameDecay = shipWidth/8;
var flameDegrees = 36;

var shipColor = [0, 1, 0.5, 1];
var windowColor = [0,0,1,1];
var thrustColor = [.5,.5,.5,1];
var flameColor = [1, .2, .2, 1];

//Star configuration
var starCount = 3000;
var starSize = 4;
var starSizeOffset = 1;
var starRedDivisor = 5;
var starRedOffset = .8;
var starBlueDivisor = 3;
var starBlueOffset = .3;
var starGreenDivisor = 8;
var starGreenOffset  = .8;

//Shooting star configuration
var shootChance=980;
var shooterColor = [1,1,1,1];

//System configuration
var systemCount = 10;

//Grid data stored here.
var grid={
  size: 1,
  color: [1,1,1,1],
  generatePoints: function(){
    var res=[];
    for(i=-galaxySize/2; i<=galaxySize/2; i+=tileSize*2){
      res.push([i, -galaxySize/2, i, galaxySize/2, i+tileSize, galaxySize/2, i+tileSize, -galaxySize/2])
    }
    if(galaxyTileSize%2==0)res.push([galaxySize/2, -galaxySize/2, galaxySize/2, galaxySize/2]);
    for(i=galaxySize/2; i>=-galaxySize/2; i-=tileSize*2){
      res.push([galaxySize/2, i, -galaxySize/2, i, -galaxySize/2, i-tileSize, galaxySize/2, i-tileSize]);
    }
    if(galaxyTileSize%2==0)res.push([galaxySize/2, -galaxySize/2, -galaxySize/2, -galaxySize/2]);
    return [].concat.apply([], res);
  },
};

//Ship data stored here.
var ship = {
  flame: [],
  thruster: [shipLength/2+thrustLength, -shipWidth/5, shipLength/2, -shipWidth/8, shipLength/2+thrustLength, -shipWidth/3+thrustLongWidth/2, shipLength/2, -shipWidth/5+thrustShortWidth, shipLength/2+thrustLength, -shipWidth/3+thrustLongWidth],
  wind: [shipLength/3.5, shipWidth/3], 
  points: [-shipLength/2, 0, shipLength/2, -shipWidth/4, shipLength/2, shipWidth/2],
  flameColor: flameColor,
  thrustColor: thrustColor,
  windowColor: windowColor,
  color: shipColor
};

//Individual star data is stored here. It is randomly generated.
var stars = [];
var starPoints;
var starColors;
var starSizes;
var starBuffer = {};

var cameraTranslation = [0,0,0,0]; //Incremented and decremented on arrow keys.

//Shooting star effect data is stored here.
shooter={
    x:galaxySize, 
    y:galaxySize, 
    color:[1,1,1,1],
    length:0,
    getPoints: function(){
      if(!this.length) return [1.1, 1.1, 1.1, 1.1];
      return [
	this.x, 
	this.y, 
	this.x-this.length*Math.sin(this.angle*(Math.PI/180)), 
	this.y+this.length*Math.cos(this.angle*(Math.PI/180))
      ];
    }
  };
var shootBuffer = {};

//Solar system data stored here.
var systems = [];

//Shader programs.

var VSHADER_STAR = 

  //Inputs
  'attribute vec4 a_Position;\n' +   //Absolute Position
  'attribute float a_Size;\n' +      //Size
  'attribute vec4 a_Color;\n' +      //Color
  'uniform vec4 u_Translation;\n' +  //Camera offset

  //Outputs
  'varying vec4 vColor;\n' +       

  //Main: Sets position and size, and sets the output color.
  'void main() {\n' +
  '  gl_Position = a_Position + u_Translation;\n' +
  '  gl_PointSize = a_Size;\n' +
  '  vColor = a_Color;\n' +
  '}\n';

var FSHADER_STAR =
  'precision mediump float;\n' +
  'varying vec4 vColor;\n' +       //Color
  'uniform vec4 uColor;\n' +
  'uniform int uni;\n' +

  //Main: Sets color of each star.
  'void main(){\n' +
      'if(uni>0) gl_FragColor = uColor;\n' +
      'else gl_FragColor = vColor;\n' +
  '}\n';

//function initGL
//
//Sets the global context reference, and sets event handlers.
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

//function DoShaders
//
//Initialize shaders.
function DoShaders(){
  shaderProgram.program=createProgram(gl, VSHADER_STAR, FSHADER_STAR);
  gl.bindAttribLocation(shaderProgram.program, 0, 'a_Position');
  if(!shaderProgram.program){
    console.log('Failed to initialize shaders.');
    return;
  }
  gl.useProgram(shaderProgram.program);
}

//function SetUpData
//
//Randomly generate starCount stars.
//Create Float32Arrays in order to send data to the GPU.
function SetUpData(){

  //Set up grid data.
  grid.points=new Float32Array(grid.generatePoints());

  //Generate ship windshield.
  for(i=0; i<68; ++i){
    ship.wind.push(ship.wind[0]+Math.cos(i)*windowRadius);
    ship.wind.push(ship.wind[1]+Math.sin(i)*windowRadius);
  }

  //Generate ship flame.
  for(i=0; i<numFlames; ++i){
    var startx = shipLength*3/4+thrustLength+flameOffset*i;
    var starty = shipWidth/8;
    for(j=0; j<flameDegrees; ++j){
      ship.flame.push(startx+flameRx*Math.cos(j*180/Math.PI));
      ship.flame.push(starty+(flameRy+flameDecay*i)*Math.sin(j*180/Math.PI));
    }
  }

  //Randomly generate stars.
  for(i=0; i<starCount; i++){
    stars.push({
      x: Math.random()*galaxySize-galaxySize/2, 
      y: Math.random()*galaxySize-galaxySize/2, 
      size: Math.random()*starSize+starSizeOffset, 
      red: Math.random()/starRedDivisor+starRedOffset, 
      green: Math.random()/starGreenDivisor+starGreenOffset, 
      blue: Math.random()/starBlueDivisor+starBlueOffset
    });
  }

  //Read data into arrays in order to send to GPU.
  starPoints = new Float32Array([].concat.apply([], stars.map(function(value){
      return [value.x, value.y];
  })));
  starSizes = new Float32Array(stars.map(function(value){
      return value.size;
  }));
  starColors = new Float32Array([].concat.apply([], stars.map(function(value){
      return [value.red, value.green, value.blue];
  })));
  
  //Generate solar system data.
  for(i=0; i<systemCount; ++i){
    systems.push({
      x: Math.round((Math.random()*galaxySize-galaxySize/2)/0.05)*0.05
    });
  }
}

//function initBuffers
//
//Sets up star absolute position buffer, size buffer, and color buffer.
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

  starBuffer.vertexBuffer = gl.createBuffer();
  starBuffer.sizeBuffer = gl.createBuffer();
  starBuffer.colorBuffer = gl.createBuffer();
  if(!starBuffer.vertexBuffer || !starBuffer.sizeBuffer || !starBuffer.colorBuffer){
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
  gl.bindBuffer(gl.ARRAY_BUFFER, starBuffer.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, starPoints, gl.STATIC_DRAW);

  //Set up size buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, starBuffer.sizeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, starSizes, gl.STATIC_DRAW);

  //Set up color buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, starBuffer.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, starColors, gl.STATIC_DRAW);
  
  //SHOOTING STAR
  //Set up position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, shootBuffer.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shooter.getPoints()), gl.STREAM_DRAW);
}

//function drawScene
//
//Gets camera location, and draws the stars according to their relative 
//positions.
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

function drawGrid(){
  initAttribute(shaderProgram.a_Position, grid.vertexBuffer, 2, gl.FLOAT);
  setUniform(shaderProgram.u_Color, grid.color, true);
  gl.vertexAttrib1f(shaderProgram.a_Size, grid.size);
  gl.drawArrays(gl.LINE_STRIP, 0, grid.points.length/2);
  gl.disableVertexAttribArray(shaderProgram.a_Position);
}

function drawStars(){ 
  initAttribute(shaderProgram.a_Position, starBuffer.vertexBuffer, 2, gl.FLOAT);
  initAttribute(shaderProgram.a_Color, starBuffer.colorBuffer, 3, gl.FLOAT);
  initAttribute(shaderProgram.a_Size, starBuffer.sizeBuffer, 1, gl.FLOAT);
  gl.drawArrays(gl.POINTS, 0, starCount);
  gl.disableVertexAttribArray(shaderProgram.a_Position);
  gl.disableVertexAttribArray(shaderProgram.a_Color);
  gl.disableVertexAttribArray(shaderProgram.a_Size);
}

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

function drawShoot(){ 
  gl.bindBuffer(gl.ARRAY_BUFFER, shootBuffer.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shooter.getPoints()), gl.STREAM_DRAW);
  initAttribute(shaderProgram.a_Position, shootBuffer.vertexBuffer, 2, gl.FLOAT);
  setUniform(shaderProgram.u_Color, shooter.color, true);
  gl.vertexAttrib1f(shaderProgram.a_Size, 1);
  gl.drawArrays(gl.LINES, 0, 2);
  gl.disableVertexAttribArray(shootBuffer.a_Position);
}

//funciton animate
//
//Updates all animated parameters.
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

//function tick
//
//Main loop
function tick(){
  requestAnimationFrame(tick);
  drawScene();
  animate();
}

//function main
//
//Entry point.
//  Initialization
//  Set up Shaders
//  Set up Data
//  Create and set up buffers
//  Begin loop
function main(){
  initGL(); 
  DoShaders();
  SetUpData();
  initBuffers();
  tick();
}

//What keys are we pressing?
var currentlyPressedKeys = {};

//function handleKeyDown
//
//Called on key press. Enables the variable corresponding to the keycode of
//the key that was pressed.  If it is an arrow key, change camera position.
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

//function handleKeyUp
//
//Called when a key is released. Disables boolean corresponding to the key
//that was released.
function handleKeyUp(event){
  currentlyPressedKeys[event.keyCode] = false;
}

function initAttribute(att, buffer, size, type){
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(att, size, type, false, 0, 0);
  gl.enableVertexAttribArray(att);
}

var logged=false;
function setUniform(uniform, arr, flo){
  var res=flatten([arr]);
  gl["uniform"+res.length+((flo) ? "f" : "i")+"v"](uniform, res); 
}

function flatten(multiDArray){
  const flat = [].concat.apply([], multiDArray);
  return flat.some(Array.isArray) ? flatten(flat) : flat;
}

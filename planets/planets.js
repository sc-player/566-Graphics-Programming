/* Philip Strachan
 * planets.js
 * Creates a background of stars that you can move around in a 2d space.
 */

//GL context global reference.
var gl;
var canvas;

//Galazy configuration
var galaxySize = 10;
var tileSize = 0.05;

//Star configuration
var starCount = 1000;
var starSize = 3;
var starSizeOffset = 1;
var starRedDivisor = 5;
var starRedOffset = .8;
var starBlueDivisor = 3;
var starBlueOffset = .3;
var starGreenDivisor = 8;
var starGreenOffset  = .8;

//System configuration
var systemCount = 10;

//Individual star data is stored here. It is randomly generated.
var stars = [];
var points;
var colors;
var sizes;
var cameraTranslation = [0,0,0,0]; //Incremented and decremented on arrow keys.

//Shooting star effect data is stored here.
var shoots = [];
var shootChance=980;
var shootingStarColor = [1,1,1,1];

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
  'precision mediump float;' +
  'varying vec4 vColor;\n' +       //Color

  //Main: Sets color of each star.
  'void main(){\n' +
      'gl_FragColor = vColor;\n' +
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
    canvas.width=window.innerWidth;
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
  if(!initShaders(gl, VSHADER_STAR, FSHADER_STAR)){
    console.log('Failed to initialize shaders.');
    return;
  }
}

//function SetUpData
//
//Randomly generate starCount stars.
//Create Float32Arrays in order to send data to the GPU.
function SetUpData(){

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
  points = new Float32Array([].concat.apply([], stars.map(function(value){
      return [value.x, value.y];
  })));
  sizes = new Float32Array(stars.map(function(value){
      return value.size;
  }));
  colors = new Float32Array([].concat.apply([], stars.map(function(value){
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
  vertexBuffer = gl.createBuffer();
  sizeBuffer = gl.createBuffer();
  colorBuffer = gl.createBuffer();
  if(!vertexBuffer || !sizeBuffer || !colorBuffer){
    console.log('Failed to create the buffer objects');
    return;
  }
  
  //Get attribute locations
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  var a_Size = gl.getAttribLocation(gl.program, 'a_Size');
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Position<0 || a_Size<0 || a_Color<0){
    console.log('Failed to get the storage location of attributes');
    console.log(a_Position);
    console.log(a_Size);
    console.log(a_Color);
    return;
  }

  //Set up position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  //Set up size buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Size, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Size);

  //Set up color buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Color);
}

//function drawScene
//
//Gets camera location, and draws the stars according to their relative 
//positions.
function drawScene(){
  var u_Translation = gl.getUniformLocation(gl.program, "u_Translation");
  if(u_Translation < 0){
    console.log("Translation location not found.");
    return;
  }
  gl.uniform4fv(u_Translation, cameraTranslation);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, starCount);
}

//funciton animate
//
//Updates all animated parameters.
function animate(){
  var shootRoll=Math.random()*1000; 
  if(shootRoll>shootChance){
    shoots.push({
      x: Math.random()*2-1,
      y: 1,
      angle: Math.random()*30
    });
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

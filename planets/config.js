//Environment Configuration
var imageDir = "img/";
var shaderDir= "shaders/";
var spaceImage='img/ship.gif';

//Shape Configuration
var circleDegrees = 36; 

//Get webgl canvas and context
var canvas=document.getElementById('webgl'); 
var gl = getWebGLContext(canvas);

//Galaxy Configuration
var galaxySize = 10;
var tileSize = .2;
var galaxyTileSize=galaxySize/tileSize;

//Ship configuration
var shipWidth = .2;
var shipHeight = .2;

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

//Planets configuration
var planetCount = 30;
var planetSize=.08;
var planetTypes=[
  "barren",
  "metropolis",
  "rocky",
  "jungle",
  "plains",
  "water",
  "icy",
  "fiery"
];

var typeInfo=[
  {populated: false},
  {populated: true, populationChance:1},
  {populated: true, populationChance:.8},
  {populated: true, populationChance:.8},
  {populated: true, populationChance:.8},
  {populated: true, populationChance:.8},
  {populated: true, populationChance:.4},
  {populated: true, populationChance:.4},
];

//Surface Configuration
var surfaceSize=100;

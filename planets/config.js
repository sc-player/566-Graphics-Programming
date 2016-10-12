//Environment Configuration
var imageDir = "img/";
var shaderDir= "shaders/";

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

//Planets configuration
var planetCount = 30;
var planetSize=.05;
var planetTypes=[
  "Barren",
  "Rocky",
  "Jungle",
  "Plains",
  "Water",
  "Icy",
  "Fiery",
  "Metropolis"
];

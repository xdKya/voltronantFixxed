var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player,game;
var playerCount,gameState;
var allPlayers
var macquenn,macquennImg
var voltron,voltronImg
var cars
var road 
var fuel
var coin
var life
var obstacle1Image
var obstacle2Image



var fuels 
var coins
var obstacles


function preload() {
  backgroundImage = loadImage("assets/planodefundo.png");
  voltronImg = loadImage('assets/car1.png')
  macquennImg = loadImage('assets/car2.png')
  road = loadImage('assets/track.jpg') 
  fuel =loadImage('assets/fuel.png')
  coin = loadImage('assets/goldCoin.png')
  life = loadImage('assets/life.png')
  obstacle1Image = loadImage('assets/obstacle1.png')
  obstacle2Image = loadImage('assets/obstacle2.png')

 
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
  bgImg = backgroundImage;
}

function draw() {
  background(bgImg);
 
  if(playerCount===2){
game.update(1)
  }
  if(gameState===1){
    game.PLAY()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

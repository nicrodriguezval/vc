var mosaic;
var image;
var symbol1, symbol2;
var debug;

function preload(){
  image = loadImage('/vc/docs/sketches/lenna.png');
  symbol1 = loadImage('omkara.png');
  mosaic = loadShader('shader.vert','photomosaic.frag');
}

function setup() {
  createCanvas(600,600, WEBGL);
  textureMode(NORMAL);
  noStroke();
  shader(mosaic);
  mosaic.setUniform('image',image);
  mosaic.setUniform('symbol1',symbol1);
  mosaic.setUniform('symbol2',symbol2);
  mosaic.setUniform('resolution',30);
  debug = true;
  mosaic.setUniform('debug',debug);
}


function draw() {
  background(33);
  cover(true);
}

function cover(texture = false){
  beginShape();
  if(texture){
    vertex(-width / 2, -height /2, 0, 0, 0);
    vertex( width / 2, -height /2, 0, 1, 0);
    vertex( width / 2, height /2, 0, 1, 1);
    vertex( -width / 2, height /2, 0, 0, 1);
  } else {
    vertex(-width / 2, -height /2, 0);
    vertex( width / 2, -height /2, 0);
    vertex( width / 2, height /2, 0);
    vertex( -width / 2, height /2, 0);
  }
  endShape(CLOSE);
}

function keyPressed(){
  if(key === 'd'){
    debug = !debug;
    mosaic.setUniform('debug',debug);
  }
}

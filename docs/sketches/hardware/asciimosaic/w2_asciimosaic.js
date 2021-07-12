let gif;
let mosaic;
let cntImages = 0;
let bright;
var mosaicShader;
var image;
var symbol1, symbol2, symbols;
var debug;
var luma;
var maxWidePixels = 15500 ; //Limite de ancho del mosaico. Depende de la GPU
var speedAlg = 1; //Velocidad del algoritmo que saca el promedio de RGB
var resolution = 80; //cantidad de cuadros
let BGoption= new Map();
let BGselector;
//Preloads all images that are options in the selector
var mandrillImage;
var colormapImage;
let Symbolsoption = new Map();
let Symbolsselector;
//Preloads all images that are options in the selector
var arialImage;
var ericaOneImage;
let GIFoption = new Map();
//Preloads all images that are options in the selector
var GIFarial;
var GIFericaOne;
//Buttons and Inputs
var resInput;
var setResButton;
var debugButton;
var lumaButton;
//Offset
let rightOffset = 100;

function preload(){
  //Images: images/colormap.png, images/mandrill.png
  mandrillImage = loadImage("/vc/docs/sketches/hardware/asciimosaic/images/mandrill.png");
  colormapImage = loadImage("/vc/docs/sketches/hardware/asciimosaic/images/colormap.png");
  BGoption.set("mandrill",mandrillImage);
  BGoption.set("colormap",colormapImage);
  // gifs/arial.gif, gifs/erica-one.gif
  arialImage = loadImage("/vc/docs/sketches/hardware/asciimosaic/gifs/generated/arial.png");
  ericaOneImage = loadImage("/vc/docs/sketches/hardware/asciimosaic/gifs/generated/erica-one.png");
  Symbolsoption.set("arial",arialImage);
  Symbolsoption.set("erica-one",ericaOneImage);
  GIFarial = loadImage("/vc/docs/sketches/hardware/asciimosaic/gifs/arial.gif");
  GIFericaOne = loadImage("/vc/docs/sketches/hardware/asciimosaic/gifs/erica-one.gif");
  GIFoption.set("arial",GIFarial);
  GIFoption.set("erica-one",GIFericaOne);
  
  //Default values at the beggining
  mosaicShader = loadShader("/vc/docs/sketches/hardware/asciimosaic/shader.vert","/vc/docs/sketches/hardware/asciimosaic/asciimosaic.frag");
  image = loadImage("/vc/docs/sketches/hardware/asciimosaic/images/mandrill.png");
  mosaic = loadImage("/vc/docs/sketches/hardware/asciimosaic/gifs/generated/arial.png");
  gif = loadImage("/vc/docs/sketches/hardware/asciimosaic/gifs/arial.gif");
}

function setup() {
  createCanvas(600 + rightOffset,600, WEBGL);
  textureMode(NORMAL);
  noStroke();
  shader(mosaicShader);
  //Background image selector
  BGselector = createSelect();
  BGselector.position(width - rightOffset + 10, 10);
  BGselector.size(90, 20);
  BGselector.option("mandrill");
  BGselector.option("colormap");
  //Symbols image selector
  Symbolsselector = createSelect();
  Symbolsselector.position(width - rightOffset + 10, 40);
  Symbolsselector.size(90, 20);
  Symbolsselector.option("arial");
  Symbolsselector.option("erica-one");
  //Input and Button to set Resolution
  resInput = createInput("80");
  resInput.position(width - rightOffset + 10, 70);
  resInput.size(40, 20);
  setResButton = createButton('set');
  setResButton.position(width - rightOffset + 60, 70);
  setResButton.size(40, 20);
  setResButton.mousePressed(changeResolution);
  debugButton = createButton('debug');
  debugButton.position(width - rightOffset + 10, 100);
  debugButton.size(80, 20);
  lumaButton = createButton('luma');
  lumaButton.position(width - rightOffset + 10, 130);
  lumaButton.size(80, 20);

  mosaicShader.setUniform("image",image);
  //Se carga la imagen con todas las texturas
  mosaicShader.setUniform('parts',gif.numFrames());
  mosaicShader.setUniform("symbols",mosaic);  
  mosaicShader.setUniform("resolution",resolution);
  debug = true;
  luma = true;
  mosaicShader.setUniform("debug",debug);
  mosaicShader.setUniform("luma",luma);

}

function draw() {
  background(33);
  BGselector.changed(BGImageSelectEvent);
  Symbolsselector.changed(GIFImageSelectEvent);
  debugButton.mousePressed(mosaicMode);
  lumaButton.mousePressed(toggleLuma);
  cover(true);
}

function toggleLuma() {
  if (luma) {
    lumaButton.html('avg');
  } else {
    lumaButton.html('luma');
  }
  lumaMode();
}

function mosaicMode(){
  debug = !debug;
  mosaicShader.setUniform("debug",debug);
}

function lumaMode(){
  luma = !luma;
  mosaicShader.setUniform("luma",luma);
}

function changeResolution(){
  const newRes = parseInt(resInput.value());
  mosaicShader.setUniform("resolution", newRes);
}

function BGImageSelectEvent() {
  let nameImage = BGselector.value();
  image = BGoption.get(nameImage);
  mosaicShader.setUniform("image",image);
  // console.log(kernel);
  redraw();
}

function GIFImageSelectEvent() {
  let nameImage = Symbolsselector.value();
  mosaic = Symbolsoption.get(nameImage);
  gif = GIFoption.get(nameImage);
  mosaicShader.setUniform('parts',gif.numFrames());
  mosaicShader.setUniform("symbols",mosaic);
  // console.log(kernel);
  redraw();
}

function cover(texture = false){
  beginShape();
  if(texture){
    vertex(-width / 2, -height /2, 0, 0, 0);
    vertex( width / 2 - rightOffset, -height /2, 0, 1, 0);
    vertex( width / 2 - rightOffset, height /2, 0, 1, 1);
    vertex( -width / 2, height /2, 0, 0, 1);
  } else {
    vertex(-width / 2, -height /2, 0);
    vertex( width / 2 - rightOffset, -height /2, 0);
    vertex( width / 2 - rightOffset, height /2, 0);
    vertex( -width / 2, height /2, 0);
  }
  endShape(CLOSE);
}

function keyPressed(){
  if(key === "d"){
    mosaicMode();
  }
  if(key === "g"){
    lumaMode();
  }
}
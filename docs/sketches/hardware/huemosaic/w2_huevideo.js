let vid;
let mosaic;
var mosaicShader;
var image;
var debug;
var luma;
var initialFPS = 120; //FPS iniciales del sketch
var resolution = 80; //cantidad de cuadros
var partsX = 6;
var partsY = 6;
//Selectors
let BGoption= new Map();
let BGselector;
//Preloads all images that are options in the selector
var rgbArrayObj;
//Selector of grid size
let gridOption= new Map();
let gridSelector;
let Symbolsoption = new Map();
let Symbolsselector;
//Fonts
//Buttons and Inputs
var playButton;
var resInput;
var numTexDiv;
var setResButton;
var debugButton;
var fpsButton;
var fpsDiv;
var avgfpsDiv;
var fpsInput;
var setFpsButton;
var secondsDiv;
//Offset
let rightOffset = 100;

function preload(){
  //Images: images/colormap.png, images/mandrill.png
  //Images: images/colormap.png, images/mandrill.png
  Symbolsselector = createSelect();
  addGridsToSymbols("paintings");
  addGridsToSymbols("spirited-away");
  addGridsToSymbols("terminator");
  addGridsToSymbols("wall-e");
  addGridsToSymbols("bee-movie");
  //Default values
  image = loadImage('/vc/docs/sketches/hardware/huemosaic/images/mandrill.png');
  mosaicShader = loadShader('/vc/docs/sketches/hardware/huemosaic/shader.vert','/vc/docs/sketches/hardware/huemosaic/huemosaic.frag');
  mosaic = loadImage('/vc/docs/sketches/hardware/huemosaic/mosaics/paintings6x6.jpg');
  
}

function setup() {
  createCanvas(600 + rightOffset,600, WEBGL);
  textureMode(NORMAL);
  noStroke();
  shader(mosaicShader);
  BGselector = createSelect();
  setBGVideo("fingers");
  setBGVideo("soccer");
  //Default
  vid = createVideo(["/vc/docs/sketches/fingers.mov", "/vc/docs/sketches/fingers.webm"]);
  vid.stop();
  vid.hide();

  rightMenu();

  console.log("partsX: "+partsX);
  mosaicShader.setUniform('partsX', partsX);
  console.log("partsY: "+partsY);
  mosaicShader.setUniform('partsY', partsY);
  mosaicShader.setUniform('image',vid);
  //Se carga la imagen con todas las texturas
  mosaicShader.setUniform('symbols',mosaic);  
  mosaicShader.setUniform('resolution',resolution);
  debug = true;
  luma = true;
  mosaicShader.setUniform('debug',debug);
  mosaicShader.setUniform('luma',luma);
}

function draw() {
  background(33);
  mosaicShader.setUniform('image',vid);
  BGselector.changed(BGVideoSelectEvent);
  gridSelector.changed(setNewResolution);
  Symbolsselector.changed(MosaicImageSelectEvent);
  debugButton.mousePressed(mosaicMode);
  lumaButton.mousePressed(toggleLuma);
  setFpsButton.mousePressed(changeFPS);
  playButton.mousePressed(playPauseVideo);
  updateFPS();
  updateNumTextures();
  cover(true);
}

function setBGVideo(name){
  var video = createVideo(["/vc/docs/sketches/"+name+".mov","/vc/docs/sketches/"+name+".webm"]);
  video.hide();
  BGoption.set(name,video);
  BGselector.option(name);
}

let isPlaying = false;
function playPauseVideo(){
  if(isPlaying){
    isPlaying = !isPlaying
    vid.stop();
    playButton.html("play");
  } else {
    isPlaying = !isPlaying
    vid.loop();
    playButton.html("pause");
  }
}

function addGridsToSymbols(strName){
  var img6x6 = loadImage("/vc/docs/sketches/hardware/huemosaic/mosaics/"+strName+"6x6.jpg");
  var img9x9 = loadImage("/vc/docs/sketches/hardware/huemosaic/mosaics/"+strName+"9x9.jpg");
  var img8x16 = loadImage("/vc/docs/sketches/hardware/huemosaic/mosaics/"+strName+"8x16.jpg");
  var img16x8 = loadImage("/vc/docs/sketches/hardware/huemosaic/mosaics/"+strName+"16x8.jpg");
  var img8x24 = loadImage("/vc/docs/sketches/hardware/huemosaic/mosaics/"+strName+"8x24.jpg");
  var img24x8 = loadImage("/vc/docs/sketches/hardware/huemosaic/mosaics/"+strName+"24x8.jpg");
  var img12x24 = loadImage("/vc/docs/sketches/hardware/huemosaic/mosaics/"+strName+"12x24.jpg");
  var img24x12 = loadImage("/vc/docs/sketches/hardware/huemosaic/mosaics/"+strName+"24x12.jpg");
  Symbolsoption.set(strName+"06x06",img6x6);
  Symbolsoption.set(strName+"09x09",img9x9);
  Symbolsoption.set(strName+"08x16",img8x16);
  Symbolsoption.set(strName+"16x08",img16x8);
  Symbolsoption.set(strName+"08x24",img8x24);
  Symbolsoption.set(strName+"24x08",img24x8);
  Symbolsoption.set(strName+"12x24",img12x24);
  Symbolsoption.set(strName+"24x12",img24x12);
  Symbolsselector.option(strName);
}

function updateNumTextures(){
  numTexDiv.html(partsX * partsY);
}

function rightMenu(){
  //Background image selector
  let ySpace = 20;
  playButton = createButton('play');
  playButton.position(width - rightOffset + 17, ySpace);
  playButton.size(80, 25);
  ySpace += 15;
  let vidSetText = createP("Videos Set");
  setText(vidSetText,90,20,width - rightOffset + 10,ySpace,'white',14);
  ySpace += 30;
  BGselector.position(width - rightOffset + 10, ySpace);
  BGselector.size(90, 20);
  ySpace += 10;
  let gridSizeText = createP("Grid Size");
  setText(gridSizeText,90,20,width - rightOffset + 10,ySpace,'white',14);
  ySpace += 30;
  //Grid size selector
  gridSelector = createSelect();
  gridSelector.position(width - rightOffset + 10, ySpace);
  gridSelector.size(90, 20);
  gridSelector.option("06x06");
  gridSelector.option("09x09");
  gridSelector.option("08x16");
  gridSelector.option("16x08");
  gridSelector.option("08x24");
  gridSelector.option("24x08");
  gridSelector.option("12x24");
  gridSelector.option("24x12");
  ySpace += 10;
  let srcSetText = createP("Sources Set");
  setText(srcSetText,90,20,width - rightOffset + 10,ySpace,'white',14);
  ySpace += 30;
  Symbolsselector.position(width - rightOffset + 10, ySpace);
  Symbolsselector.size(90, 20);
  ySpace += 10;
  let numTexText = createP("Num. Textures:");
  setText(numTexText,100,20,width - rightOffset+7,ySpace,'white',12);
  ySpace += 30;
  numTexDiv = createDiv(partsX * partsY);
  setDiv(numTexDiv,40,20,width - rightOffset + 35,ySpace,'white',20,0,2);
  ySpace += 30;
  //Input and Button to set Resolution
  resInput = createInput("80");
  resInput.position(width - rightOffset + 10, ySpace);
  resInput.size(40, 20);
  setResButton = createButton('set');
  setResButton.position(width - rightOffset + 60, ySpace);
  setResButton.size(40, 25);
  setResButton.mousePressed(changeResolution);
  ySpace += 30;
  //Debug and Luma Buttons
  debugButton = createButton('debug');
  debugButton.position(width - rightOffset + 17, ySpace);
  debugButton.size(80, 25);
  ySpace += 30;
  lumaButton = createButton('luma');
  lumaButton.position(width - rightOffset + 17, ySpace);
  lumaButton.size(80, 25);
  ySpace += 30;
  //FPS Displays
  frameRate(initialFPS);
  fpsInput = createInput(initialFPS);
  fpsInput.position(width - rightOffset + 10, ySpace);
  fpsInput.size(40, 20);
  setFpsButton = createButton('fps');
  setFpsButton.position(width - rightOffset + 60, ySpace);
  setFpsButton.size(40, 25);
  ySpace += 10;
  let fpsText = createP("FPS");
  setText(fpsText,75,20,width - rightOffset + 20,ySpace,'white',24);
  ySpace += 50;
  fpsDiv = createDiv(0);
  setDiv(fpsDiv,50,50,width - rightOffset + 25,ySpace,'white',30,15,15);
  ySpace += 60;
  let avgfpsText = createP("AVG FPS");
  setText(avgfpsText,77,20,width - rightOffset + 20,ySpace,'white',14);
  ySpace += 30;
  avgfpsDiv = createDiv(0);
  setDiv(avgfpsDiv,60,30,width - rightOffset + 25,ySpace,'white',20,8,8);
  ySpace += 30;
  let secondsText = createP("Time (s)");
  setText(secondsText,77,20,width - rightOffset + 20,ySpace,'white',14);
  ySpace += 30;
  secondsDiv = createDiv(0);
  setDiv(secondsDiv,60,30,width - rightOffset + 25,ySpace,'white',20,8,8);
}

function setDiv(divElem,sizeX,sizeY,x,y,BGcolor,Fontsize,padTop,padLeft){
  divElem.position(x, y);
  divElem.style('background-color', BGcolor);
  divElem.style('font-family', 'Helvetica');
  divElem.style('padding-top', padTop + 'px');
  divElem.style('padding-left', padLeft + 'px');
  divElem.style('font-size',Fontsize + 'px');
  divElem.size(sizeX, sizeY);
}

function setText(textElem,sizeX,sizeY,x,y,color,size){
  textElem.size(sizeX, sizeY);
  textElem.position(x, y);
  textElem.style('color', color);
  textElem.style('text-align', 'center');
  textElem.style('font-family', 'Helvetica');
  textElem.style('font-size', size + 'px');
}

function changeFPS(){
  console.log("fpsInput.value(): "+fpsInput.value())
  frameRate(int(fpsInput.value()));
}

let savedMillis = 1000;
let savedFPS = 0;
function updateFPS(){
  let decimalMillis = millis() % 1000;
  let fps = 0;
  if(decimalMillis < savedMillis){
    updateAvgFPS();
    savedMillis = decimalMillis;
    fps = savedFPS + frameCount;
    fpsDiv.html(fps);
    if(fps <= 15){
      fpsDiv.style('color', '#FF0000');
    } else{
      fpsDiv.style('color', '#000000');
      
    }
    savedFPS = -frameCount;
  } else {
    savedMillis = decimalMillis;
  }
  
}

function updateAvgFPS(){
  let s = millis() / 1000;
  let avg = Math.round((frameCount / s)*100)/100;
  avgfpsDiv.html(avg);
  secondsDiv.html(Math.floor(s));
}

function MosaicImageSelectEvent() {
  let nameImage = Symbolsselector.value() + gridSelector.value();
  mosaic = Symbolsoption.get(nameImage);
  mosaicShader.setUniform("symbols",mosaic);
  //redraw();
}

function BGVideoSelectEvent() {
  let nameVideo = BGselector.value();
  vid = BGoption.get(nameVideo);
  mosaicShader.setUniform("image",vid);
  if(isPlaying){
    playPauseVideo();
  }
}

function setNewResolution(){
  let pX = int(gridSelector.value()[0] + gridSelector.value()[1]);
  let pY = int(gridSelector.value()[3] + gridSelector.value()[4]);
  partsX = pX;
  partsY = pY;
  MosaicImageSelectEvent();
  mosaicShader.setUniform('partsX', partsX);
  mosaicShader.setUniform('partsY', partsY);
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

function changeResolution(){
  const newRes = parseInt(resInput.value());
  mosaicShader.setUniform("resolution", newRes);
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

function keyPressed(){
  if(key === "d"){
    mosaicMode();
  }
  if(key === "g"){
    lumaMode();
  }
}
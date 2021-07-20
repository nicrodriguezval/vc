let gif;
let vid;
let mosaic;
let rgbArray = [];
var mosaicShader;
var image;
var debug;
var initialFPS = 120; //FPS iniciales del sketch
var resolution = 80; //cantidad de cuadros
let BGoption= new Map();
let BGselector;
var rgbArrayObj;
let Symbolsoption = new Map();
let Symbolsselector;
let GIFoption = new Map();
let JSONoption = new Map();
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
//Reset 
var resetButton;
var resetTime = 0;
var resetFrame = 0;
//Offset
let rightOffset = 100;

function preload(){
  //Images: images/colormap.png, images/mandrill.png
  Symbolsselector = createSelect();
  setSymbolsGIFAndJSON("spirited-away");
  setSymbolsGIFAndJSON("terminator");
  setSymbolsGIFAndJSON("wall-e");
  setSymbolsGIFAndJSON("bee-movie");
  setSymbolsGIFAndJSON("paintings36");
  setSymbolsGIFAndJSON("paintings81");
  setSymbolsGIFAndJSON("paintings128");
  setSymbolsGIFAndJSON("paintings192");
  setSymbolsGIFAndJSON("paintings288");
  //Default values at the beggining
  mosaicShader = loadShader('/vc/docs/sketches/hardware/mosaic/shader.vert','/vc/docs/sketches/hardware/mosaic/photomosaic.frag');
  //gifs: gifs/shrek.gif, gifs/paintings.gif, gifs/landscapes.gif, gifs/bee-movie.gif
  gif = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/spirited-away.gif');
  rgbArrayObj = loadJSON('/vc/docs/sketches/hardware/mosaic/gifs/generated/spirited-away.json');
  mosaic = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/generated/spirited-away.png');
  //console.log("rgbArrayObj",rgbArrayObj);
  
}

function setup() {
  for(let e = 0; e < Object.keys(rgbArrayObj).length; e++){
    rgbArray.push(rgbArrayObj[e]);
  }
  //console.log("rgbArray",rgbArray);
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
  
  mosaicShader.setUniform('parts', gif.numFrames());

  //Exportar el arreglo de valores rgb a un .json
  //createStringDict(rgbArray).saveJSON("rgbArray");
  
  mosaicShader.setUniform('image',vid);
  //Se carga la imagen con todas las texturas
  mosaicShader.setUniform('symbols',mosaic);
  //Se ingresa la cantidad de texturas presentes en la imagen
  
  mosaicShader.setUniform('rgbValues',rgbArray);
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
  Symbolsselector.changed(GIFImageSelectEvent);
  debugButton.mousePressed(mosaicMode);
  setFpsButton.mousePressed(changeFPS);
  playButton.mousePressed(playPauseVideo);
  resetButton.mousePressed(resetSeconds);
  updateFPS();
  updateNumTextures();
  cover(true);
}

function resetSeconds(){
  resetTime = millis();
  resetFrame = frameCount;
}

function setBGVideo(name){
  var video = createVideo(["/vc/docs/sketches/"+name+".mov","/vc/docs/sketches/"+name+".webm"]);
  video.hide();
  BGoption.set(name,video);
  BGselector.option(name);
}

function setSymbolsGIFAndJSON(name){
  var imag = loadImage("/vc/docs/sketches/hardware/mosaic/gifs/generated/"+name+".png");
  Symbolsoption.set(name,imag);
  Symbolsselector.option(name);
  var GIFvar = loadImage("/vc/docs/sketches/hardware/mosaic/gifs/"+name+".gif");
  GIFoption.set(name,GIFvar);
  var JSONvar = loadJSON("/vc/docs/sketches/hardware/mosaic/gifs/generated/"+name+".json");
  JSONoption.set(name,JSONvar);
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

function updateNumTextures(){
  numTexDiv.html(gif.numFrames());
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
  let fontSetText = createP("Sources Set");
  setText(fontSetText,90,20,width - rightOffset + 10,ySpace,'white',14);
  ySpace += 30;
  //Symbols image selector
  Symbolsselector.position(width - rightOffset + 10, ySpace);
  Symbolsselector.size(90, 20);
  ySpace += 10;
  let numTexText = createP("Num. Textures:");
  setText(numTexText,100,20,width - rightOffset+7,ySpace,'white',12);
  ySpace += 30;
  numTexDiv = createDiv(gif.numFrames());
  setDiv(numTexDiv,40,20,width - rightOffset + 35,ySpace,'white',20,0,2);
  ySpace += 30;
  //Input and Button to set Resolution
  resInput = createInput("80");
  resInput.position(width - rightOffset + 10, ySpace);
  resInput.size(40, 20);
  setResButton = createButton('set');
  setResButton.position(width - rightOffset + 60, ySpace);
  setResButton.size(40, 25);
  ySpace += 30;
  setResButton.mousePressed(changeResolution);
  //Debug and Luma Buttons
  debugButton = createButton('debug');
  debugButton.position(width - rightOffset + 17, ySpace);
  debugButton.size(80, 25);
  ySpace += 30;
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
  ySpace += 50;
  resetButton = createButton('reset');
  resetButton.position(width - rightOffset + 17, ySpace);
  resetButton.size(80, 25);
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
  let s = (millis() - resetTime) / 1000;
  let avg = Math.round(((frameCount - resetFrame )/ s)*100)/100;
  avgfpsDiv.html(avg);
  secondsDiv.html(Math.floor(s));
}

function mosaicMode(){
  debug = !debug;
  mosaicShader.setUniform("debug",debug);
}

function changeResolution(){
  const newRes = parseInt(resInput.value());
  mosaicShader.setUniform("resolution", newRes);
}

function BGVideoSelectEvent() {
  let nameVideo = BGselector.value();
  vid = BGoption.get(nameVideo);
  mosaicShader.setUniform("image",vid);
  if(isPlaying){
    playPauseVideo();
  }
}

function GIFImageSelectEvent() {
  let nameImage = Symbolsselector.value();
  mosaic = Symbolsoption.get(nameImage);
  gif = GIFoption.get(nameImage);
  rgbArrayObj = JSONoption.get(nameImage);
  rgbArray = [];
  for(let e = 0; e < Object.keys(rgbArrayObj).length; e++){
    rgbArray.push(rgbArrayObj[e]);
  }
  mosaicShader.setUniform('rgbValues',rgbArray);
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
}
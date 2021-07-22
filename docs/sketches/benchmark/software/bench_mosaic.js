let img;
let smaller;
let allImages = [];
let brightImages = new Array(256);
let bright = [];
let resolution = 80;
var initialFPS = 120; //FPS iniciales del sketch
var numTextures = 160;
let scl;
//Menu
let BGoption= new Map();
let BGselector;
let Symbolsoption = new Map();
let Symbolsselector;
//Buttons and Inputs
var resInput;
var numTexDiv;
var setResButton;
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

function preload() {
  scl = 512 / resolution;
  img = loadImage("/vc/docs/sketches/lenna.png");

  for (let i = 0; i < numTextures; i++) {
    allImages[i] = loadImage(`/vc/docs/sketches/dataset/image${i}.jpg`); 
  }
}

function setup() {
  createCanvas(512 + rightOffset, 512);
  processMosaic();
  BGselector = createSelect();
  BGselector.option("lenna");
  Symbolsselector = createSelect();
  Symbolsselector.option("dataset");
  rightMenu();
  //noLoop();
}

function draw() {
  background(0);
  getMosaic();
  setFpsButton.mousePressed(changeFPS);
  resetButton.mousePressed(resetSeconds);
  updateFPS();
}

function processMosaic(){
  
  for (let i = 0; i < allImages.length; i++) {
    avg = 0;

    for (let j = 0; j < allImages[i].width; j++) {
      for (let k = 0; k < allImages[i].height; k++) {
        avg += brightness(allImages[i].get(j, k));
      }
    }

    bright[i] = avg / (allImages[i].width * allImages[i].height);
  }

  for (let i = 0; i < brightImages.length; i++) {
    minDiff = 256;

    for (let j = 0; j < bright.length; j++) {
      diff = abs(i - bright[j]);

      if (diff < minDiff) {
        minDiff = diff;
        brightImages[i] = allImages[j];
      }
    }
  }

  smaller = createImage(img.width / scl, img.height);
  smaller.copy(img, 0, 0, img.width, img.height, 0, 0, img.width / scl, img.height / scl);
}

function getMosaic(){
  for (let i = 0; i < (img.width / scl); i++) {
    for (let j = 0; j < (img.width / scl); j++) {
      index = int(brightness(smaller.get(i, j)));
      image(brightImages[index], i * scl, j * scl, scl, scl);
    }
  }
}

//Menu functions

function resetSeconds(){
  resetTime = millis();
  resetFrame = frameCount;
}

function rightMenu(){
  //Background image selector
  let ySpace = 0;
  let vidSetText = createP("Images Set");
  setText(vidSetText,90,20,width - rightOffset + 10,ySpace,'white',14);
  ySpace += 30;
  //Background selector
  BGselector.position(width - rightOffset + 10, ySpace);
  BGselector.size(90, 20);
  ySpace += 10;
  let fontSetText = createP("Source Set");
  setText(fontSetText,90,20,width - rightOffset + 10,ySpace,'white',14);
  ySpace += 30;
  //Symbols image selector
  Symbolsselector.position(width - rightOffset + 10, ySpace);
  Symbolsselector.size(90, 20);
  ySpace += 10;
  let numTexText = createP("Num. Textures:");
  setText(numTexText,100,20,width - rightOffset+7,ySpace,'white',12);
  ySpace += 30;
  numTexDiv = createDiv(numTextures);
  setDiv(numTexDiv,40,20,width - rightOffset + 35,ySpace,'white',20,0,2);
  ySpace += 30;
  //Input and Button to set Resolution
  resInput = createInput(resolution);
  resInput.position(width - rightOffset + 10, ySpace);
  resInput.size(40, 20);
  setResButton = createButton('set');
  setResButton.position(width - rightOffset + 60, ySpace);
  setResButton.size(40, 25);
  ySpace += 30;
  setResButton.mousePressed(changeResolution);
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

function changeResolution(){
  const newRes = parseInt(resInput.value());
  resolution = newRes;
  scl = 512 / resolution;
  //resizeCopyImage();
  processMosaic();
}

function resizeCopyImage(){
    copy_lenna = createImage(lenna.width,lenna.height);
    copy_lenna.copy(lenna,0,0,lenna.width,lenna.height,0,0,lenna.width,lenna.height);
    copy_lenna.resize(resolution,resolution); //Resizing the image we get the superpixels
    copy_lenna.copy(yuvGrayscale(copy_lenna),0,0,copy_lenna.width,copy_lenna.height,0,0,copy_lenna.width,copy_lenna.height); //Convert to grayscale
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
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
let rgbArray = [];
let BGoption= new Map();
let BGselector;
//Preloads all images that are options in the selector
var mandrillImage;
var colormapImage;
var rgbArrayObj;

let Symbolsoption = new Map();
let Symbolsselector;
//Preloads all images that are options in the selector
var shrekImage;
var paintingsImage;
var landscapesImage;
var beeMovieImage;
let GIFoption = new Map();
//Preloads all images that are options in the selector
var GIFshrek;
var GIFpaintings;
var GIFlandscapes;
var GIFbeeMovie;
let JSONoption = new Map();
//Preloads all images that are options in the selector
var JSONshrek;
var JSONpaintings;
var JSONlandscapes;
var JSONbeeMovie;

function preload(){
  image = loadImage("/vc/docs/sketches/hardware/mosaic/images/mandrill.png");
  //Images: images/colormap.png, images/mandrill.png
  mandrillImage = loadImage("/vc/docs/sketches/hardware/mosaic/images/mandrill.png");
  colormapImage = loadImage("/vc/docs/sketches/hardware/mosaic/images/colormap.png");
  BGoption.set("mandrill",mandrillImage);
  BGoption.set("colormap",colormapImage);
  shrekImage = loadImage("/vc/docs/sketches/hardware/mosaic/gifs/generated/shrek.png");
  paintingsImage = loadImage("/vc/docs/sketches/hardware/mosaic/gifs/generated/paintings.png");
  landscapesImage = loadImage("/vc/docs/sketches/hardware/mosaic/gifs/generated/landscapes.png");
  beeMovieImage = loadImage("/vc/docs/sketches/hardware/mosaic/gifs/generated/bee-movie.png");
  Symbolsoption.set("shrek",shrekImage);
  Symbolsoption.set("paintings",paintingsImage);
  Symbolsoption.set("landscapes",landscapesImage);
  Symbolsoption.set("bee-movie",beeMovieImage);
  GIFshrek = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/shrek.gif');
  GIFpaintings = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/paintings.gif');
  GIFlandscapes = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/landscapes.gif');
  GIFbeeMovie = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/bee-movie.gif');
  GIFoption.set("shrek",GIFshrek);
  GIFoption.set("paintings",GIFpaintings);
  GIFoption.set("landscapes",GIFlandscapes);
  GIFoption.set("bee-movie",GIFbeeMovie);
  JSONshrek = loadJSON('/vc/docs/sketches/hardware/mosaic/gifs/generated/shrek.json');
  JSONpaintings = loadJSON('/vc/docs/sketches/hardware/mosaic/gifs/generated/paintings.json');
  JSONlandscapes = loadJSON('/vc/docs/sketches/hardware/mosaic/gifs/generated/landscapes.json');
  JSONbeeMovie = loadJSON('/vc/docs/sketches/hardware/mosaic/gifs/generated/bee-movie.json');
  JSONoption.set("shrek",JSONshrek);
  JSONoption.set("paintings",JSONpaintings);
  JSONoption.set("landscapes",JSONlandscapes);
  JSONoption.set("bee-movie",JSONbeeMovie);
  //Default values at the beggining
  image = loadImage('/vc/docs/sketches/hardware/mosaic/images/mandrill.png');
  mosaicShader = loadShader('/vc/docs/sketches/hardware/mosaic/shader.vert','/vc/docs/sketches/hardware/mosaic/photomosaic.frag');
  //gifs: gifs/shrek.gif, gifs/paintings.gif, gifs/landscapes.gif, gifs/bee-movie.gif
  gif = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/shrek.gif');
  rgbArrayObj = loadJSON('/vc/docs/sketches/hardware/mosaic/gifs/generated/shrek.json');
  mosaic = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/generated/shrek.png');
  console.log("rgbArrayObj",rgbArrayObj);
  
}

function setup() {
  for(let e = 0; e < Object.keys(rgbArrayObj).length; e++){
    rgbArray.push(rgbArrayObj[e]);
  }
  //console.log("rgbArray",rgbArray);
  createCanvas(600,600, WEBGL);
  textureMode(NORMAL);
  noStroke();
  shader(mosaicShader);
  
  //Background image selector
  BGselector = createSelect();
  BGselector.position(10, 10);
  BGselector.option("mandrill");
  BGselector.option("colormap");
  //Symbols image selector
  Symbolsselector = createSelect();
  Symbolsselector.position(90, 10);
  Symbolsselector.option("shrek");
  Symbolsselector.option("paintings");
  Symbolsselector.option("landscapes");
  Symbolsselector.option("bee-movie");
  
  mosaicShader.setUniform('parts', gif.numFrames());

  //Exportar el arreglo de valores rgb a un .json
  //createStringDict(rgbArray).saveJSON("rgbArray");
  
  mosaicShader.setUniform('image',image);
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
  BGselector.changed(BGImageSelectEvent);
  Symbolsselector.changed(GIFImageSelectEvent);
  cover(true);
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
    mosaicShader.setUniform('debug',debug);
  }
  if(key === 'g'){
    luma = !luma;
    mosaicShader.setUniform('luma',luma);
  }
}
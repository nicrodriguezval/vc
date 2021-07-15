<h1 align="center">Mosaic processing</h1>

# Problem statement

## Propósito

Introducir el análisis de imágenes al implementar las siguientes operaciones de análisis para imágenes:

## Tareas

* Conversión de la imagen a un _foto-mosaico_.

# Background

## Photographic mosaic

A photographic mosaic is an image or picture that has been split into smaller sections, usually grids or squares. The original image is represented by others smaller photos that are in the grids and they fulfill the property that they've got a similar color to the section they're representing. Joseph Francis is believed to be the inventor of the kind of photographic mosaics that we see nowadays. In this example, we are representing the photo of Lenna with a mosaic.

## Mosaic (RGB Distance)

> :Tabs
> > :Tab title=sketch
> >
> > > :P5 sketch=/docs/sketches/hardware/mosaic/w2_photomosaic.js, width=700, height=600 
> 
> > :Tab title=code
> > 
> > ```js | w2_photomosaic.js
> >let gif;
> >let mosaic;
> >let cntImages = 0;
> >let bright;
> >var mosaicShader;
> >var image;
> >var symbol1, symbol2, symbols;
> >var debug;
> >var luma;
> >var maxWidePixels = 15500 ; //Limite de ancho del mosaico. Depende de la GPU
> >var speedAlg = 1; //Velocidad del algoritmo que saca el promedio de RGB
> >var resolution = 80; //cantidad de cuadros
> >let rgbArray = [];
> >let BGoption= new Map();
> >let BGselector;
> >//Preloads all images that are options in the selector
> >var mandrillImage;
> >var colormapImage;
> >var rgbArrayObj;
> >
> >let Symbolsoption = new Map();
> >let Symbolsselector;
> >//Preloads all images that are options in the selector
> >var shrekImage;
> >var paintingsImage;
> >var landscapesImage;
> >var beeMovieImage;
> >let GIFoption = new Map();
> >//Preloads all images that are options in the selector
> >var GIFshrek;
> >var GIFpaintings;
> >var GIFlandscapes;
> >var GIFbeeMovie;
> >let JSONoption = new Map();
> >//Preloads all images that are options in the selector
> >var JSONshrek;
> >var JSONpaintings;
> >var JSONlandscapes;
> >var JSONbeeMovie;
> >
> >function preload(){
> >  image = loadImage("/vc/docs/sketches/hardware/mosaic/images/mandrill.png");
> >  //Images: images/colormap.png, images/mandrill.png
> >  mandrillImage = loadImage("/vc/docs/sketches/hardware/mosaic/images/mandrill.png");
> >  colormapImage = loadImage("/vc/docs/sketches/hardware/mosaic/images/colormap.png");
> >  BGoption.set("mandrill",mandrillImage);
> >  BGoption.set("colormap",colormapImage);
> >  shrekImage = loadImage("/vc/docs/sketches/hardware/mosaic/gifs/generated/shrek.png");
> >  paintingsImage = loadImage("/vc/docs/sketches/hardware/mosaic/gifs/generated/paintings.png");
> >  landscapesImage = loadImage("/vc/docs/sketches/hardware/mosaic/gifs/generated/landscapes.png");
> >  beeMovieImage = loadImage("/vc/docs/sketches/hardware/mosaic/gifs/generated/bee-movie.png");
> >  Symbolsoption.set("shrek",shrekImage);
> >  Symbolsoption.set("paintings",paintingsImage);
> >  Symbolsoption.set("landscapes",landscapesImage);
> >  Symbolsoption.set("bee-movie",beeMovieImage);
> >  GIFshrek = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/shrek.gif');
> >  GIFpaintings = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/paintings.gif');
> >  GIFlandscapes = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/landscapes.gif');
> >  GIFbeeMovie = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/bee-movie.gif');
> >  GIFoption.set("shrek",GIFshrek);
> >  GIFoption.set("paintings",GIFpaintings);
> >  GIFoption.set("landscapes",GIFlandscapes);
> >  GIFoption.set("bee-movie",GIFbeeMovie);
> >  JSONshrek = loadJSON('/vc/docs/sketches/hardware/mosaic/gifs/generated/shrek.json');
> >  JSONpaintings = loadJSON('/vc/docs/sketches/hardware/mosaic/gifs/generated/paintings.json');
> >  JSONlandscapes = loadJSON('/vc/docs/sketches/hardware/mosaic/gifs/generated/landscapes.json');
> >  JSONbeeMovie = loadJSON('/vc/docs/sketches/hardware/mosaic/gifs/generated/bee-movie.json');
> >  JSONoption.set("shrek",JSONshrek);
> >  JSONoption.set("paintings",JSONpaintings);
> >  JSONoption.set("landscapes",JSONlandscapes);
> >  JSONoption.set("bee-movie",JSONbeeMovie);
> >  //Default values at the beggining
> >  image = loadImage('/vc/docs/sketches/hardware/mosaic/images/mandrill.png');
> >  mosaicShader = loadShader('/vc/docs/sketches/hardware/mosaic/shader.vert','/vc/docs/sketches/hardware/mosaic/photomosaic.frag');
> >  //gifs: gifs/shrek.gif, gifs/paintings.gif, gifs/landscapes.gif, gifs/bee-movie.gif
> >  gif = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/shrek.gif');
> >  rgbArrayObj = loadJSON('/vc/docs/sketches/hardware/mosaic/gifs/generated/shrek.json');
> >  mosaic = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/generated/shrek.png');
> >  console.log("rgbArrayObj",rgbArrayObj);
> >  
> >}
> >
> >function setup() {
> >  for(let e = 0; e < Object.keys(rgbArrayObj).length; e++){
> >    rgbArray.push(rgbArrayObj[e]);
> >  }
> >  //console.log("rgbArray",rgbArray);
> >  createCanvas(600,600, WEBGL);
> >  textureMode(NORMAL);
> >  noStroke();
> >  shader(mosaicShader);
> >  
> >  //Background image selector
> >  BGselector = createSelect();
> >  BGselector.position(10, 10);
> >  BGselector.option("mandrill");
> >  BGselector.option("colormap");
> >  //Symbols image selector
> >  Symbolsselector = createSelect();
> >  Symbolsselector.position(90, 10);
> >  Symbolsselector.option("shrek");
> >  Symbolsselector.option("paintings");
> >  Symbolsselector.option("landscapes");
> >  Symbolsselector.option("bee-movie");
> >  
> >  mosaicShader.setUniform('parts', gif.numFrames());
> >
> >  //Exportar el arreglo de valores rgb a un .json
> >  //createStringDict(rgbArray).saveJSON("rgbArray");
> >  
> >  mosaicShader.setUniform('image',image);
> >  //Se carga la imagen con todas las texturas
> >  mosaicShader.setUniform('symbols',mosaic);
> >  //Se ingresa la cantidad de texturas presentes en la imagen
> >  
> >  mosaicShader.setUniform('rgbValues',rgbArray);
> >  mosaicShader.setUniform('resolution',resolution);
> >  debug = true;
> >  luma = true;
> >  mosaicShader.setUniform('debug',debug);
> >  mosaicShader.setUniform('luma',luma);
> >}
> >
> >
> >
> >function draw() {
> >  background(33);
> >  BGselector.changed(BGImageSelectEvent);
> >  Symbolsselector.changed(GIFImageSelectEvent);
> >  cover(true);
> >}
> >
> >function BGImageSelectEvent() {
> >  let nameImage = BGselector.value();
> >  image = BGoption.get(nameImage);
> >  mosaicShader.setUniform("image",image);
> >  // console.log(kernel);
> >  redraw();
> >}
> >
> >function GIFImageSelectEvent() {
> >  let nameImage = Symbolsselector.value();
> >  mosaic = Symbolsoption.get(nameImage);
> >  gif = GIFoption.get(nameImage);
> >  rgbArrayObj = JSONoption.get(nameImage);
> >  rgbArray = [];
> >  for(let e = 0; e < Object.keys(rgbArrayObj).length; e++){
> >    rgbArray.push(rgbArrayObj[e]);
> >  }
> >  mosaicShader.setUniform('rgbValues',rgbArray);
> >  mosaicShader.setUniform('parts',gif.numFrames());
> >  mosaicShader.setUniform("symbols",mosaic);
> >  // console.log(kernel);
> >  redraw();
> >}
> >
> >function cover(texture = false){
> >  beginShape();
> >  if(texture){
> >    vertex(-width / 2, -height /2, 0, 0, 0);
> >    vertex( width / 2, -height /2, 0, 1, 0);
> >    vertex( width / 2, height /2, 0, 1, 1);
> >    vertex( -width / 2, height /2, 0, 0, 1);
> >  } else {
> >    vertex(-width / 2, -height /2, 0);
> >    vertex( width / 2, -height /2, 0);
> >    vertex( width / 2, height /2, 0);
> >    vertex( -width / 2, height /2, 0);
> >  }
> >  endShape(CLOSE);
> >}
> >
> >function keyPressed(){
> >  if(key === 'd'){
> >    debug = !debug;
> >    mosaicShader.setUniform('debug',debug);
> >  }
> >  if(key === 'g'){
> >    luma = !luma;
> >    mosaicShader.setUniform('luma',luma);
> >  }
> >}
> > ```

## Mosaic (RGB Distance) on Video

Double click for play/pause the video:

> :Tabs
> > :Tab title=sketch
> >
> > > :P5 sketch=/docs/sketches/hardware/mosaic/w2_videomosaic.js, width=700, height=600 
> 
> > :Tab title=code
> > 
> > ```js | w2_videomosaic.js
> >let gif;
> >let vid;
> >let mosaic;
> >let cntImages = 0;
> >let bright;
> >var mosaicShader;
> >var image;
> >var symbol1, symbol2, symbols;
> >var debug;
> >var luma;
> >var maxWidePixels = 15500 ; //Limite de ancho del mosaico. Depende de la GPU
> >var speedAlg = 1; //Velocidad del algoritmo que saca el promedio de RGB
> >var resolution = 80; //cantidad de cuadros
> >let rgbArray = [];
> >let BGoption= new Map();
> >let BGselector;
> >//Preloads all images that are options in the selector
> >var mandrillImage;
> >var colormapImage;
> >var rgbArrayObj;
> >
> >let Symbolsoption = new Map();
> >let Symbolsselector;
> >//Preloads all images that are options in the selector
> >var shrekImage;
> >var paintingsImage;
> >var landscapesImage;
> >var beeMovieImage;
> >let GIFoption = new Map();
> >//Preloads all images that are options in the selector
> >var GIFshrek;
> >var GIFpaintings;
> >var GIFlandscapes;
> >var GIFbeeMovie;
> >let JSONoption = new Map();
> >//Preloads all images that are options in the selector
> >var JSONshrek;
> >var JSONpaintings;
> >var JSONlandscapes;
> >var JSONbeeMovie;
> >//Buttons and Inputs
> >var resInput;
> >var setResButton;
> >var debugButton;
> >var lumaButton;
> >var fpsButton;
> >var fpsInput;
> >var setFpsButton;
> >//Offset
> >let rightOffset = 100;
> >
> >function preload(){
> >  image = loadImage("/vc/docs/sketches/hardware/mosaic/images/mandrill.png");
> >  //Images: images/colormap.png, images/mandrill.png
> >  mandrillImage = loadImage("/vc/docs/sketches/hardware/mosaic/images/mandrill.png");
> >  colormapImage = loadImage("/vc/docs/sketches/hardware/mosaic/images/colormap.png");
> >  BGoption.set("mandrill",mandrillImage);
> >  BGoption.set("colormap",colormapImage);
> >  shrekImage = loadImage("/vc/docs/sketches/hardware/mosaic/gifs/generated/shrek.png");
> >  paintingsImage = loadImage("/vc/docs/sketches/hardware/mosaic/gifs/generated/paintings.png");
> >  landscapesImage = loadImage("/vc/docs/sketches/hardware/mosaic/gifs/generated/landscapes.png");
> >  beeMovieImage = loadImage("/vc/docs/sketches/hardware/mosaic/gifs/generated/bee-movie.png");
> >  Symbolsoption.set("shrek",shrekImage);
> >  Symbolsoption.set("paintings",paintingsImage);
> >  Symbolsoption.set("landscapes",landscapesImage);
> >  Symbolsoption.set("bee-movie",beeMovieImage);
> >  GIFshrek = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/shrek.gif');
> >  GIFpaintings = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/paintings.gif');
> >  GIFlandscapes = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/landscapes.gif');
> >  GIFbeeMovie = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/bee-movie.gif');
> >  GIFoption.set("shrek",GIFshrek);
> >  GIFoption.set("paintings",GIFpaintings);
> >  GIFoption.set("landscapes",GIFlandscapes);
> >  GIFoption.set("bee-movie",GIFbeeMovie);
> >  JSONshrek = loadJSON('/vc/docs/sketches/hardware/mosaic/gifs/generated/shrek.json');
> >  JSONpaintings = loadJSON('/vc/docs/sketches/hardware/mosaic/gifs/generated/paintings.json');
> >  JSONlandscapes = loadJSON('/vc/docs/sketches/hardware/mosaic/gifs/generated/landscapes.json');
> >  JSONbeeMovie = loadJSON('/vc/docs/sketches/hardware/mosaic/gifs/generated/bee-movie.json');
> >  JSONoption.set("shrek",JSONshrek);
> >  JSONoption.set("paintings",JSONpaintings);
> >  JSONoption.set("landscapes",JSONlandscapes);
> >  JSONoption.set("bee-movie",JSONbeeMovie);
> >  //Default values at the beggining
> >  image = loadImage('/vc/docs/sketches/hardware/mosaic/images/mandrill.png');
> >  mosaicShader = loadShader('/vc/docs/sketches/hardware/mosaic/shader.vert','/vc/docs/sketches/hardware/mosaic/videomosaic.frag');
> >  //gifs: gifs/shrek.gif, gifs/paintings.gif, gifs/landscapes.gif, gifs/bee-movie.gif
> >  gif = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/shrek.gif');
> >  rgbArrayObj = loadJSON('/vc/docs/sketches/hardware/mosaic/gifs/generated/shrek.json');
> >  mosaic = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/generated/shrek.png');
> >  console.log("rgbArrayObj",rgbArrayObj);
> >  
> >}
> >
> >function setup() {
> >  for(let e = 0; e < Object.keys(rgbArrayObj).length; e++){
> >    rgbArray.push(rgbArrayObj[e]);
> >  }
> >  //console.log("rgbArray",rgbArray);
> >  createCanvas(600 + rightOffset,600, WEBGL);
> >  textureMode(NORMAL);
> >  noStroke();
> >  shader(mosaicShader);
> >  
> >  vid = createVideo(["/vc/docs/sketches/fingers.mov", "/vc/docs/sketches/fingers.webm"]);
> >  vid.stop();
> >  vid.hide();
> >
> >  //Background image selector
> >  BGselector = createSelect();
> >  BGselector.position(width - rightOffset + 10, 10);
> >  BGselector.size(90, 20);
> >  BGselector.option("mandrill");
> >  BGselector.option("colormap");
> >  //Symbols image selector
> >  Symbolsselector = createSelect();
> >  Symbolsselector.position(width - rightOffset + 10, 40);
> >  Symbolsselector.size(90, 20);
> >  Symbolsselector.option("shrek");
> >  Symbolsselector.option("paintings");
> >  Symbolsselector.option("landscapes");
> >  Symbolsselector.option("bee-movie");
> >  //Input and Button to set Resolution
> >  resInput = createInput("80");
> >  resInput.position(width - rightOffset + 10, 70);
> >  resInput.size(40, 20);
> >  setResButton = createButton('set');
> >  setResButton.position(width - rightOffset + 60, 70);
> >  setResButton.size(40, 20);
> >  setResButton.mousePressed(changeResolution);
> >  debugButton = createButton('debug');
> >  debugButton.position(width - rightOffset + 10, 100);
> >  debugButton.size(80, 20);
> >  lumaButton = createButton('luma');
> >  lumaButton.position(width - rightOffset + 10, 130);
> >  lumaButton.size(80, 20);
> >  frameRate(120);
> >  fpsInput = createInput("120");
> >  fpsInput.position(width - rightOffset + 10, 160);
> >  fpsInput.size(40, 20);
> >  setFpsButton = createButton('fps');
> >  setFpsButton.position(width - rightOffset + 60, 160);
> >  setFpsButton.size(40, 20);
> >  fpsButton = createButton('fps');
> >  fpsButton.position(width - rightOffset + 10, 190);
> >  fpsButton.size(80, 20);
> >  
> >  mosaicShader.setUniform('parts', gif.numFrames());
> >
> >  //Exportar el arreglo de valores rgb a un .json
> >  //createStringDict(rgbArray).saveJSON("rgbArray");
> >  
> >  mosaicShader.setUniform('image',vid);
> >  //Se carga la imagen con todas las texturas
> >  mosaicShader.setUniform('symbols',mosaic);
> >  //Se ingresa la cantidad de texturas presentes en la imagen
> >  
> >  mosaicShader.setUniform('rgbValues',rgbArray);
> >  mosaicShader.setUniform('resolution',resolution);
> >  debug = true;
> >  luma = true;
> >  mosaicShader.setUniform('debug',debug);
> >  mosaicShader.setUniform('luma',luma);
> >}
> >
> >function draw() {
> >  background(33);
> >  mosaicShader.setUniform('image',vid);
> >  BGselector.changed(BGImageSelectEvent);
> >  Symbolsselector.changed(GIFImageSelectEvent);
> >  debugButton.mousePressed(mosaicMode);
> >  lumaButton.mousePressed(toggleLuma);
> >  setFpsButton.mousePressed(changeFPS);
> >  updateFPS();
> >  cover(true);
> >}
> >
> >function changeFPS(){
> >  frameRate(fpsInput.value());
> >}
> >
> >let savedMillis = 1000;
> >let savedFPS = 0;
> >function updateFPS(){
> >  let decimalMillis = millis() % 1000;
> >  let fps = 0;
> >  if(decimalMillis < savedMillis){
> >    savedMillis = decimalMillis;
> >    fps = savedFPS + frameCount;
> >    fpsButton.html(fps);
> >    savedFPS = -frameCount;
> >  } else {
> >    savedMillis = decimalMillis;
> >  }
> >  
> >}
> >
> >function toggleLuma() {
> >  if (luma) {
> >    lumaButton.html('avg');
> >  } else {
> >    lumaButton.html('luma');
> >  }
> >  lumaMode();
> >}
> >
> >function mosaicMode(){
> >  debug = !debug;
> >  mosaicShader.setUniform("debug",debug);
> >}
> >
> >function lumaMode(){
> >  luma = !luma;
> >  mosaicShader.setUniform("luma",luma);
> >}
> >
> >
> >function changeResolution(){
> >  const newRes = parseInt(resInput.value());
> >  mosaicShader.setUniform("resolution", newRes);
> >}
> >
> >let isPlaying = false;
> >function doubleClicked(){
> >  if(isPlaying){
> >    isPlaying = !isPlaying
> >    vid.stop();
> >  } else {
> >    isPlaying = !isPlaying
> >    vid.loop();
> >  }
> >}
> >
> >function BGImageSelectEvent() {
> >  let nameImage = BGselector.value();
> >  image = BGoption.get(nameImage);
> >  mosaicShader.setUniform("image",image);
> >  // console.log(kernel);
> >  redraw();
> >}
> >
> >function GIFImageSelectEvent() {
> >  let nameImage = Symbolsselector.value();
> >  mosaic = Symbolsoption.get(nameImage);
> >  gif = GIFoption.get(nameImage);
> >  rgbArrayObj = JSONoption.get(nameImage);
> >  rgbArray = [];
> >  for(let e = 0; e < Object.keys(rgbArrayObj).length; e++){
> >    rgbArray.push(rgbArrayObj[e]);
> >  }
> >  mosaicShader.setUniform('rgbValues',rgbArray);
> >  mosaicShader.setUniform('parts',gif.numFrames());
> >  mosaicShader.setUniform("symbols",mosaic);
> >  // console.log(kernel);
> >  redraw();
> >}
> >
> >function cover(texture = false){
> >  beginShape();
> >  if(texture){
> >    vertex(-width / 2, -height /2, 0, 0, 0);
> >    vertex( width / 2 - rightOffset, -height /2, 0, 1, 0);
> >    vertex( width / 2 - rightOffset, height /2, 0, 1, 1);
> >    vertex( -width / 2, height /2, 0, 0, 1);
> >  } else {
> >    vertex(-width / 2, -height /2, 0);
> >    vertex( width / 2 - rightOffset, -height /2, 0);
> >    vertex( width / 2 - rightOffset, height /2, 0);
> >    vertex( -width / 2, height /2, 0);
> >  }
> >  endShape(CLOSE);
> >}
> >
> >function keyPressed(){
> >  if(key === "d"){
> >    mosaicMode();
> >  }
> >  if(key === "g"){
> >    lumaMode();
> >  }
> >}
> > ```

# References

+ [Photographic mosaic](https://en.wikipedia.org/wiki/Photographic_mosaic)
+ [Photo mosaic challenge](https://www.youtube.com/watch?v=nnlAH1zDBDE)
+ [History of Photo Mosaics](https://digitalartform.com/2017/01/05/history-of-photo-mosaics/)

> :ToCPrevNext
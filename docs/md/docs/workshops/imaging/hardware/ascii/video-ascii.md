<h1 align="center">ASCII Art on Video</h1>

# Problem statement

Using specialized hardware like an integrated or dedicated GPU, implement a sketch that converts a sample image into a grid composed of a set of characters. 

# Background

## Spatial Coherence

We are using the original sketch of spatial coherence seen in the asynchronous class as the starting point of all this sketches of mosaic-like processing, since it gives a very straight-forward answer to the questions of how to divide evenly a given texture, by multiplying the texture for a predefined resolution; and how to choose a representative color for all the superpixels generated, that in all cases, is given by the top right pixel on every section, because the pre-built function floor() is used in the fragment shader.  

![floor_impl](/docs/sketches/floor_impl.png)

The benefit of multiplying the initial texture for an integer number, is to have the same amount of pixels to choose the representative pixel, given that now, if we divide in the same integer the image, we get a texture of the same size of orginal image but for every segment in the texture. The next step is to choose a the position of that pixel in every segment.

![params_mandrill](/docs/sketches/params_mandrill.png)

As we may noted by now, the floor function will keep only the integer equal or below this segment of the texture coordinates, which graphically would be equivalent to the top right pixel of every section, because for every segment is equivalent to only give the coordinated 0,0 for all texture, which only draws this corresponding pixel in all the segment: 

![repr_pixel_result](/docs/sketches/repr_pixel_result.png)

## Grayscale (Average / Luma) Proximity

For the mosaics of a set of ASCII characters, or characters en general, we look on the opacity of every image in the image set. The main idea is to send one single texture with all the textures of characters, ordered from darkest to lightest, and with the superpixel color computed in the fragment shader, take the most accurate texture in the set.

### Pre-processing

To make the ordering of the source images, we created a complementary sketch that takes a gif image containing all the textures for the texture set and organizes them from the most obscure to the most bright image, which gives complete textures like the following (made with symbols of chess pieces):

![ordered_chess](/docs/sketches/ordered_chess.png)

As we can see, the texture containing all textures may have more that one row, and that is given by a constant value defining the maximum of columns in the fragment shader, this is for preventing too wide textures to be loading in the shader, which could cause errors. The following is the code for the pre-processing program:

> :Tabs
> > :Tab title = Instructions
> > > To display the code for ascii pre-processing, click the code tab.
>
> > :Tab title = code
> >```js | preprocess_asciimosaic.js
> >let gif;
> >let mosaic;
> >var cntImagesX = 0;
> >var cntImagesY = [];
> >var speedAlg = 1; //Velocidad del algoritmo
> >var partsX = 78; //Limite en donde se comienza a dibujar el mosaico en la siguiente linea
> >
> >function preload(){
> >  // gifs/arial.gif, gifs/erica-one.gif
> >  gif = loadImage('gifs/chess.gif'); //Just select gif to convert it to a mosaic to implement
> >  
> >}
> >
> >function setup() {
> >  let rgbArray = getOrganizedSymbolsImageFromGIF(speedAlg);
> >  console.log("parts: "+gif.numFrames());
> >}
> >
> >function getOrganizedSymbolsImageFromGIF(speed,maxFrames = gif.numFrames()){
> >  const tempValues = [];
> >  setNewMosaic(Math.min(maxFrames,partsX));
> >  for(let frameNumber = 0 ; frameNumber < maxFrames;frameNumber++){
> >     gif.setFrame(frameNumber);
> >      let temp = 0;
> >      for (let i = 0; i < gif.width; i += speed) {
> >       for (let j = 0; j < gif.height; j += speed) {
> >          let c = gif.get(i,j);    
> >          temp += (c[0] + c[1] + c[2]);
> >       }
> >     }
> >     //console.log("temp: "+temp); 
> >     tempValues.push(temp);  
> >   }
> >   var min = Math.min(...tempValues);
> >   var max = Math.max(...tempValues);
> >   var maxFinal = max + 1 ;
> >   var posX = 0;
> >   while(min != maxFinal){
> >     //console.log("tempValues: "+tempValues);
> >     //console.log("length: "+tempValues.length);
> >     //console.log("min: "+min); 
> >     var ind = tempValues.indexOf(min);
> >     addBelowToMosaic(posX, ind);
> >     posX++;
> >     if(posX % partsX == 0){
> >       posX = 0;
> >     }
> >     tempValues.splice(ind, 1,maxFinal); 
> >     min = Math.min(...tempValues);
> >   }
> >   mosaic.save('mosaic', 'png');
> >   cntImages = 0;
> >}
> >
> >function setNewMosaic(w){
> >  cntImagesX = w;
> >  mosaic = createImage(gif.width * w, gif.height);
> >  for(let i = 0;i < w;i++){
> >    cntImagesY.push(0);
> >  }
> >}
> >
> >function addBelowToMosaic(pos, index){
> >   gif.setFrame(index);
> >   var maxY = Math.max(...cntImagesY);
> >   let img;
> >   if(cntImagesY[pos] == maxY){
> >     img = createImage(gif.width * cntImagesX, gif.height * (maxY+1));
> >   } else{
> >     img = createImage(gif.width * cntImagesX, gif.height * (maxY));
> >   }
> >   img.copy(mosaic,0,0,mosaic.width,mosaic.height,0,0,mosaic.width,mosaic.height);
> >   if(cntImagesY[pos] == maxY){
> >     mosaic = createImage(gif.width * cntImagesX, gif.height * (maxY+1));
> >   } else{
> >     mosaic = createImage(gif.width * cntImagesX, gif.height * (maxY));
> >   }
> >   img.copy(gif,0,0,gif.width,gif.height,gif.width * pos,gif.height * cntImagesY[pos],gif.width,gif.height);
> >   mosaic.copy(img,0,0,img.width,img.height,0,0,img.width,img.height); 
> >   cntImagesY[pos]++;
> >}
> >```

### RGB to Grayscale

Now, to convert the original RGB representative pixel into a grayscale value of opacity to match the set of textures, we implemented two algorithms inside the fragment shader: Luma and Average Grayscale.

Given that the luma formula is widely known to be more accurate to how to human eye sees differences in luminosity, we implemented this algorithm in the shader; and to contrast with a more naive approach, we also implemented the magnitude result of the average of luminosity of every channel (red, green, blue). This options could be changed in real-time in the sketch.

# Implementation

Video autoplay is disabled for better browser compatibility. In the right menu there is several useful indicators, like number of textures used, time ellapsed in seconds and fps and average fps through time. The debug and luma buttons also may be controlled by the keyboard pressing the "d" and "g" keys respectively. Also, it counts with many different options given by the selectors:

> :Tabs
> > :Tab title=sketch
> >
> > > :P5 sketch=/docs/sketches/hardware/asciimosaic/w2_asciivideo.js, width=700, height=600
> 
> > :Tab title=.js
> > 
> >```js | w2_asciivideo.js
> >let gif;
> >let vid;
> >let mosaic;
> >var mosaicShader;
> >var image;
> >var debug;
> >var luma;
> >var initialFPS = 120; //FPS iniciales del sketch
> >var resolution = 80; //cantidad de cuadros
> >let BGoption= new Map();
> >let BGselector;
> >let Symbolsoption = new Map();
> >let Symbolsselector;
> >let GIFoption = new Map();
> >//Video
> >let isPlaying = false;
> >//Buttons and Inputs
> >var playButton;
> >var resInput;
> >var numTexDiv;
> >var setResButton;
> >var debugButton;
> >var lumaButton;
> >var fpsButton;
> >var fpsDiv;
> >var avgfpsDiv;
> >var fpsInput;
> >var setFpsButton;
> >var secondsDiv;
> >//Reset 
> >var resetButton;
> >var resetTime = 0;
> >var resetFrame = 0;
> >//Offset
> >let rightOffset = 100;
> >
> >function preload(){
> >  // gifs/arial.gif, gifs/erica-one.gif
> >  Symbolsselector = createSelect();
> >  setSymbolsAndGIF("religions");
> >  setSymbolsAndGIF("chess");
> >  setSymbolsAndGIF("arial+erica");
> >  setSymbolsAndGIF("arial");
> >  setSymbolsAndGIF("erica-one");
> >  setSymbolsAndGIF("helvetica");
> >  setSymbolsAndGIF("comic-sans"); 
> >  setSymbolsAndGIF("all-fonts"); 
> >  setSymbolsAndGIF("all-images");  
> >  
> >  //Default values at the beggining
> >  mosaicShader = loadShader("/vc/docs/sketches/hardware/asciimosaic/shader.vert","/vc/docs/sketches/hardware/asciimosaic/asciimosaic.frag");
> >  mosaic = loadImage("/vc/docs/sketches/hardware/asciimosaic/gifs/generated/religions.png");
> >  gif = loadImage("/vc/docs/sketches/hardware/asciimosaic/gifs/religions.gif");
> >}
> >
> >function setup() {
> >  createCanvas(600 + rightOffset,600, WEBGL);
> >  textureMode(NORMAL);
> >  noStroke();
> >  shader(mosaicShader);
> >  //fingersVideo = createVideo(["/vc/docs/sketches/fingers.mov", "/vc/docs/sketches/soccer.webm"]);
> >  BGselector = createSelect();
> >  setBGVideo("fingers");
> >  setBGVideo("soccer");
> >  //Default
> >  vid = createVideo(["/vc/docs/sketches/fingers.mov","/vc/docs/sketches/fingers.webm"]);
> >  vid.stop();
> >  vid.hide();
> >
> >  rightMenu();
> >
> >  mosaicShader.setUniform("image",vid);
> >  //Se carga la imagen con todas las texturas
> >  mosaicShader.setUniform('parts',gif.numFrames());
> >  mosaicShader.setUniform("symbols",mosaic);  
> >  mosaicShader.setUniform("resolution",resolution);
> >  debug = true;
> >  luma = true;
> >  mosaicShader.setUniform("debug",debug);
> >  mosaicShader.setUniform("luma",luma);
> >
> >}
> >
> >function draw() {
> >  background(33);
> >  mosaicShader.setUniform('image',vid);
> >  BGselector.changed(BGVideoSelectEvent);
> >  Symbolsselector.changed(GIFImageSelectEvent);
> >  debugButton.mousePressed(mosaicMode);
> >  lumaButton.mousePressed(toggleLuma);
> >  setFpsButton.mousePressed(changeFPS);
> >  playButton.mousePressed(playPauseVideo);
> >  resetButton.mousePressed(resetSeconds);
> >  updateFPS();
> >  updateNumTextures();
> >  cover(true);
> >}
> >
> >function resetSeconds(){
> >  resetTime = millis();
> >  resetFrame = frameCount;
> >}
> >
> >function setBGVideo(name){
> >  var video = createVideo(["/vc/docs/sketches/"+name+".mov","/vc/docs/sketches/"+name+".webm"]);
> >  video.hide();
> >  BGoption.set(name,video);
> >  BGselector.option(name);
> >}
> >
> >function setSymbolsAndGIF(name){
> >  var imag = loadImage("/vc/docs/sketches/hardware/asciimosaic/gifs/generated/"+name+".png");
> >  Symbolsoption.set(name,imag);
> >  Symbolsselector.option(name);
> >  var gifImg = loadImage("/vc/docs/sketches/hardware/asciimosaic/gifs/"+name+".gif");
> >  GIFoption.set(name,gifImg);
> >}
> >
> >function updateNumTextures(){
> >  numTexDiv.html(gif.numFrames());
> >}
> >
> >function rightMenu(){
> >  //Background image selector
> >  let ySpace = 20;
> >  playButton = createButton('play');
> >  playButton.position(width - rightOffset + 17, ySpace);
> >  playButton.size(80, 25);
> >  ySpace += 15;
> >  let vidSetText = createP("Videos Set");
> >  setText(vidSetText,90,20,width - rightOffset + 10,ySpace,'white',14);
> >  ySpace += 30;
> >  BGselector.position(width - rightOffset + 10, ySpace);
> >  BGselector.size(90, 20);
> >  ySpace += 10;
> >  let fontSetText = createP("Fonts Set");
> >  setText(fontSetText,90,20,width - rightOffset + 10,ySpace,'white',14);
> >  ySpace += 30;
> >  //Symbols image selector
> >  Symbolsselector.position(width - rightOffset + 10, ySpace);
> >  Symbolsselector.size(90, 20);
> >
> >  ySpace += 10;
> >  let numTexText = createP("Num. Textures:");
> >  setText(numTexText,100,20,width - rightOffset+7,ySpace,'white',12);
> >  ySpace += 30;
> >  numTexDiv = createDiv(gif.numFrames());
> >  setDiv(numTexDiv,40,20,width - rightOffset + 35,ySpace,'white',20,0,2);
> >  ySpace += 30;
> >  //Input and Button to set Resolution
> >  resInput = createInput(resolution);
> >  resInput.position(width - rightOffset + 10, ySpace);
> >  resInput.size(40, 20);
> >  setResButton = createButton('set');
> >  setResButton.position(width - rightOffset + 60, ySpace);
> >  setResButton.size(40, 25);
> >  ySpace += 30;
> >  setResButton.mousePressed(changeResolution);
> >  //Debug and Luma Buttons
> >  debugButton = createButton('debug');
> >  debugButton.position(width - rightOffset + 17, ySpace);
> >  debugButton.size(80, 25);
> >  lumaButton = createButton('luma');
> >  ySpace += 30;
> >  lumaButton.position(width - rightOffset + 17, ySpace);
> >  lumaButton.size(80, 25);
> >  ySpace += 30;
> >  frameRate(initialFPS);
> >  fpsInput = createInput(initialFPS);
> >  fpsInput.position(width - rightOffset + 10, ySpace);
> >  fpsInput.size(40, 20);
> >  setFpsButton = createButton('fps');
> >  setFpsButton.position(width - rightOffset + 60, ySpace);
> >  setFpsButton.size(40, 25);
> >  ySpace += 10;
> >  let fpsText = createP("FPS");
> >  setText(fpsText,75,20,width - rightOffset + 20,ySpace,'white',24);
> >  ySpace += 50;
> >  fpsDiv = createDiv(0);
> >  setDiv(fpsDiv,50,50,width - rightOffset + 25,ySpace,'white',30,15,15);
> >  ySpace += 60;
> >  let avgfpsText = createP("AVG FPS");
> >  setText(avgfpsText,77,20,width - rightOffset + 20,ySpace,'white',14);
> >  ySpace += 30;
> >  avgfpsDiv = createDiv(0);
> >  setDiv(avgfpsDiv,60,30,width - rightOffset + 25,ySpace,'white',20,8,8);
> >  ySpace += 30;
> >  let secondsText = createP("Time (s)");
> >  setText(secondsText,77,20,width - rightOffset + 20,ySpace,'white',14);
> >  ySpace += 30;
> >  secondsDiv = createDiv(0);
> >  setDiv(secondsDiv,60,30,width - rightOffset + 25,ySpace,'white',20,8,8);
> >  ySpace += 50;
> >  resetButton = createButton('reset');
> >  resetButton.position(width - rightOffset + 17, ySpace);
> >  resetButton.size(80, 25);
> >}
> >
> >function setDiv(divElem,sizeX,sizeY,x,y,BGcolor,Fontsize,padTop,padLeft){
> >  divElem.position(x, y);
> >  divElem.style('background-color', BGcolor);
> >  divElem.style('font-family', 'Helvetica');
> >  divElem.style('padding-top', padTop + 'px');
> >  divElem.style('padding-left', padLeft + 'px');
> >  divElem.style('font-size',Fontsize + 'px');
> >  divElem.size(sizeX, sizeY);
> >}
> >
> >function setText(textElem,sizeX,sizeY,x,y,color,size){
> >  textElem.size(sizeX, sizeY);
> >  textElem.position(x, y);
> >  textElem.style('color', color);
> >  textElem.style('text-align', 'center');
> >  textElem.style('font-family', 'Helvetica');
> >  textElem.style('font-size', size + 'px');
> >}
> >
> >function changeFPS(){
> >  console.log("fpsInput.value(): "+fpsInput.value())
> >  frameRate(int(fpsInput.value()));
> >}
> >
> >let savedMillis = 1000;
> >let savedFPS = 0;
> >function updateFPS(){
> >  let decimalMillis = millis() % 1000;
> >  let fps = 0;
> >  if(decimalMillis < savedMillis){
> >    updateAvgFPS();
> >    savedMillis = decimalMillis;
> >    fps = savedFPS + frameCount;
> >    fpsDiv.html(fps);
> >    if(fps <= 15){
> >      fpsDiv.style('color', '#FF0000');
> >    } else{
> >      fpsDiv.style('color', '#000000');
> >      
> >    }
> >    savedFPS = -frameCount;
> >  } else {
> >    savedMillis = decimalMillis;
> >  }
> >  
> >}
> >
> >function updateAvgFPS(){
> >  let s = (millis() - resetTime) / 1000;
> >  let avg = Math.round(((frameCount - resetFrame )/ s)*100)/100;
> >  avgfpsDiv.html(avg);
> >  secondsDiv.html(Math.floor(s));
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
> >function changeResolution(){
> >  const newRes = parseInt(resInput.value());
> >  mosaicShader.setUniform("resolution", newRes);
> >}
> >
> >
> >function playPauseVideo(){
> >  if(isPlaying){
> >    isPlaying = !isPlaying
> >    vid.stop();
> >    playButton.html("play");
> >  } else {
> >    isPlaying = !isPlaying
> >    vid.loop();
> >    playButton.html("pause");
> >  }
> >}
> >
> >function BGVideoSelectEvent() {
> >  let nameVideo = BGselector.value();
> >  vid = BGoption.get(nameVideo);
> >  mosaicShader.setUniform("image",vid);
> >  if(isPlaying){
> >    playPauseVideo();
> >  }
> >}
> >
> >function GIFImageSelectEvent() {
> >  let nameImage = Symbolsselector.value();
> >  mosaic = Symbolsoption.get(nameImage);
> >  gif = GIFoption.get(nameImage);
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
> >```
> 
> > :Tab title=.frag
> >
> >```glsl | asciimosaic.frag
> >precision mediump float;
> >#define MOSAIC_WIDTH 78.0
> >// image is sent by the sketch
> >uniform sampler2D image;
> >//symbols texture is sent by the sketch
> >uniform sampler2D symbols;
> >// The number of textures also comes from the sketch
> >uniform int parts;
> >// toggles image display
> >uniform bool debug;
> >//toggles luma grayscale
> >uniform bool luma;
> >// target horizontal & vertical resolution
> >uniform float resolution;
> >
> >
> >// interpolated color (same name and type as in vertex shader)
> >varying vec4 vVertexColor;
> >// interpolated texcoord (same name and type as in vertex shader)
> >varying vec2 vTexCoord;
> >
> >
> >void main(){
> >	// remap symbolCoord to [0.0, resolution] in R
> >	vec2 symbolCoord = vTexCoord * resolution;
> >	// remap imageCoord to [0.0, 1.0] in R
> >	vec2 imageCoord = floor(symbolCoord);
> >	// remap symbolCoord to [0.0, 1.0] in R
> >	symbolCoord = symbolCoord - imageCoord;
> >	// remap imageCoord to [0.0, 1.0] in R
> >	imageCoord = imageCoord * vec2(1.0) / vec2(resolution);
> >	// get vec4 color hash index
> >	vec4 index = texture2D(image, imageCoord);
> >	//gl_FragColor = (debug ? index : texture2D(symbol1, symbolCoord)) * vVertexColor;
> >	if(debug){
> >		gl_FragColor = index * vVertexColor;
> >	} else {
> >		float parts_f = float(parts);
> > 		float div = 1.0 / parts_f;  //Computes de division of the texture symbols 
> >		float gray = 0.0;
> >		if(luma){
> >			//Luma grayscale
> >			gray = (index.x * 0.3) + (index.y * 0.59) + (index.z * 0.11); //Computes the magnitude of the vector
> >		} else {
> >			//Average grayscale
> >			gray = (index.x + index.y + index.z) / 3.0; //Computes the magnitude of the vector 
> >		}
> >			float partsY_f = ceil(parts_f / MOSAIC_WIDTH);
> >			float dY = 1.0 / partsY_f;
> >			for(int i = 0; i < 100000; i++){ //Loop to a very large number
> >				if(i == parts) break;
> >				float i_f = float(i);
> >				float i_fMod = mod(i_f,MOSAIC_WIDTH);
> >				float i_fY = floor(i_f / MOSAIC_WIDTH);
> >				float minXDivs = min(parts_f, MOSAIC_WIDTH); 
> >				float dX = 1.0 / minXDivs;
> >				if( (gray >= div * i_f) && (gray < div * (i_f + 1.0))){ //If magnitude is inside a division of the texture symbols
> >					//Divides the coords to only print one part of the image
> >					//And after sums a vector that begin to print in the actual division
> >					gl_FragColor = texture2D(symbols, (symbolCoord / vec2(minXDivs,partsY_f)) + vec2(dX*i_fMod,dY*i_fY) ) * vVertexColor;
> >				}
> >			}		
> >	}
> >}
> >```
> 
> > :Tab title=.vert
> >
> >```glsl | shader.vert
> >// Precision seems mandatory in webgl
> >precision highp float;
> >
> >// 1. Attributes and uniforms sent by p5.js
> >
> >// Vertex attributes and some uniforms are sent by
> >// p5.js following these naming conventions:
> >// https://github.com/processing/p5.js/blob/main/contributor_docs/webgl_mode_architecture.md
> >
> >// 1.1. Attributes
> >// vertex position attribute
> >attribute vec3 aPosition;
> >
> >// vertex texture coordinate attribute
> >attribute vec2 aTexCoord;
> >
> >// vertex color attribute
> >attribute vec4 aVertexColor;
> >
> >// 1.2. Matrix uniforms
> >
> >// The vertex shader should project the vertex position into clip space:
> >// vertex_clipspace = vertex * projection * view * model (see the gl_Position below)
> >// Details here: http://visualcomputing.github.io/Transformations
> >
> >// Either a perspective or an orthographic projection
> >uniform mat4 uProjectionMatrix;
> >
> >// modelview = view * model
> >uniform mat4 uModelViewMatrix;
> >
> >// B. varying variable names are defined by the shader programmer:
> >// vertex color
> >varying vec4 vVertexColor;
> >
> >// vertex texcoord
> >varying vec2 vTexCoord;
> >
> >void main() {
> >  // copy / interpolate color
> >  vVertexColor = aVertexColor;
> >  // copy / interpolate texcoords
> >  vTexCoord = aTexCoord;
> >  // vertex projection into clipspace
> >  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
> >}
> >```

# Benchmarking

# References

+ [ASCII art](https://en.wikipedia.org/wiki/ASCII_art)
+ [Future potentials for ASCII art](http://goto80.com/chipflip/06/)

> :ToCPrevNext
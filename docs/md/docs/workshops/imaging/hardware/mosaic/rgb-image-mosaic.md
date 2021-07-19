<h1 align="center">Image Mosaic from Vectorial Distance</h1>

# Problem statement

Using specialized hardware like an integrated or dedicated GPU, implement a sketch that converts a sample image into a grid composed of a set of images. 

# Background

## Spatial Coherence

We are using the original sketch of spatial coherence seen in the asynchronous class as the starting point of all this sketches of mosaic-like processing, since it gives a very straight-forward answer to the questions of how to divide evenly a given texture, by multiplying the texture for a predefined resolution; and how to choose a representative color for all the superpixels generated, that in all cases, is given by the top right pixel on every section, because the pre-built function floor() is used in the fragment shader.  

![floor_impl](/docs/sketches/floor_impl.png)

The benefit of multiplying the initial texture for an integer number, is to have the same amount of pixels to choose the representative pixel, given that now, if we divide in the same integer the image, we get a texture of the same size of orginal image but for every segment in the texture. The next step is to choose a the position of that pixel in every segment.

![params_mandrill](/docs/sketches/params_mandrill.png)

As we may noted by now, the floor function will keep only the integer equal or below this segment of the texture coordinates, which graphically would be equivalent to the top right pixel of every section, because for every segment is equivalent to only give the coordinated 0,0 for all texture, which only draws this corresponding pixel in all the segment: 

![repr_pixel_result](/docs/sketches/repr_pixel_result.png)

## RGB Vectorial Distance

For the mosaics of a set of images, one of the first approaches would be to find the most close image to the color computed in the fragment shader. So following this basic idea, now we will use an element in common that have both the set of images and the superpixel, that would be an RGB value. Clearly, for an image in the image set there is a lot of pixels and in consequence a lot of RGB values, so we will find the average values for the RGB values inside the image, and use it to compare it with the RGB value of the superpixel in the shader. 

### Pre-processing

Having to compare the RGB in the shader to a set of RGB values implies that a large array of RGB values has to be passed as an Uniform at some point. Also, the work of comparing one by one implies the there will be an additional for loop for to get the closest image to every superpixel. But the benefit lies in that with a little set of well distributed images, we could reach very accurate colors in the mosaic. 

The following is the code used to generate a image mosaic of fixed maximum width and the array containing all the RGB averages values for every image, saved in .json format:

> :Tabs
> > :Tab title = Instructions
> > > To display the code for mosaic RGB pre-processing, click the code tab.
>
> > :Tab title = code
> >```js | preprocess_rgbmosaic.js
> >let gif;
> >let mosaic;
> >var cntImagesX = 0;
> >var cntImagesY = [];
> >var speedAlg = 1; //Velocidad del algoritmo que saca el promedio de RGB
> >var resolution = 80; //cantidad de cuadros
> >var partsX = 78; //Limite en donde se comienza a dibujar el mosaico en la siguiente linea
> >
> >function preload(){
> >  // gifs/arial.gif, gifs/erica-one.gif
> >  gif = loadImage('gifs/wall-e36.gif');
> >  
> >}
> >
> >function setup() {
> >  //let rgbArray = getOrganizedSymbolsImageFromGIF(speedAlg);
> >  let rgbArray = getRGBArrayAndMosaicImageFromGIF(speedAlg);
> >  createStringDict(rgbArray).saveJSON("rgbArray");
> >  mosaic.save('mosaic', 'png');
> >  console.log("parts: "+gif.numFrames());
> >}
> >
> >function getRGBArrayAndMosaicImageFromGIF(speed,maxFrames = gif.numFrames()){
> >  const tempValues = [];
> >  var posX = 0;
> >  setNewMosaic(Math.min(maxFrames,partsX));
> >  for(let frameNumber = 0 ; frameNumber < maxFrames;frameNumber++){
> >     gif.setFrame(frameNumber);
> >      
> >      let r = 0,g = 0,b = 0;
> >      let cntPixels = 1;
> >      for (let i = 0; i < gif.width; i += speed) {
> >       for (let j = 0; j < gif.height; j += speed) {
> >          let c = gif.get(i,j);    
> >          //temp += (c[0] + c[1] + c[2]);
> >          r += c[0];
> >          g += c[1];
> >          b += c[2];
> >         cntPixels++;  
> >       }
> >     }
> >     r = r/(cntPixels*255);
> >     g = g/(cntPixels*255);
> >     b = b/(cntPixels*255);
> >     //let temp = [];
> >     //temp.push(r,g,b);
> >     //console.log("temp: "+temp); 
> >     //tempValues.push(temp);
> >     tempValues.push(r,g,b);
> >     //addToMosaic(frameNumber);
> >     addBelowToMosaic(posX, frameNumber);
> >     posX++;
> >     if(posX % partsX == 0){
> >       posX = 0;
> >     }
> >   }
> >   //console.log("tempValues: "+tempValues);
> >   //console.log("tempValues.length: "+tempValues.length);
> >   //mosaic.save('mosaic', 'png');
> >   cntImages = 0;
> >   return tempValues;
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

### Distance on every RGB array elements

![rgb_dist](/docs/sketches/rgb_dist.png)

The distance between two 3-dimensional vectors is given by the length of the black vector visible in the figure above. Because we want to know what is the minimum distante to the superpixel color, we have to complete one iteration on all the textures to find it. This may have a big impact on algorithm computational speed, because the number of operations that the program has to do increases in a no-linear form when number of textures increases. 

# Implementation

In the right menu there is several useful indicators, like number of textured used, time ellapsed in seconds and fps and average fps through time. Also, it counts with many different options given by the selectors:

> :Tabs
> > :Tab title=sketch
> >
> > > :P5 sketch=/docs/sketches/hardware/mosaic/w2_photomosaic.js, width=700, height=600 
> 
> > :Tab title=.js
> > 
> > ```js | w2_photomosaic.js
> >let gif;
> >let mosaic;
> >let rgbArray = [];
> >var mosaicShader;
> >var image;
> >var debug;
> >var luma;
> >var initialFPS = 120; //FPS iniciales del sketch
> >var resolution = 80; //cantidad de cuadros
> >let BGoption= new Map();
> >let BGselector;
> >//Preloads all images that are options in the selector
> >var mandrillImage;
> >var colormapImage;
> >var rgbArrayObj;
> >let Symbolsoption = new Map();
> >let Symbolsselector;
> >let GIFoption = new Map();
> >let JSONoption = new Map();
> >//Fonts
> >//Buttons and Inputs
> >var resInput;
> >var numTexDiv;
> >var setResButton;
> >var debugButton;
> >var fpsButton;
> >var fpsDiv;
> >var avgfpsDiv;
> >var fpsInput;
> >var setFpsButton;
> >var secondsDiv;
> >//Offset
> >let rightOffset = 100;
> >
> >function preload(){
> >  //Images: images/colormap.png, images/mandrill.png
> >  BGselector = createSelect();
> >  setBGImage("mandrill");
> >  setBGImage("monarch");
> >  setBGImage("lichtenstein");
> >  setBGImage("ara_macao");
> >  setBGImage("colormap");
> >
> >  Symbolsselector = createSelect();
> >  setSymbolsGIFAndJSON("spirited-away");
> >  setSymbolsGIFAndJSON("terminator");
> >  setSymbolsGIFAndJSON("wall-e");
> >  setSymbolsGIFAndJSON("bee-movie");
> >  setSymbolsGIFAndJSON("paintings36");
> >  setSymbolsGIFAndJSON("paintings81");
> >  setSymbolsGIFAndJSON("paintings128");
> >  setSymbolsGIFAndJSON("paintings192");
> >  setSymbolsGIFAndJSON("paintings288");
> >  //Default values at the beginning
> >  image = loadImage('/vc/docs/sketches/hardware/mosaic/images/mandrill.png');
> >  mosaicShader = loadShader('/vc/docs/sketches/hardware/mosaic/shader.vert','/vc/docs/sketches/hardware/mosaic/photomosaic.frag');
> >  //gifs: gifs/shrek.gif, gifs/paintings.gif, gifs/landscapes.gif, gifs/bee-movie.gif
> >  gif = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/spirited-away.gif');
> >  rgbArrayObj = loadJSON('/vc/docs/sketches/hardware/mosaic/gifs/generated/spirited-away.json');
> >  mosaic = loadImage('/vc/docs/sketches/hardware/mosaic/gifs/generated/spirited-away.png');
> >  //console.log("rgbArrayObj",rgbArrayObj);
> >  
> >}
> >
> >function setup() {
> >  for(let e = 0; e < Object.keys(rgbArrayObj).length; e++){
> >    rgbArray.push(rgbArrayObj[e]);
> >  }
> >  //console.log("rgbArray",rgbArray);
> >  createCanvas(600  + rightOffset,600, WEBGL);
> >  textureMode(NORMAL);
> >  noStroke();
> >  shader(mosaicShader);
> >  
> >  rightMenu();
> >  
> >  mosaicShader.setUniform('parts', gif.numFrames());
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
> >function draw() {
> >  background(33);
> >  BGselector.changed(BGImageSelectEvent);
> >  Symbolsselector.changed(GIFImageSelectEvent);
> >  debugButton.mousePressed(mosaicMode);
> >  setFpsButton.mousePressed(changeFPS);
> >  updateFPS();
> >  updateNumTextures();
> >  cover(true);
> >}
> >
> >function setBGImage(name){
> >  var imag = loadImage("/vc/docs/sketches/hardware/mosaic/images/"+name+".png");
> >  BGoption.set(name,imag);
> >  BGselector.option(name);
> >}
> >
> >function setSymbolsGIFAndJSON(name){
> >  var imag = loadImage("/vc/docs/sketches/hardware/mosaic/gifs/generated/"+name+".png");
> >  Symbolsoption.set(name,imag);
> >  Symbolsselector.option(name);
> >  var GIFvar = loadImage("/vc/docs/sketches/hardware/mosaic/gifs/"+name+".gif");
> >  GIFoption.set(name,GIFvar);
> >  var JSONvar = loadJSON("/vc/docs/sketches/hardware/mosaic/gifs/generated/"+name+".json");
> >  JSONoption.set(name,JSONvar);
> >}
> >
> >function updateNumTextures(){
> >  numTexDiv.html(gif.numFrames());
> >}
> >
> >function rightMenu(){
> >  //Background image selector
> >  let ySpace = 0;
> >  let vidSetText = createP("Images Set");
> >  setText(vidSetText,90,20,width - rightOffset + 10,ySpace,'white',14);
> >  ySpace += 30;
> >  BGselector.position(width - rightOffset + 10, ySpace);
> >  BGselector.size(90, 20);
> >  ySpace += 10;
> >  let fontSetText = createP("Sources Set");
> >  setText(fontSetText,90,20,width - rightOffset + 10,ySpace,'white',14);
> >  ySpace += 30;
> >  //Symbols image selector
> >  Symbolsselector.position(width - rightOffset + 10, ySpace);
> >  Symbolsselector.size(90, 20);
> >  ySpace += 10;
> >  let numTexText = createP("Num. Textures:");
> >  setText(numTexText,100,20,width - rightOffset+7,ySpace,'white',12);
> >  ySpace += 30;
> >  numTexDiv = createDiv(gif.numFrames());
> >  setDiv(numTexDiv,40,20,width - rightOffset + 35,ySpace,'white',20,0,2);
> >  ySpace += 30;
> >  //Input and Button to set Resolution
> >  resInput = createInput("80");
> >  resInput.position(width - rightOffset + 10, ySpace);
> >  resInput.size(40, 20);
> >  setResButton = createButton('set');
> >  setResButton.position(width - rightOffset + 60, ySpace);
> >  setResButton.size(40, 25);
> >  setResButton.mousePressed(changeResolution);
> >  ySpace += 30;
> >  
> >  //Debug and Luma Buttons
> >  debugButton = createButton('debug');
> >  debugButton.position(width - rightOffset + 17, ySpace);
> >  debugButton.size(80, 25);
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
> >  let s = millis() / 1000;
> >  let avg = Math.round((frameCount / s)*100)/100;
> >  avgfpsDiv.html(avg);
> >  secondsDiv.html(Math.floor(s));
> >}
> >
> >function mosaicMode(){
> >  debug = !debug;
> >  mosaicShader.setUniform("debug",debug);
> >}
> >
> >function changeResolution(){
> >  const newRes = parseInt(resInput.value());
> >  mosaicShader.setUniform("resolution", newRes);
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
> >}
> > ```
> 
> > :Tab title=.frag
> >
> >```glsl | photomosaic.frag
> >precision mediump float;
> >#define MOSAIC_WIDTH 78.0
> >//Set a constant to max number of textures
> >#define MAXTEXTURES 288
> >#define MAXTEXTURES_RGB MAXTEXTURES * 3
> >
> >// image is sent by the sketch
> >uniform sampler2D image;
> >//symbols texture is sent by the sketch
> >uniform sampler2D symbols;
> >// The number of textures also comes from the sketch
> >uniform int parts;
> >// toggles image display
> >uniform bool debug;
> >// target horizontal & vertical resolution
> >uniform float resolution;
> >
> >//Defines the rgb values for the symbols texture
> >uniform float rgbValues[MAXTEXTURES_RGB]; //Max number of data from textures
> >
> >// interpolated color (same name and type as in vertex shader)
> >varying vec4 vVertexColor;
> >// interpolated texcoord (same name and type as in vertex shader)
> >varying vec2 vTexCoord;
> >
> >//Declares function to be used in the program
> >int minDistIndex (vec3 rgbValue);
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
> >		vec3 values = index.xyz;
> >		int minIndex = 15;
> >		minIndex = minDistIndex(values);
> >		float partsY_f = ceil(parts_f / MOSAIC_WIDTH);
> >		float dY = 1.0 / partsY_f;
> >		for(int i = 0; i < MAXTEXTURES; i++){ 
> >			if(i == parts) break;
> >			float i_f = float(i);
> >			float i_fMod = mod(i_f,MOSAIC_WIDTH);
> >			float i_fY = floor(i_f / MOSAIC_WIDTH);
> >			float minXDivs = min(parts_f, MOSAIC_WIDTH); 
> >			float dX = 1.0 / minXDivs;
> >			if( minIndex == i ){ 
> >				//Divides the coords to only print one part of the image
> >				//And after sums a vector that begin to print in the actual division
> >				//gl_FragColor = texture2D(symbols, (symbolCoord / vec2(parts_f,1.0)) + vec2(div*i_f,0.0) ) * vVertexColor;
> >				gl_FragColor = texture2D(symbols, (symbolCoord / vec2(minXDivs,partsY_f)) + vec2(dX*i_fMod,dY*i_fY) ) * vVertexColor;
> >			}
> >		}
> >	}
> >}
> >
> >int minDistIndex (vec3 rgbValue){
> >	float dist = 50000.0;
> >	int ind = 0;
> >	for(int i = 0; i < MAXTEXTURES; i++){ 
> >		if(i == parts) break;
> >		//Picks the closest rgb vector 
> >		float temp = distance(rgbValue, vec3(rgbValues[(i*3)+0],rgbValues[(i*3)+1],rgbValues[(i*3)+2]));
> >		if( temp < dist){
> >			dist = temp;
> >			ind = i;
> >		}  
> >	}
> >	return ind;
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

+ [Photographic mosaic](https://en.wikipedia.org/wiki/Photographic_mosaic)
+ [Photo mosaic challenge](https://www.youtube.com/watch?v=nnlAH1zDBDE)
+ [History of Photo Mosaics](https://digitalartform.com/2017/01/05/history-of-photo-mosaics/)

> :ToCPrevNext
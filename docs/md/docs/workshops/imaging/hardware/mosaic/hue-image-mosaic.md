<h1 align="center">Image Mosaic from Hue and Grayscale</h1>

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

# Hue and Grayscale Organized Mosaic

The other approach to make a mosaics of a set of images consists on fixing the size of the mosaic in a determined number of rows and columns, and give a specific meaning for every row and column. Since we wanted to represent the color very accurately, we decided that every column will represent a little range of hues, one of the fundamental axes on the HSL and HSV models. A hue basically is a color tone in a image without any shadows or lights. And for every row, we decided to try to organize between the images previously organized in every hue (column) to match the opacity of the Luma grayscale of the respective row.

## Pre-processing

The following example is a 24x12 mosaic made from a gif containg 500 famous paintings of all times. The mosaic of images have 288 textures in total:

![paintings24x12](/docs/sketches/paintings24x12.jpg)

To make this type of mosaics, with fixed number of rows and columns, the columns meaning hues and rows opacity, is necesary to load a gif image with a very large amount of images, because gifs with few images won't have all the tones for every division. So the more images a gif image to process have, the better. Also, we can choose before executing the program how many textures will be used to paint the mosaic. The sketch used to pre-process the mosaic is shown below:

> :Tabs
> > :Tab title = Instructions
> > > To display the code for mosaic hue + luma pre-processing, click the code tab.
>
> > :Tab title = code
> >```js | preprocess_rgbmosaic.js
> >var gif;
> >var image;
> >var mosaic;
> >var cntImagesX = 0;
> >var cntImagesY = [];
> >var speedAlg = 1; //Velocidad del algoritmo que saca el promedio de RGB
> >var partsX = 5;
> >var partsY = 4;
> >
> >function preload(){
> >  //Images: images/colormap.png, images/mandrill.png
> >  image = loadImage('images/mandrill.png');
> >  //gifs: gifs/shrek.gif, gifs/paintings.gif, gifs/landscapes.gif, gifs/bee-movie.gif
> >  //gifs/spirited.gif, gifs/spirited-full.gif
> >  gif = loadImage('gifs/paintings500.gif');
> >  
> >}
> >
> >function setup() {
> >  noStroke();
> >  let rgbArray = getRGBArrayFromGIF(speedAlg);
> >  getHueOrganizedMosaic(partsX,partsY,rgbArray);
> >}
> >
> >function draw() {
> >
> >}
> >
> >function getHueOrganizedMosaic(size,altura,rgbArray){
> >  let hueArray = [];
> >  for(let i = 0;i < rgbArray.length;i++){
> >    let max = Math.max(...rgbArray[i]);
> >    let min = Math.min(...rgbArray[i]);
> >    let hueVal;
> >    if(rgbArray[i][0] >= rgbArray[i][1]){ //R > G
> >      if(rgbArray[i][0] >= rgbArray[i][2]){ //R > B
> >        //R es el mayor
> >        hueVal = ((rgbArray[i][1] - rgbArray[i][2])/(max-min)) * 60;
> >      } else { // B > R > G
> >        //B es el mayor
> >        hueVal = (4.0 + (rgbArray[i][0] - rgbArray[i][1])/(max-min)) * 60;
> >      }
> >    } else { // R < G
> >      if(rgbArray[i][1] >= rgbArray[i][2]){ //G > B
> >        //G es el mayor
> >        hueVal = (2.0 + (rgbArray[i][2] - rgbArray[i][0])/(max-min)) * 60;
> >      } else { // B > G > R
> >        //B es el mayor
> >        hueVal = (4.0 + (rgbArray[i][0] - rgbArray[i][1])/(max-min)) * 60;
> >      }
> >    }
> >    if( hueVal < 0 ){
> >      hueVal = hueVal + 360;
> >    }
> >    hueArray.push(hueVal);
> >  }
> >  console.log("RGBArray-length: "+rgbArray.length);
> >  console.log("HUEArray-length: "+hueArray.length);
> >  console.log("hueArray: "+hueArray);
> >  setNewMosaic(size);
> >  var div = 360 / size;
> >  var huergbArray = [];
> >  for(let j = 0; j < size;j++){
> >    let temp = [];
> >    let indexes = [];
> >    for(let ind = 0; ind < hueArray.length;ind++){
> >      if((hueArray[ind] >= (div * j)) && (hueArray[ind] < (div * (j + 1)))){
> >        //if(cntImagesY[j] < 10){
> >          pushOrganizedRGBElem(indexes,temp,rgbArray[ind][0],rgbArray[ind][1],rgbArray[ind][2],ind);
> >          //addBelowToMosaic(j,ind);
> >        //}
> >      }
> >    }
> >    huergbArray.push(indexes);
> >  }
> >  console.log("huergbArray: "+huergbArray);
> >  console.log("huergbArray.length: "+huergbArray.length);
> >  let str = "";
> >  for(let j = 0; j < huergbArray.length;j++){
> >    str = str + huergbArray[j].length+ ",";
> >    if(huergbArray[j].length == 0){
> >      findClosestHueImage(huergbArray[j],j,size,hueArray,rgbArray,0.0,0.3333,true);
> >      findClosestHueImage(huergbArray[j],j,size,hueArray,rgbArray,0.66666,1.0,true);
> >    } else if(huergbArray[j].length == 1){
> >      let rd = rgbArray[huergbArray[j][0]][0]; 
> >      let gr = rgbArray[huergbArray[j][0]][1];
> >      let bl = rgbArray[huergbArray[j][0]][2];
> >      if(getLuma(rd,gr,bl) < 0.15){
> >        findClosestHueImage(huergbArray[j],j,size,hueArray,rgbArray,0.6666,1.0,false);
> >      }
> >    }
> >  }
> >  console.log(str);
> >  var hght = altura; 
> >  var step = 1 / hght;
> >  for(let h = 0; h < size;h++){
> >    for(let n = 0; n < hght;n++){
> >      let minDist = 50;
> >      let minIndex = -1;
> >      for(let ind = 0; ind < huergbArray[h].length;ind++){
> >        let r = rgbArray[huergbArray[h][ind]][0];
> >        let g = rgbArray[huergbArray[h][ind]][1];
> >        let b = rgbArray[huergbArray[h][ind]][2];
> >        //console.log("h: "+h+" ind: "+ind+" n: "+n+" r: "+r+" g: "+g+" b: "+b);
> >        //console.log("getLuma r g b: "+getLuma(r,g,b));
> >        //console.log("actual dist: "+Math.abs(getLuma(r,g,b) - (step * n)));
> >        let distVal = Math.abs(getLuma(r,g,b) - (step * (n)));
> >        if(distVal < minDist){
> >          minDist = distVal;
> >          minIndex = ind;
> >          
> >        }
> >        //console.log("minIndex: "+minIndex+", minDist: "+minDist);
> >      }
> >      
> >      if(minIndex >= 0){
> >        //console.log("final minIndex: "+minIndex);
> >        if(!(h === 0 && n === 0)){
> >        addBelowToMosaic(h,huergbArray[h][minIndex]);
> >        }
> >      }  
> >    }
> >  }
> >  mosaic.save('mosaic', 'jpg');
> >}
> >
> >function findClosestHueImage(fill_arr,ind, size, hueArray,rgbArray,minLuma, maxLuma,mode){
> >  var div = 360 / size;
> >  var avgHue = ((div * ind) +(div * (ind + 1))) / 2;
> >  var minDist = 5000;
> >  var minIndex = -1;
> >  var bestMinDist = 5000;
> >  var bestMinIndex = -1;
> >  var minLuma = 0.2;
> >  var maxLuma = 0.5;
> >  for(let i = 0; i < hueArray.length;i++){
> >    let r = rgbArray[i][0];
> >    let g = rgbArray[i][1];
> >    let b = rgbArray[i][2];
> >    if((Math.abs(hueArray[i] - avgHue) < minDist)){
> >      minDist = Math.abs(hueArray[i] - avgHue);
> >      minIndex = i;
> >      if(((getLuma(r,g,b) >= minLuma) && (getLuma(r,g,b) <= maxLuma))){
> >        bestMinDist = Math.abs(hueArray[i] - avgHue);
> >        bestMinIndex = i;
> >      }
> >    }
> >  }
> >  if(bestMinIndex >= 0){
> >    fill_arr.push(bestMinIndex);
> >  } else if(mode){ //If want to put any image anyways
> >    fill_arr.push(minIndex);
> >  }
> >  
> >}
> >
> >function getLuma(r,g,b){
> >  return (r * 0.3) + (g * 0.59) + (b * 0.11);
> >}
> >
> >function pushOrganizedRGBElem(f_arr,f_tones,r,g,b,fNumber){
> >  let return_flag = false;
> >  if(f_tones.length == 0){ 
> >    f_tones.push(getLuma(r,g,b));
> >    f_arr.push(fNumber);
> >    return_flag = true;
> >  }
> >  for(let i = 0;i < f_tones.length;i++){
> >    if(getLuma(r,g,b) > f_tones[i] && !return_flag){
> >      f_tones.splice(i+1,0,getLuma(r,g,b));
> >      f_arr.splice(i+1,0,fNumber);
> >      return_flag = true;
> >    }
> >  }
> >  if(!return_flag){
> >    f_tones.splice(0,0,getLuma(r,g,b));
> >    f_arr.splice(0,0,fNumber);
> >  }
> >}
> >function setNewMosaic(w){
> >  cntImagesX = w;
> >  mosaic = createImage(gif.width * w, gif.height);
> >  mosaic.loadPixels();
> >  for (let i = 0; i < gif.width; i++) {
> >    for (let j = 0; j < gif.height; j++) {
> >      mosaic.set(i, j, color(0, 0, 0));
> >    }
> >  }
> >  mosaic.updatePixels();
> >  cntImagesY.push(1);
> >  for(let i = 1;i < w;i++){
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
> >
> >function getRGBArrayFromGIF(speed,maxFrames = gif.numFrames()){
> >  const tempValues = [];
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
> >     let temp = [];
> >     temp.push(r,g,b);
> >     //console.log("temp: "+temp); 
> >     tempValues.push(temp);
> >     //tempValues.push(r,g,b);
> >     //addToMosaic(frameNumber);
> >   }
> >   //console.log("tempValues: "+tempValues);
> >   console.log("tempValues.length: "+tempValues.length);
> >   //mosaic.save('mosaic', 'png');
> >   cntImages = 0;
> >   return tempValues;
> >}
> >```

## Hue and Grayscale processing on the shader

Both the hue and the grayscale computing are simple mathematical operations that also could be applied for every superpixel, so the only information apart of the mosaic of textures that is necessary to send to the fragment shader is the numbers of rows and columns of the textures image. This gives a very fast algorithm to paint the background image, having a linear increasing of operations depending of the number of textures used for painting the mosaic. 

However one of the disadvantages of using this methos would be to depending too much of the texture to draw accurate opaity an hue images, because the shader always assumes the corresponfing texture in the mosaic will be the most close to the superpixel color, and if the texture was made with poor hue / opacity range of images, the results will be far less than satisfying. Another disadvantage would be a greater pre-processing time required to generate the mosaic.

# Implementation

In the right menu there is several useful indicators, like number of textured used, time ellapsed in seconds and fps and average fps through time. Also, it counts with many different options given by the selectors:

> :Tabs
> > :Tab title=sketch
> >
> > > :P5 sketch=/docs/sketches/hardware/huemosaic/w2_huemosaic.js, width=700, height=600 
> 
> > :Tab title=.js
> > 
> > ```js | w2_huemosaic.js
> >let mosaic;
> >var mosaicShader;
> >var image;
> >var debug;
> >var luma;
> >var initialFPS = 120; //FPS iniciales del sketch
> >var resolution = 80; //cantidad de cuadros
> >var partsX = 6;
> >var partsY = 6;
> >//Selectors
> >let BGoption= new Map();
> >let BGselector;
> >//Preloads all images that are options in the selector
> >var rgbArrayObj;
> >//Selector of grid size
> >let gridOption= new Map();
> >let gridSelector;
> >let Symbolsoption = new Map();
> >let Symbolsselector;
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
> >  //Images: images/colormap.png, images/mandrill.png
> >  BGselector = createSelect();
> >  setBGImage("mandrill");
> >  setBGImage("monarch");
> >  setBGImage("lichtenstein");
> >  setBGImage("ara_macao");
> >  setBGImage("colormap");
> >
> >  Symbolsselector = createSelect();
> >  addGridsToSymbols("paintings");
> >  addGridsToSymbols("spirited-away");
> >  addGridsToSymbols("terminator");
> >  addGridsToSymbols("wall-e");
> >  addGridsToSymbols("bee-movie");
> >  //Default values
> >  image = loadImage('/vc/docs/sketches/hardware/huemosaic/images/mandrill.png');
> >  mosaicShader = loadShader('/vc/docs/sketches/hardware/huemosaic/shader.vert','/vc/docs/sketches/hardware/huemosaic/huemosaic.frag');
> >  mosaic = loadImage('/vc/docs/sketches/hardware/huemosaic/mosaics/paintings6x6.jpg');
> >  
> >}
> >
> >function setup() {
> >  createCanvas(600 + rightOffset,600, WEBGL);
> >  textureMode(NORMAL);
> >  noStroke();
> >  shader(mosaicShader);
> >
> >  rightMenu();
> >
> >  console.log("partsX: "+partsX);
> >  mosaicShader.setUniform('partsX', partsX);
> >  console.log("partsY: "+partsY);
> >  mosaicShader.setUniform('partsY', partsY);
> >  mosaicShader.setUniform('image',image);
> >  //Se carga la imagen con todas las texturas
> >  mosaicShader.setUniform('symbols',mosaic);  
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
> >  gridSelector.changed(setNewResolution);
> >  Symbolsselector.changed(MosaicImageSelectEvent);
> >  debugButton.mousePressed(mosaicMode);
> >  lumaButton.mousePressed(toggleLuma);
> >  setFpsButton.mousePressed(changeFPS);
> >  updateFPS();
> >  updateNumTextures();
> >  cover(true);
> >}
> >
> >function setBGImage(name){
> >  var imag = loadImage("/vc/docs/sketches/hardware/huemosaic/images/"+name+".png");
> >  BGoption.set(name,imag);
> >  BGselector.option(name);
> >}
> >
> >function addGridsToSymbols(strName){
> >  var img6x6 = loadImage("/vc/docs/sketches/hardware/huemosaic/mosaics/"+strName+"6x6.jpg");
> >  var img9x9 = loadImage("/vc/docs/sketches/hardware/huemosaic/mosaics/"+strName+"9x9.jpg");
> >  var img8x16 = loadImage("/vc/docs/sketches/hardware/huemosaic/mosaics/"+strName+"8x16.jpg");
> >  var img16x8 = loadImage("/vc/docs/sketches/hardware/huemosaic/mosaics/"+strName+"16x8.jpg");
> >  var img8x24 = loadImage("/vc/docs/sketches/hardware/huemosaic/mosaics/"+strName+"8x24.jpg");
> >  var img24x8 = loadImage("/vc/docs/sketches/hardware/huemosaic/mosaics/"+strName+"24x8.jpg");
> >  var img12x24 = loadImage("/vc/docs/sketches/hardware/huemosaic/mosaics/"+strName+"12x24.jpg");
> >  var img24x12 = loadImage("/vc/docs/sketches/hardware/huemosaic/mosaics/"+strName+"24x12.jpg");
> >  Symbolsoption.set(strName+"06x06",img6x6);
> >  Symbolsoption.set(strName+"09x09",img9x9);
> >  Symbolsoption.set(strName+"08x16",img8x16);
> >  Symbolsoption.set(strName+"16x08",img16x8);
> >  Symbolsoption.set(strName+"08x24",img8x24);
> >  Symbolsoption.set(strName+"24x08",img24x8);
> >  Symbolsoption.set(strName+"12x24",img12x24);
> >  Symbolsoption.set(strName+"24x12",img24x12);
> >  Symbolsselector.option(strName);
> >}
> >
> >function updateNumTextures(){
> >  numTexDiv.html(partsX * partsY);
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
> >  let gridSizeText = createP("Grid Size");
> >  setText(gridSizeText,90,20,width - rightOffset + 10,ySpace,'white',14);
> >  ySpace += 30;
> >  //Grid size selector
> >  gridSelector = createSelect();
> >  gridSelector.position(width - rightOffset + 10, ySpace);
> >  gridSelector.size(90, 20);
> >  gridSelector.option("06x06");
> >  gridSelector.option("09x09");
> >  gridSelector.option("08x16");
> >  gridSelector.option("16x08");
> >  gridSelector.option("08x24");
> >  gridSelector.option("24x08");
> >  gridSelector.option("12x24");
> >  gridSelector.option("24x12");
> >  ySpace += 10;
> >  let srcSetText = createP("Sources Set");
> >  setText(srcSetText,90,20,width - rightOffset + 10,ySpace,'white',14);
> >  ySpace += 30;
> >  Symbolsselector.position(width - rightOffset + 10, ySpace);
> >  Symbolsselector.size(90, 20);
> >  ySpace += 10;
> >  let numTexText = createP("Num. Textures:");
> >  setText(numTexText,100,20,width - rightOffset+7,ySpace,'white',12);
> >  ySpace += 30;
> >  numTexDiv = createDiv(partsX * partsY);
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
> >  //Debug and Luma Buttons
> >  debugButton = createButton('debug');
> >  debugButton.position(width - rightOffset + 17, ySpace);
> >  debugButton.size(80, 25);
> >  ySpace += 30;
> >  lumaButton = createButton('luma');
> >  lumaButton.position(width - rightOffset + 17, ySpace);
> >  lumaButton.size(80, 25);
> >  ySpace += 30;
> >  //FPS Displays
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
> >function MosaicImageSelectEvent() {
> >  let nameImage = Symbolsselector.value() + gridSelector.value();
> >  mosaic = Symbolsoption.get(nameImage);
> >  mosaicShader.setUniform("symbols",mosaic);
> >  //redraw();
> >}
> >
> >function BGImageSelectEvent() {
> >  let nameImage = BGselector.value();
> >  image = BGoption.get(nameImage);
> >  mosaicShader.setUniform("image",image);
> >  //redraw();
> >}
> >
> >function setNewResolution(){
> >  let pX = int(gridSelector.value()[0] + gridSelector.value()[1]);
> >  let pY = int(gridSelector.value()[3] + gridSelector.value()[4]);
> >  partsX = pX;
> >  partsY = pY;
> >  MosaicImageSelectEvent();
> >  mosaicShader.setUniform('partsX', partsX);
> >  mosaicShader.setUniform('partsY', partsY);
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
> >function changeResolution(){
> >  const newRes = parseInt(resInput.value());
> >  mosaicShader.setUniform("resolution", newRes);
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
> >function keyPressed(){
> >  if(key === "d"){
> >    mosaicMode();
> >  }
> >  if(key === "g"){
> >    lumaMode();
> >  }
> >}
> > ```
> 
> > :Tab title=.frag
> >
> >```glsl | huemosaic.frag
> >precision mediump float;
> >
> >// image is sent by the sketch
> >uniform sampler2D image;
> >//symbols texture is sent by the sketch
> >uniform sampler2D symbols;
> >// The number of textures also comes from the sketch
> >uniform int partsX;
> >uniform int partsY;
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
> >float getHue(vec3 colors);
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
> >		float partsX_f = float(partsX);
> >		float partsY_f = float(partsY);
> > 		float divX = 360.0 / partsX_f;  //Computes de division of the texture symbols 
> >		float divXmin = 1.0 / partsX_f;
> >		float divY = 1.0 / partsY_f;
> >		float gray = 0.0;
> >		if(luma){
> >			//Luma grayscale
> >			gray = (index.x * 0.3) + (index.y * 0.59) + (index.z * 0.11); //Computes the magnitude of the vector
> >		} else {
> >			//Average grayscale
> >		    gray = (index.x + index.y + index.z) / 3.0; //Computes the magnitude of the vector 
> >		}
> >		
> >		float hue = getHue(index.rgb);
> >		
> >		for(int i = 0; i < 100000; i++){
> >			if(i == partsX) break;
> >			float i_f = float(i);
> >			for(int j = 0; j < 100000; j++){
> >				if(j == partsY) break;
> >				float j_f = float(j);
> >				if( (hue >= divX * i_f) && (hue <= divX * (i_f + 1.0))){
> >					if((gray >= divY * j_f) && (gray <= divY * (j_f + 1.0))){
> >						gl_FragColor = texture2D(symbols, (symbolCoord / vec2(partsX_f,partsY_f)) + vec2(divXmin*i_f,divY*j_f) ) * vVertexColor;
> >					}
> >				}
> >			}
> >		}
> >
> >		
> >		//for(int i = 0; i < 100000; i++){ //Loop to a very large number
> >		//	if(i == parts) break;
> >		//	float i_f = float(i);
> >		//	if( (gray >= div * i_f) && (gray <= div * (i_f + 1.0))){ //If magnitude is inside a division of the texture symbols
> >				//Divides the coords to only print one part of the image
> >				//And after sums a vector that begin to print in the actual division
> >		//		gl_FragColor = texture2D(symbols, (symbolCoord / vec2(parts_f,1.0)) + vec2(div*i_f,0.0) ) * vVertexColor;
> >		//	}
> >		//} 
> >	}
> >}
> >
> >float getHue(vec3 colors){
> >	float hueVal = 0.0;
> >	float minVal = min(min(colors.r, colors.g), colors.b);
> >    float maxVal = max(max(colors.r, colors.g), colors.b);
> >	
> >	if(minVal == maxVal){
> >		return 0.0;
> >	}
> >	
> >	if(maxVal == colors.r){
> >		hueVal = ((colors.g - colors.b) / (maxVal - minVal));
> >	} else if (maxVal == colors.g){
> >		hueVal = (2.0 + (colors.b - colors.r) / (maxVal - minVal));
> >	} else{
> >		hueVal = (4.0 + (colors.r - colors.g) / (maxVal - minVal));
> >	}
> >	
> >	hueVal = hueVal * 60.0;
> >    if( hueVal < 0.0 ){
> >      hueVal = hueVal + 360.0;
> >    }
> >    return hueVal;
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
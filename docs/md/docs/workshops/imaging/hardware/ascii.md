<h1 align="center">ASCII Art processing</h1>

# Problem statement

## Propósito

Introducir el análisis de imágenes al implementar las siguientes operaciones de análisis para imágenes:

## Tareas

* Conversión de la imagen a _ascii art_.

# Background

## ASCII art

ASCII art is a technique that represents an image into characters of the ASCII standard. This technique of representing images using characters is old, one of the first representations we know is "Simmias de Rodas. El hacha, ca. 300 a. C." which looks like the below image.

<!-- >:P5 width=280, height=415
>
> let img;
>
> function preload() {
>   img = loadImage("/vc/docs/sketches/asciibackground.png");
> }
>
> function setup() {
>   createCanvas(280, 415);
>   image(img, 0, 0, width, height);
>
>   frameRate(1);
> } -->

We represented Lenna's photo using this technique.

## ASCII art (26 symbols)

4x4 superpixel size (Image composed of 128x128 symbols)

> :Tabs
> > :Tab title=sketch
> >
> > > :P5 sketch=/docs/sketches/hardware/asciimosaic/w2_asciimosaic.js, width=600, height=600
> 
> > :Tab title=code
> > 
> >```js | w2_asciimosaic.js
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
> >
> >function preload(){
> >  //Images: images/colormap.png, images/mandrill.png
> >  image = loadImage("/vc/docs/sketches/hardware/asciimosaic/images/mandrill.png");
> >  mosaicShader = loadShader("/vc/docs/sketches/hardware/asciimosaic/shader.vert","/vc/docs/sketches/hardware/asciimosaic/asciimosaic.frag");
> >  // gifs/arial.gif, gifs/erica-one.gif
> >  gif = loadImage("/vc/docs/sketches/hardware/asciimosaic/gifs/erica-one.gif");
> >  // gif = loadImage("/vc/docs/sketches/hardware/asciimosaic/gifs/arial.gif");
> >}
> >
> >function setup() {
> >  createCanvas(600,600, WEBGL);
> >  textureMode(NORMAL);
> >  noStroke();
> >  shader(mosaicShader);
> >  let rgbArray;
> >  if( gif.numFrames() * gif.width > maxWidePixels){ //If generated image is too wide
> >    let limitFrames = getLimitFramesGIF();
> >    console.log("Warning, gif size/number of frames too wide! Only picking first "+limitFrames+" frames");
> >    rgbArray = getOrganizedSymbolsImageFromGIF(speedAlg,limitFrames); 
> >    mosaicShader.setUniform("parts",limitFrames);
> >    console.log("parts: "+limitFrames);
> >  } else {
> >    rgbArray = getOrganizedSymbolsImageFromGIF(speedAlg);
> >    mosaicShader.setUniform("parts", gif.numFrames());
> >    console.log("parts: "+gif.numFrames());  
> >}
> >  
> >  mosaicShader.setUniform("image",image);
> >  //Se carga la imagen con todas las texturas
> >  mosaicShader.setUniform("symbols",mosaic);  
> >  mosaicShader.setUniform("resolution",resolution);
> >  debug = true;
> >  luma = true;
> >  mosaicShader.setUniform("debug",debug);
> >  mosaicShader.setUniform("luma",luma);
> >}
> >
> >function draw() {
> >  background(33);
> >  cover(true);
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
> >  if(key === "d"){
> >    debug = !debug;
> >    mosaicShader.setUniform("debug",debug);
> >  }
> >  if(key === "g"){
> >    luma = !luma;
> >    mosaicShader.setUniform("luma",luma);
> >  }
> >}
> >
> >function getOrganizedSymbolsImageFromGIF(speed,maxFrames = gif.numFrames()){
> >  const tempValues = [];
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
> >   while(min != maxFinal){
> >     //console.log("tempValues: "+tempValues);
> >     //console.log("length: "+tempValues.length);
> >     //console.log("min: "+min); 
> >     var ind = tempValues.indexOf(min);
> >     addToMosaic(ind);
> >     tempValues.splice(ind, 1,maxFinal); 
> >     min = Math.min(...tempValues);
> >   }
> >   //mosaic.save("mosaic", "png");
> >   cntImages = 0;
> >}
> >
> >function addToMosaic(index){
> >    gif.setFrame(index);
> >    let img = createImage(gif.width * (cntImages + 1), gif.height);
> >     if(cntImages != 0){
> >       img.copy(mosaic,0,0,mosaic.width,mosaic.height,0,0,mosaic.width,mosaic.height);
> >     }
> >     mosaic = createImage(gif.width * (cntImages + 1), gif.height);
> >     img.copy(gif,0,0,gif.width,gif.height,gif.width * cntImages,0,gif.width,gif.height);
> >     mosaic.copy(img,0,0,img.width,img.height,0,0,img.width,img.height); 
> >     cntImages++;
> >}
> >
> >function getLimitFramesGIF(){
> >  let limit = 0;
> >  while(gif.width * limit < maxWidePixels){
> >    limit++;
> >  }
> >  return limit;
> >}
> >```

## ASCII art (52 symbols)

4x4 superpixel size (Image composed of 128x128 symbols)

> :Tabs
> > :Tab title=sketch
> >
> > > :P5 sketch=/docs/sketches/ascii52.js, width=700, height=700
> 
> > :Tab title=code
> > 
> >```js | ascii52.js
> >let pg;
> >let img, copy1;
> >
> >function preload(){  
> >  copy1 = loadImage("/vc/docs/sketches/lenna.png"); 
> >}
> >
> >function setup() {
> >    createCanvas(700, 700);
> >    copy1.resize(128,128) //Resizing the image we get the superpixels
> >    copy1.copy(yuvGrayscale(copy1),0,0,copy1.width,copy1.height,0,0,copy1.width,copy1.height); //Convert to grayscale
> >    toASCII52(copy1,6,0,0);
> >}
> >
> >function monospaceChar(content, size, posX, posY){
> >    fill(0);
> >    textSize(size);
> >    textFont("monospace");
> >    textStyle(BOLD)
> >    text(content,posX,posY);
> >}
> >
> >function yuvGrayscale(imag){
> >    let copied = createGraphics(imag.width,imag.height);
> >    copied.loadPixels();  
> >    for(let i = 0; i < imag.width; i++) {
> >      for(let j = 0; j < imag.height; j++) {
> >        //Y' component in YUV (below this line) is equivalent to LUMA
> >        copied.set(i, j, color(0.299*red(imag.get(i, j)) +  0.587*green(imag.get(i, j)) + 0.114*blue(imag.get(i, j))));
> >      }
> >    }
> >    copied.updatePixels();
> >    return copied;
> >  }
> >
> >// Opacity information taken from https://observablehq.com/@grantcuster/sort-font-characters-by-percent-of-black-pixels
> >function getSimilarChar52(number){
> >  let ordered = "@g$WBMR%OHGKSmUdq56X3ahVk1{yt7}nzr]ixLv=<+/\"!;:,\'´-." //52 ASCII elements, ordered by opacity
> >  return ordered.substr(Math.floor(number/5),1) //Returns the corresponding string character for determined opacity of the pixel
> >}
> >
> >function toASCII52(imag, size, initialX , initialY){
> >  for(let i = 0; i < imag.width; i++) {
> >    for(let j = 0; j < imag.height; j++) {
> >      monospaceChar(getSimilarChar52(red(imag.get(i, j))),size,0.9*size*i + initialX,0.9*size*j + initialY); //Since the image is already gray, all rgb channels have the same value, we can pick any value
> >    }
> >  }
> >}
> >```

Is important to note that for both 26 and 52 versions of ASCII art sketches, we used information about the percentage of opacity of the characters (in monospace font) based on the results published in [Grant Custer's Article](https://observablehq.com/@grantcuster/sort-font-characters-by-percent-of-black-pixels), in which in addition to the percentages, there is the source code which could be easily implemented in this sketches.

# References

+ [ASCII art](https://en.wikipedia.org/wiki/ASCII_art)
+ [Future potentials for ASCII art](http://goto80.com/chipflip/06/)

> :ToCPrevNext
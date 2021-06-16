# Grayscale processing

# Problem statement

## Propósito

Introducir el análisis de imágenes/video al implementar las siguientes operaciones de análisis para imágenes/video:

## Tareas

* (imágenes/video) Conversión a escala de grises: promedio _rgb_ y _luma_.

# Background

## Grayscale

The grayscale is a kind of image which represents the amount of light of every pixel of the whole image. The image is composed exclusively of shades of gray. The gray color is one in which the RGB channels have got the same or a similar quantity. To transform an image to grayscale, we calculated the average of the components Red, Green and Blue of each pixel, but we can also do this using this equation: Red*0.3+Green*0.59+Blue*0.11.

## Negative and grayscale images

> :Tabs
> > :Tab title=sketch
> >
> > > :P5 sketch=/docs/sketches/negaGray.js, width=512, height=512
> 
> > :Tab title=code
> > 
> >```js | negaGray.js
> >  let img;
> >
> >function preload() {
> >  img = loadImage("/vc/docs/sketches/lenna.png");
> >}
> >
> >function setup() {
> >  // Create a canvas that's at least the size of the image.
> >  createCanvas(512, 512);
> >  textSize(20);
> >  noLoop();
> >}
> >
> >function draw() {
> >  // ********************************************************************************
> >  // imagen original
> >  // ********************************************************************************
> >  image(img, 0, 0, width/2, height/2);
> >  
> >  // ********************************************************************************
> >  // imagen en escala de grises luma
> >  // ********************************************************************************
> >  imgGrayScale = img.get()
> >  imgGrayScale.loadPixels();
> >  for(var i = 0; i < imgGrayScale.pixels.length; i += 4){
> >    let r = imgGrayScale.pixels[i + 0];
> >    let g = imgGrayScale.pixels[i + 1];
> >    let b = imgGrayScale.pixels[i + 2];
> >    // let a = imgGrayScale.pixels[i + 3];
> >    let sum = (r*0.3 + g*0.59 + b*0.11);
> >    imgGrayScale.pixels[i + 0] = sum;
> >    imgGrayScale.pixels[i + 1] = sum;
> >    imgGrayScale.pixels[i + 2] = sum;
> >    // imgGrayScale.pixels[i + 3] = sum;
> >  }
> >
> >  imgGrayScale.updatePixels();
> >  image(imgGrayScale, width/2, 0, width/2, height/2);
> >
> >  // ********************************************************************************
> >  // imagen en escala de grises promedio RGB
> >  // ********************************************************************************
> >  imgGrayScaleProm = img.get()
> >  imgGrayScaleProm.loadPixels();
> >  for(var i = 0; i < imgGrayScaleProm.pixels.length; i += 4){
> >    let r = imgGrayScaleProm.pixels[i + 0];
> >    let g = imgGrayScaleProm.pixels[i + 1];
> >    let b = imgGrayScaleProm.pixels[i + 2];
> >    // let a = imgGrayScaleProm.pixels[i + 3];
> >    let sum = (r + g + b)/3;
> >    imgGrayScaleProm.pixels[i + 0] = sum;
> >    imgGrayScaleProm.pixels[i + 1] = sum;
> >    imgGrayScaleProm.pixels[i + 2] = sum;
> >    // imgGrayScaleProm.pixels[i + 3] = sum;
> >  }
> >  imgGrayScaleProm.updatePixels();
> >  image(imgGrayScaleProm, 0, height/2, width/2, height/2);
> >  
> >  // ********************************************************************************
> >  // negativo imagen
> >  // ********************************************************************************
> >  imgNegat = img.get()
> >  imgNegat.loadPixels();
> >  for(var i = 0; i < imgNegat.pixels.length; i += 4){
> >    let r = imgNegat.pixels[i + 0];
> >    let g = imgNegat.pixels[i + 1];
> >    let b = imgNegat.pixels[i + 2];
> >    // let a = imgNegat.pixels[i + 3];
> >    
> >    imgNegat.pixels[i + 0] = 255-r;
> >    imgNegat.pixels[i + 1] = 255-g;
> >    imgNegat.pixels[i + 2] = 255-b;
> >    // imgNegat.pixels[i + 3] = sum;
> >  }
> >
> >  imgNegat.updatePixels();
> >  image(imgNegat, width/2, height/2, width/2, height/2);
> >
> >  fill(255, 255, 255);
> >  text("Original", 0, 25);
> >  text("Luma", 256, 25);
> >  text("Promedio RGB", 0, 280);
> >  text("Negativo", 256, 280);
> >}
> >``` 

## Negative and grayscale videos

> :Tabs
> > :Tab title=sketch
> >
> > > :P5 sketch=/docs/sketches/negaGrayVideo.js, width=512, height=512
> 
> > :Tab title=code
> > 
> >```js | negaGrayVideo.js
> >var vid;
> >function setup() {
> >  createCanvas(512, 512);
> >  textSize(20);
> >  pixelDensity(1);
> >  vid = createVideo(["/vc/docs/sketches/fingers.mov",
> >                      "/vc/docs/sketches/fingers.webm"],
> >                      );
> >  vid.loop()
> >  vid.hide()
> >  noStroke();
> >}
> >
> >function draw() {
> >  // ********************************************************************************
> >  // video original
> >  // ********************************************************************************
> >  image(vid, 0, 0, width/2, height/2)
> >
> >  // ********************************************************************************
> >  // video en escala de grises luma
> >  // ********************************************************************************
> >  vidGrisLuma = vid.get();
> >  if(vidGrisLuma.width > 0) {
> >    vidGrisLuma.loadPixels(); // getting pixel array
> >		
> >		for(var i = 0; i < vidGrisLuma.pixels.length; i += 4) // combination of double for loop mentioned in other tutorials
> >		{	
> >			var r = vidGrisLuma.pixels[i+0];
> >			var g = vidGrisLuma.pixels[i+1];
> >			var b = vidGrisLuma.pixels[i+2];
> >			let sum = (r*0.3 + g*0.59 + b*0.11);
> >			vidGrisLuma.pixels[i+0] = sum;
> >			vidGrisLuma.pixels[i+1] = sum;
> >			vidGrisLuma.pixels[i+2] = sum;
> >		}
> >		vidGrisLuma.updatePixels();
> >		image(vidGrisLuma, width/2, 0, width/2, height/2);
> >	}
> >
> >  // ********************************************************************************
> >  // video en escala de grises promedio
> >  // ********************************************************************************
> >  vidGrisProm = vid.get();
> >  if(vidGrisProm.width > 0) {
> >    vidGrisProm.loadPixels(); // getting pixel array
> >		
> >		for(var i = 0; i < vidGrisProm.pixels.length; i += 4) // combination of double for loop mentioned in other tutorials
> >		{	
> >			var r = vidGrisProm.pixels[i+0];
> >			var g = vidGrisProm.pixels[i+1];
> >			var b = vidGrisProm.pixels[i+2];
> >			let sum = (r + g + b)/3;
> >			vidGrisProm.pixels[i+0] = sum;
> >			vidGrisProm.pixels[i+1] = sum;
> >			vidGrisProm.pixels[i+2] = sum;
> >		}
> >		vidGrisProm.updatePixels();
> >		image(vidGrisProm, 0, height/2, width/2, height/2);
> >	}
> >
> >  // ********************************************************************************
> >  // video negativo
> >  // ********************************************************************************
> >  vidNeg = vid.get();
> >  if(vidNeg.width > 0) {
> >    vidNeg.loadPixels(); // getting pixel array
> >		
> >		for(var i = 0; i < vidNeg.pixels.length; i += 4) // combination of double for loop mentioned in other tutorials
> >		{	
> >			var r = vidNeg.pixels[i+0];
> >			var g = vidNeg.pixels[i+1];
> >			var b = vidNeg.pixels[i+2];
> >			
> >			vidNeg.pixels[i+0] = 255-r;
> >			vidNeg.pixels[i+1] = 255-g;
> >			vidNeg.pixels[i+2] = 255-b;
> >		}
> >		vidNeg.updatePixels();
> >		image(vidNeg, width/2, height/2, width/2, height/2);
> >	}
> >
> >  fill(255, 255, 255);
> >  text("Original", 0, 25);
> >  text("Luma", 256, 25);
> >  text("Promedio RGB", 0, 280);
> >  text("Negativo", 256, 280);
> >}
> >``` 

# References

+ [Grayscale](https://en.wikipedia.org/wiki/Grayscale)
+ [HSL and HSV](https://en.wikipedia.org/wiki/HSL_and_HSV)
+ [RGB to grayscale conversion](https://stackoverflow.com/questions/17615963/standard-rgb-to-grayscale-conversion)

> :ToCPrevNext
# Image and video processing

# Problem statement

## Propósito

Introducir el análisis de imágenes/video al implementar las siguientes operaciones de análisis para imágenes/video:

## Tareas

Implementar:

* (imágenes/video) Conversión a escala de grises: promedio _rgb_ y _luma_.
* (imágenes/video) Aplicación de algunas _máscaras de convolución_.
* (solo para imágenes) Conversión de la imagen a _ascii art_.
* (solo para imágenes) Conversión de la imagen a un _foto-mosaico_.

# Background

## Grayscale

The grayscale is a kind of image which represents the amount of light of every pixel of the whole image. The image is composed exclusively of shades of gray. The gray color is one in which the RGB channels have got the same or a similar quantity.

## Kernel (image processing)

To make image processing we need to use a small matrix that uses different values in it. This matrix is called Kernel. There are lots of effects such as blur, bottom sobel, emboss, identity, etc.

## ASCII art

ASCII art is a technique that represents an image into characters of the ASCII standard. This technique of representing images using characters is old, one of the first representations we know is "Simmias de Rodas. El hacha, ca. 300 a. C." which looks like the below image.

>:P5 width=280, height=415
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
> }

## Photographic mosaic

A photographic mosaic is an image or picture that has been split into smaller sections, usually grids or squares. The original image is represented by others smaller photos that are in the grids and they fulfill the property that they've got a similar color to the section they're representing. Joseph Francis is believed to be the inventor of the kind of photographic mosaics that we see nowadays.

# Code (solution) & results

## Negativo y escala de grises imágenes

> :P5 sketch=/docs/sketches/negaGray.js, width=512, height=512

The markdown of the above sketch looks like:

```js
  let img;

function preload() {
  img = loadImage("/vc/docs/sketches/lenna.png");
}

function setup() {
  // Create a canvas that's at least the size of the image.
  createCanvas(512, 512);
  textSize(20);
  noLoop();
}

function draw() {
  // ********************************************************************************
  // imagen original
  // ********************************************************************************
  image(img, 0, 0, width/2, height/2);
  
  // ********************************************************************************
  // imagen en escala de grises luma
  // ********************************************************************************
  imgGrayScale = img.get()
  imgGrayScale.loadPixels();
  for(var i = 0; i < imgGrayScale.pixels.length; i += 4){
    let r = imgGrayScale.pixels[i + 0];
    let g = imgGrayScale.pixels[i + 1];
    let b = imgGrayScale.pixels[i + 2];
    // let a = imgGrayScale.pixels[i + 3];
    let sum = (r*0.3 + g*0.59 + b*0.11);
    imgGrayScale.pixels[i + 0] = sum;
    imgGrayScale.pixels[i + 1] = sum;
    imgGrayScale.pixels[i + 2] = sum;
    // imgGrayScale.pixels[i + 3] = sum;
  }

  imgGrayScale.updatePixels();
  image(imgGrayScale, width/2, 0, width/2, height/2);

  // ********************************************************************************
  // imagen en escala de grises promedio RGB
  // ********************************************************************************
  imgGrayScaleProm = img.get()
  imgGrayScaleProm.loadPixels();
  for(var i = 0; i < imgGrayScaleProm.pixels.length; i += 4){
    let r = imgGrayScaleProm.pixels[i + 0];
    let g = imgGrayScaleProm.pixels[i + 1];
    let b = imgGrayScaleProm.pixels[i + 2];
    // let a = imgGrayScaleProm.pixels[i + 3];
    let sum = (r + g + b)/3;
    imgGrayScaleProm.pixels[i + 0] = sum;
    imgGrayScaleProm.pixels[i + 1] = sum;
    imgGrayScaleProm.pixels[i + 2] = sum;
    // imgGrayScaleProm.pixels[i + 3] = sum;
  }
  imgGrayScaleProm.updatePixels();
  image(imgGrayScaleProm, 0, height/2, width/2, height/2);
  
  // ********************************************************************************
  // negativo imagen
  // ********************************************************************************
  imgNegat = img.get()
  imgNegat.loadPixels();
  for(var i = 0; i < imgNegat.pixels.length; i += 4){
    let r = imgNegat.pixels[i + 0];
    let g = imgNegat.pixels[i + 1];
    let b = imgNegat.pixels[i + 2];
    // let a = imgNegat.pixels[i + 3];
    
    imgNegat.pixels[i + 0] = 255-r;
    imgNegat.pixels[i + 1] = 255-g;
    imgNegat.pixels[i + 2] = 255-b;
    // imgNegat.pixels[i + 3] = sum;
  }

  imgNegat.updatePixels();
  image(imgNegat, width/2, height/2, width/2, height/2);

  fill(255, 255, 255);
  text("Original", 0, 25);
  text("Luma", 256, 25);
  text("Promedio RGB", 0, 280);
  text("Negativo", 256, 280);
}
``` 

## Negativo y escala de grises videos

> :P5 sketch=/docs/sketches/negaGrayVideo.js, width=512, height=512

The markdown of the above sketch looks like:

```js
var vid;
function setup() {
  createCanvas(512, 512);
  textSize(20);
  pixelDensity(1);
  vid = createVideo(["/vc/docs/sketches/fingers.mov",
                      "/vc/docs/sketches/fingers.webm"],
                      );
  vid.loop()
  vid.hide()
  noStroke();
}

function draw() {
  // ********************************************************************************
  // video original
  // ********************************************************************************
  image(vid, 0, 0, width/2, height/2)

  // ********************************************************************************
  // video en escala de grises luma
  // ********************************************************************************
  vidGrisLuma = vid.get();
  if(vidGrisLuma.width > 0) {
    vidGrisLuma.loadPixels(); // getting pixel array
		
		for(var i = 0; i < vidGrisLuma.pixels.length; i += 4) // combination of double for loop mentioned in other tutorials
		{	
			var r = vidGrisLuma.pixels[i+0];
			var g = vidGrisLuma.pixels[i+1];
			var b = vidGrisLuma.pixels[i+2];
			let sum = (r*0.3 + g*0.59 + b*0.11);
			vidGrisLuma.pixels[i+0] = sum;
			vidGrisLuma.pixels[i+1] = sum;
			vidGrisLuma.pixels[i+2] = sum;
		}
		vidGrisLuma.updatePixels();
		image(vidGrisLuma, width/2, 0, width/2, height/2);
	}

  // ********************************************************************************
  // video en escala de grises promedio
  // ********************************************************************************
  vidGrisProm = vid.get();
  if(vidGrisProm.width > 0) {
    vidGrisProm.loadPixels(); // getting pixel array
		
		for(var i = 0; i < vidGrisProm.pixels.length; i += 4) // combination of double for loop mentioned in other tutorials
		{	
			var r = vidGrisProm.pixels[i+0];
			var g = vidGrisProm.pixels[i+1];
			var b = vidGrisProm.pixels[i+2];
			let sum = (r + g + b)/3;
			vidGrisProm.pixels[i+0] = sum;
			vidGrisProm.pixels[i+1] = sum;
			vidGrisProm.pixels[i+2] = sum;
		}
		vidGrisProm.updatePixels();
		image(vidGrisProm, 0, height/2, width/2, height/2);
	}

  // ********************************************************************************
  // video negativo
  // ********************************************************************************
  vidNeg = vid.get();
  if(vidNeg.width > 0) {
    vidNeg.loadPixels(); // getting pixel array
		
		for(var i = 0; i < vidNeg.pixels.length; i += 4) // combination of double for loop mentioned in other tutorials
		{	
			var r = vidNeg.pixels[i+0];
			var g = vidNeg.pixels[i+1];
			var b = vidNeg.pixels[i+2];
			
			vidNeg.pixels[i+0] = 255-r;
			vidNeg.pixels[i+1] = 255-g;
			vidNeg.pixels[i+2] = 255-b;
		}
		vidNeg.updatePixels();
		image(vidNeg, width/2, height/2, width/2, height/2);
	}

  fill(255, 255, 255);
  text("Original", 0, 25);
  text("Luma", 256, 25);
  text("Promedio RGB", 0, 280);
  text("Negativo", 256, 280);
}
``` 

## Kernels imagenes

> :P5 sketch=/docs/sketches/kernels.js, width=512, height=512

The markdown of the above sketch looks like:

```js
let img;
let n = 3;// tamaño array kernel
function preload() {
  img = loadImage("/vc/docs/sketches/lenna.png");
}

function setup() {
  // Create a canvas that's at least the size of the image.
  createCanvas(512, 512);
  noLoop();
}

function draw() {  
  // ********************************************************************************
  // imagen original
  // ********************************************************************************
  image(img, 0, 0, width/2, height/2);

  // ********************************************************************************
  // imagen en escala de grises
  // ********************************************************************************
  imgGrayScale = img.get()
  imgGrayScale.loadPixels();
  for (var i = 0; i < imgGrayScale.pixels.length; i+=4) {
    let r = imgGrayScale.pixels[i + 0];
    let g = imgGrayScale.pixels[i + 1];
    let b = imgGrayScale.pixels[i + 2];
    // let a = img.pixels[index + 3];
    let sum = (r*0.3 + g*0.59 + b*0.11);
    imgGrayScale.pixels[i + 0] = sum;
    imgGrayScale.pixels[i + 1] = sum;
    imgGrayScale.pixels[i + 2] = sum;
    // img.pixels[index + 3] = sum;
  }
  imgGrayScale.updatePixels();
  image(imgGrayScale, width/2, 0, width/2, height/2);

  // outline
  // let kernel = [-1,-1,-1, 
  //   -1,8,-1,
  //   -1,-1,-1]

  // bottom sobel
  // let kernel = [-1,-2,-1, 
  //               0,0,0,
  //               1,2,1]

  // rightSobel
  // let kernel = [-1,0,1, 
  //               -2,0,2,
  //               -1,0,1]

  // leftSobel
  // let kernel = [1,0,-1, 
  //               2,0,-2,
  //               1,0,-1]

  // emboss
  // let kernel = [-2,-1,0, 
  //               -1,1,1,
  //               0,1,2]

  // blur
  // let kernel = [0.0625,0.125,0.0625,
  //               0.125,0.25,0.125,
  //               0.0625,0.125,0.0625]

  // sharpen
  // let kernel = [0,-1,0,
  //               -1,5,-1,
  //               0,-1,0]

  // edge
  let kernel = [0,-1,0,
                -1,4,-1,
                0,-1,0]

  // ********************************************************************************
  // kernel imagen original
  // ********************************************************************************
  imgColKer = img.get()
  imgColKer.loadPixels()
  for (var i = 0; i < imgColKer.pixels.length; i+=4) {
    let sumr = 0;
    let sumg = 0;
    let sumb = 0;
    for (let tam = 0; tam < n*n; tam++){
      let valr = imgColKer.pixels[i + tam*4 + 0];
      let valg = imgColKer.pixels[i + tam*4 + 1];
      let valb = imgColKer.pixels[i + tam*4 + 2];
      sumr += kernel[tam] * valr;
      sumg += kernel[tam] * valg;
      sumb += kernel[tam] * valb;
    }
    imgColKer.pixels[i + 0] = sumr;
    imgColKer.pixels[i + 1] = sumg;
    imgColKer.pixels[i + 2] = sumb;
  }
  imgColKer.updatePixels();
  image(imgColKer, 0, height/2, width/2, height/2);

  // ********************************************************************************
  // kernel escala de grises
  // ********************************************************************************
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      var index = (y+x*width)*4;
      let sum = 0; 
      for (let tam = 0; tam < n*n; tam++){
        let val = imgGrayScale.pixels[index + tam*4];
        sum += kernel[tam] * val;
      }
      imgGrayScale.pixels[index + 0] = sum;
      imgGrayScale.pixels[index + 1] = sum;
      imgGrayScale.pixels[index + 2] = sum;
    }
  }
  imgGrayScale.updatePixels();
  image(imgGrayScale, width/2, height/2, width/2, height/2);
}
```

## Kernels videos

> :P5 sketch=/docs/sketches/kernelsVideo.js, width=512, height=512

The markdown of the above sketch looks like:

```js
var vid;
var n =3
function setup() {
  createCanvas(512, 512);
  textSize(20);
  pixelDensity(1);
  vid = createVideo(["/vc/docs/sketches/fingers.mov",
                      "/vc/docs/sketches/fingers.webm"],
                      );
  vid.loop()
  vid.hide()
  noStroke();
}

function draw() {
  // ********************************************************************************
  // video original
  // ********************************************************************************
  image(vid, 0, 0, width/2, height/2)

  // ********************************************************************************
  // video en escala de grises luma
  // ********************************************************************************
  vidGrisLuma = vid.get();
  if(vidGrisLuma.width > 0) {
    vidGrisLuma.loadPixels(); // getting pixel array
		
		for(var i = 0; i < vidGrisLuma.pixels.length; i += 4) // combination of double for loop mentioned in other tutorials
		{	
			var r = vidGrisLuma.pixels[i+0];
			var g = vidGrisLuma.pixels[i+1];
			var b = vidGrisLuma.pixels[i+2];
			let sum = (r*0.3 + g*0.59 + b*0.11);
			vidGrisLuma.pixels[i+0] = sum;
			vidGrisLuma.pixels[i+1] = sum;
			vidGrisLuma.pixels[i+2] = sum;
		}
		vidGrisLuma.updatePixels();
		image(vidGrisLuma, width/2, 0, width/2, height/2);
	}

  // outline
  let kernel = [-1,-1,-1, 
    -1,8,-1,
    -1,-1,-1]

  // bottom sobel
  // let kernel = [-1,-2,-1, 
  //               0,0,0,
  //               1,2,1]

  // rightSobel
  // let kernel = [-1,0,1, 
  //               -2,0,2,
  //               -1,0,1]

  // leftSobel
  // let kernel = [1,0,-1, 
  //               2,0,-2,
  //               1,0,-1]

  // emboss
  // let kernel = [-2,-1,0, 
  //               -1,1,1,
  //               0,1,2]

  // blur
  // let kernel = [0.0625,0.125,0.0625,
  //               0.125,0.25,0.125,
  //               0.0625,0.125,0.0625]

  // sharpen
  // let kernel = [0,-1,0,
  //               -1,5,-1,
  //               0,-1,0]

  // edge
  // let kernel = [0,-1,0,
  //               -1,4,-1,
  //               0,-1,0]

  // ********************************************************************************
  // kernel video original
  // ********************************************************************************
  vidColKer = vid.get()
  if(vidColKer.width > 0) {
    vidColKer.loadPixels()
    for (var i = 0; i < vidColKer.pixels.length; i+=4) {
      let sumr = 0;
      let sumg = 0;
      let sumb = 0;
      for (let tam = 0; tam < n*n; tam++){
        let valr = vidColKer.pixels[i + tam*4 + 0];
        let valg = vidColKer.pixels[i + tam*4 + 1];
        let valb = vidColKer.pixels[i + tam*4 + 2];
        sumr += kernel[tam] * valr;
        sumg += kernel[tam] * valg;
        sumb += kernel[tam] * valb;
      }
      vidColKer.pixels[i + 0] = sumr;
      vidColKer.pixels[i + 1] = sumg;
      vidColKer.pixels[i + 2] = sumb;
    }
    vidColKer.updatePixels();
    image(vidColKer, 0, height/2, width/2, height/2);
  }

  // ********************************************************************************
  // kernel escala de grises
  // ********************************************************************************
  vidGrisKernel = vidGrisLuma.get()
  if(vidGrisKernel.width > 0) {
    vidGrisKernel.loadPixels()
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        var index = (y+x*width)*4;
        let sum = 0; 
        for (let tam = 0; tam < n*n; tam++){
          let val = vidGrisKernel.pixels[index + tam*4];
          sum += kernel[tam] * val;
        }
        vidGrisKernel.pixels[index + 0] = sum;
        vidGrisKernel.pixels[index + 1] = sum;
        vidGrisKernel.pixels[index + 2] = sum;
      }
    }
    vidGrisKernel.updatePixels();
    image(vidGrisKernel, width/2, height/2, width/2, height/2);
  }
}
```

## ASCII art (26 símbolos)

Tamaño del superpixel 4x4 (Imagen compuesta por 128x128 símbolos)

> :P5 sketch=/docs/sketches/ascii26.js, width=700, height=700

The markdown of the above sketch looks like:

```js
let pg;
let img, copy1;

function preload(){  
  copy1 = loadImage("/vc/docs/sketches/lenna.png"); 
}

function setup() {
    createCanvas(700, 700);
    copy1.resize(128,128) //Resizing the image we get the superpixels
    copy1.copy(yuvGrayscale(copy1),0,0,copy1.width,copy1.height,0,0,copy1.width,copy1.height); //Convert to grayscale
    toASCII26(copy1,6,0,0);
}

function monospaceChar(content, size, posX, posY){
    fill(0);
    textSize(size);
    textFont("monospace");
    textStyle(BOLD)
    text(content,posX,posY);
}

function yuvGrayscale(imag){
    let copied = createGraphics(imag.width,imag.height);
    copied.loadPixels();  
    for(let i = 0; i < imag.width; i++) {
      for(let j = 0; j < imag.height; j++) {
        copied.set(i, j, color(0.299*red(imag.get(i, j)) +  0.587*green(imag.get(i, j)) + 0.114*blue(imag.get(i, j))));
      }
    }
    copied.updatePixels();
    return copied;
  }

// Opacity information taken from https://observablehq.com/@grantcuster/sort-font-characters-by-percent-of-black-pixels
function getSimilarChar26(number){
  let ordered = "@$M%HKmd5Xah1ytnziLv+\":\'-." //26 ASCII elements, ordered by opacity
  return ordered.substr(Math.floor(number/10),1) //Returns the corresponding string character for determined opacity of the pixel
}

function toASCII26(imag, size, initialX , initialY){
  for(let i = 0; i < imag.width; i++) {
    for(let j = 0; j < imag.height; j++) {
      monospaceChar(getSimilarChar26(red(imag.get(i, j))),size,0.9*size*i + initialX,0.9*size*j + initialY); //Since the image is already gray, all rgb channels have the same value, we can pick any value
    }
  }
}
```
## ASCII art (52 símbolos)

Tamaño del superpixel 4x4 (Imagen compuesta por 128x128 símbolos)

> :P5 sketch=/docs/sketches/ascii52.js, width=700, height=700

The markdown of the above sketch looks like:

```js
let pg;
let img, copy1;

function preload(){  
  copy1 = loadImage("/vc/docs/sketches/lenna.png"); 
}

function setup() {
    createCanvas(700, 700);
    copy1.resize(128,128) //Resizing the image we get the superpixels
    copy1.copy(yuvGrayscale(copy1),0,0,copy1.width,copy1.height,0,0,copy1.width,copy1.height); //Convert to grayscale
    toASCII52(copy1,6,0,0);
}

function monospaceChar(content, size, posX, posY){
    fill(0);
    textSize(size);
    textFont("monospace");
    textStyle(BOLD)
    text(content,posX,posY);
}

function yuvGrayscale(imag){
    let copied = createGraphics(imag.width,imag.height);
    copied.loadPixels();  
    for(let i = 0; i < imag.width; i++) {
      for(let j = 0; j < imag.height; j++) {
        copied.set(i, j, color(0.299*red(imag.get(i, j)) +  0.587*green(imag.get(i, j)) + 0.114*blue(imag.get(i, j))));
      }
    }
    copied.updatePixels();
    return copied;
  }

// Opacity information taken from https://observablehq.com/@grantcuster/sort-font-characters-by-percent-of-black-pixels
function getSimilarChar52(number){
  let ordered = "@g$WBMR%OHGKSmUdq56X3ahVk1{yt7}nzr]ixLv=<+/\"!;:,\'´-." //52 ASCII elements, ordered by opacity
  return ordered.substr(Math.floor(number/5),1) //Returns the corresponding string character for determined opacity of the pixel
}

function toASCII52(imag, size, initialX , initialY){
  for(let i = 0; i < imag.width; i++) {
    for(let j = 0; j < imag.height; j++) {
      monospaceChar(getSimilarChar52(red(imag.get(i, j))),size,0.9*size*i + initialX,0.9*size*j + initialY); //Since the image is already gray, all rgb channels have the same value, we can pick any value
    }
  }
}
```

## Mosaic

> :P5 sketch=/docs/sketches/mosaic.js, width=512, height=512

The markdown of the above sketch looks like:

```js
let img;
let smaller;
let allImages = [];
let brightImages = new Array(256);
let bright = [];
let scl = 4;

function preload() {
  img = loadImage("/vc/docs/sketches/lenna.png");

  for (let i = 0; i < 160; i++) {
    allImages[i] = loadImage(`/vc/docs/sketches/dataset/image${i}.jpg`);
  }
}

function setup() {
  createCanvas(512, 512);

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

  noLoop();
}

function draw() {
  background(0);

  for (let i = 0; i < (img.width / scl); i++) {
    for (let j = 0; j < (img.width / scl); j++) {
      index = int(brightness(smaller.get(i, j)));
      image(brightImages[index], i * scl, j * scl, scl, scl);
    }
  }
}
```

# Conclusions

+ It's very important to insert several different densities in the ASCII characters we're gonna use.
+ In the photograph mosaic, we need to use images with different color scales to try to represent the image correctly.
+ If we use heavy and a large number of images to represent the whole image, the task becomes a hard computational problem.

# Future work

+ We can use the convolutional mask to modify images that we could use in the future.
+ The photographic mosaic could be an artistic way to express big thoughts into smaller ones.  

# References 

+ [Grayscale](https://en.wikipedia.org/wiki/Grayscale)
+ [HSL and HSV](https://en.wikipedia.org/wiki/HSL_and_HSV)
+ [Kernel (image processing)](https://en.wikipedia.org/wiki/Kernel_(image_processing))
+ [Image Kernels](https://setosa.io/ev/image-kernels/)
+ [ASCII art](https://en.wikipedia.org/wiki/ASCII_art)
+ [Future potentials for ASCII art](http://goto80.com/chipflip/06/)
+ [Photographic mosaic](https://en.wikipedia.org/wiki/Photographic_mosaic)
+ [Photo mosaic challenge](https://www.youtube.com/watch?v=nnlAH1zDBDE)
+ [History of Photo Mosaics](https://digitalartform.com/2017/01/05/history-of-photo-mosaics/)

> :ToCPrevNext

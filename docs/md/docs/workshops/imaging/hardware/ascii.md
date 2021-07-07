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
> >```js | ascii26.js
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
> >    toASCII26(copy1,6,0,0);
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
> >function getSimilarChar26(number){
> >  let ordered = "@$M%HKmd5Xah1ytnziLv+\":\'-." //26 ASCII elements, ordered by opacity
> >  return ordered.substr(Math.floor(number/10),1) //Returns the corresponding string character for determined opacity of the pixel
> >}
> >
> >function toASCII26(imag, size, initialX , initialY){
> >  for(let i = 0; i < imag.width; i++) {
> >    for(let j = 0; j < imag.height; j++) {
> >      monospaceChar(getSimilarChar26(red(imag.get(i, j))),size,0.9*size*i + initialX,0.9*size*j + initialY); //Since the image is already gray, all rgb channels have the same value, we can pick any value
> >    }
> >  }
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
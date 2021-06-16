# Kernel processing

# Problem statement

## Propósito

Introducir el análisis de imágenes/video al implementar las siguientes operaciones de análisis para imágenes/video:

## Tareas

* (imágenes/video) Aplicación de algunas _máscaras de convolución_.

# Background

## Kernel (image processing)

To make image processing we need to use a small matrix that uses different values in it. This matrix is called Kernel. There are lots of effects such as blur, bottom sobel, emboss, identity, etc.

## Kernels imagenes

> :Tabs
> > :Tab title=sketch
> >
> > > :P5 sketch=/docs/sketches/kernels.js, width=512, height=512
> 
> > :Tab title=code
> > 
> >```js | kernels.js
> >let img;
> >let n = 3;// tamaño array kernel
> >function preload() {
> >  img = loadImage("/vc/docs/sketches/lenna.png");
> >}
> >
> >function setup() {
> >  // Create a canvas that's at least the size of the image.
> >  createCanvas(512, 512);
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
> >  // imagen en escala de grises
> >  // ********************************************************************************
> >  imgGrayScale = img.get()
> >  imgGrayScale.loadPixels();
> >  for (var i = 0; i < imgGrayScale.pixels.length; i+=4) {
> >    let r = imgGrayScale.pixels[i + 0];
> >    let g = imgGrayScale.pixels[i + 1];
> >    let b = imgGrayScale.pixels[i + 2];
> >    // let a = img.pixels[index + 3];
> >    let sum = (r*0.3 + g*0.59 + b*0.11);
> >    imgGrayScale.pixels[i + 0] = sum;
> >    imgGrayScale.pixels[i + 1] = sum;
> >    imgGrayScale.pixels[i + 2] = sum;
> >    // img.pixels[index + 3] = sum;
> >  }
> >  imgGrayScale.updatePixels();
> >  image(imgGrayScale, width/2, 0, width/2, height/2);
> >
> >  // outline
> >  // let kernel = [-1,-1,-1, 
> >  //   -1,8,-1,
> >  //   -1,-1,-1]
> >
> >  // bottom sobel
> >  // let kernel = [-1,-2,-1, 
> >  //               0,0,0,
> >  //               1,2,1]
> >
> >  // rightSobel
> >  // let kernel = [-1,0,1, 
> >  //               -2,0,2,
> >  //               -1,0,1]
> >
> >  // leftSobel
> >  // let kernel = [1,0,-1, 
> >  //               2,0,-2,
> >  //               1,0,-1]
> >
> >  // emboss
> >  // let kernel = [-2,-1,0, 
> >  //               -1,1,1,
> >  //               0,1,2]
> >
> >  // blur
> >  // let kernel = [0.0625,0.125,0.0625,
> >  //               0.125,0.25,0.125,
> >  //               0.0625,0.125,0.0625]
> >
> >  // sharpen
> >  // let kernel = [0,-1,0,
> >  //               -1,5,-1,
> >  //               0,-1,0]
> >
> >  // edge
> >  let kernel = [0,-1,0,
> >                -1,4,-1,
> >                0,-1,0]
> >
> >  // ********************************************************************************
> >  // kernel imagen original
> >  // ********************************************************************************
> >  imgColKer = img.get()
> >  imgColKer.loadPixels()
> >  for (var i = 0; i < imgColKer.pixels.length; i+=4) {
> >    let sumr = 0;
> >    let sumg = 0;
> >    let sumb = 0;
> >    for (let tam = 0; tam < n*n; tam++){
> >      let valr = imgColKer.pixels[i + tam*4 + 0];
> >      let valg = imgColKer.pixels[i + tam*4 + 1];
> >      let valb = imgColKer.pixels[i + tam*4 + 2];
> >      sumr += kernel[tam] * valr;
> >      sumg += kernel[tam] * valg;
> >      sumb += kernel[tam] * valb;
> >    }
> >    imgColKer.pixels[i + 0] = sumr;
> >    imgColKer.pixels[i + 1] = sumg;
> >    imgColKer.pixels[i + 2] = sumb;
> >  }
> >  imgColKer.updatePixels();
> >  image(imgColKer, 0, height/2, width/2, height/2);
> >
> >  // ********************************************************************************
> >  // kernel escala de grises
> >  // ********************************************************************************
> >  for (let x = 0; x < width; x++) {
> >    for (let y = 0; y < height; y++) {
> >      var index = (y+x*width)*4;
> >      let sum = 0; 
> >      for (let tam = 0; tam < n*n; tam++){
> >        let val = imgGrayScale.pixels[index + tam*4];
> >        sum += kernel[tam] * val;
> >      }
> >      imgGrayScale.pixels[index + 0] = sum;
> >      imgGrayScale.pixels[index + 1] = sum;
> >      imgGrayScale.pixels[index + 2] = sum;
> >    }
> >  }
> >  imgGrayScale.updatePixels();
> >  image(imgGrayScale, width/2, height/2, width/2, height/2);
> >}
> >```

## Kernels videos

> :Tabs
> > :Tab title=sketch
> >
> > > :P5 sketch=/docs/sketches/kernelsVideo.js, width=512, height=512
> 
> > :Tab title=code
> > 
> >```js | kernelsVideo.js
> >var vid;
> >var n =3
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
> >  // outline
> >  let kernel = [-1,-1,-1, 
> >    -1,8,-1,
> >    -1,-1,-1]
> >
> >  // bottom sobel
> >  // let kernel = [-1,-2,-1, 
> >  //               0,0,0,
> >  //               1,2,1]
> >
> >  // rightSobel
> >  // let kernel = [-1,0,1, 
> >  //               -2,0,2,
> >  //               -1,0,1]
> >
> >  // leftSobel
> >  // let kernel = [1,0,-1, 
> >  //               2,0,-2,
> >  //               1,0,-1]
> >
> >  // emboss
> >  // let kernel = [-2,-1,0, 
> >  //               -1,1,1,
> >  //               0,1,2]
> >
> >  // blur
> >  // let kernel = [0.0625,0.125,0.0625,
> >  //               0.125,0.25,0.125,
> >  //               0.0625,0.125,0.0625]
> >
> >  // sharpen
> >  // let kernel = [0,-1,0,
> >  //               -1,5,-1,
> >  //               0,-1,0]
> >
> >  // edge
> >  // let kernel = [0,-1,0,
> >  //               -1,4,-1,
> >  //               0,-1,0]
> >
> >  // ********************************************************************************
> >  // kernel video original
> >  // ********************************************************************************
> >  vidColKer = vid.get()
> >  if(vidColKer.width > 0) {
> >    vidColKer.loadPixels()
> >    for (var i = 0; i < vidColKer.pixels.length; i+=4) {
> >      let sumr = 0;
> >      let sumg = 0;
> >      let sumb = 0;
> >      for (let tam = 0; tam < n*n; tam++){
> >        let valr = vidColKer.pixels[i + tam*4 + 0];
> >        let valg = vidColKer.pixels[i + tam*4 + 1];
> >        let valb = vidColKer.pixels[i + tam*4 + 2];
> >        sumr += kernel[tam] * valr;
> >        sumg += kernel[tam] * valg;
> >        sumb += kernel[tam] * valb;
> >      }
> >      vidColKer.pixels[i + 0] = sumr;
> >      vidColKer.pixels[i + 1] = sumg;
> >      vidColKer.pixels[i + 2] = sumb;
> >    }
> >    vidColKer.updatePixels();
> >    image(vidColKer, 0, height/2, width/2, height/2);
> >  }
> >
> >  // ********************************************************************************
> >  // kernel escala de grises
> >  // ********************************************************************************
> >  vidGrisKernel = vidGrisLuma.get()
> >  if(vidGrisKernel.width > 0) {
> >    vidGrisKernel.loadPixels()
> >    for (let x = 0; x < width; x++) {
> >      for (let y = 0; y < height; y++) {
> >        var index = (y+x*width)*4;
> >        let sum = 0; 
> >        for (let tam = 0; tam < n*n; tam++){
> >          let val = vidGrisKernel.pixels[index + tam*4];
> >          sum += kernel[tam] * val;
> >        }
> >        vidGrisKernel.pixels[index + 0] = sum;
> >        vidGrisKernel.pixels[index + 1] = sum;
> >        vidGrisKernel.pixels[index + 2] = sum;
> >      }
> >    }
> >    vidGrisKernel.updatePixels();
> >    image(vidGrisKernel, width/2, height/2, width/2, height/2);
> >  }
> >}
> >```

# References

+ [Kernel (image processing)](https://en.wikipedia.org/wiki/Kernel_(image_processing))
+ [Image Kernels](https://setosa.io/ev/image-kernels/)

> :ToCPrevNext
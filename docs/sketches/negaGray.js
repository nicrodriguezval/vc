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
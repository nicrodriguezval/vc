let img;

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
  image(img, 0, 0, img.width/2, img.height/2);
  
  // ********************************************************************************
  // imagen en escala de grises
  // ********************************************************************************
  let imgGrayScale = createImage(img.width, img.height)
  imgGrayScale.copy(img, 0,0, img.width, img.height, 0, 0, img.width, img.height)
  imgGrayScale.loadPixels();
  img.loadPixels();
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      var index = (x+y*width)*4  
      let r = img.pixels[index + 0];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      // let a = img.pixels[index + 3];
      let sum = (r*0.3 + g*0.59 + b*0.11);
      imgGrayScale.pixels[index + 0] = sum;
      imgGrayScale.pixels[index + 1] = sum;
      imgGrayScale.pixels[index + 2] = sum;
      // img.pixels[index + 3] = sum;
    }
  }
  imgGrayScale.updatePixels();
  image(imgGrayScale, img.width/2, 0, img.width/2, img.height/2);
  
  // ********************************************************************************
  // negativo imagen
  // ********************************************************************************
  let imgNegat = createImage(img.width, img.height)
  imgNegat.copy(img, 0,0, img.width, img.height, 0, 0, img.width, img.height)
  imgNegat.loadPixels();
  img.loadPixels();
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      var index = (x+y*width)*4  
      let r = img.pixels[index + 0];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      // let a = img.pixels[index + 3];
      
      imgNegat.pixels[index + 0] = 255-r;
      imgNegat.pixels[index + 1] = 255-g;
      imgNegat.pixels[index + 2] = 255-b;
      // img.pixels[index + 3] = sum;
    }
  }
  imgNegat.updatePixels();
  image(imgNegat, 0, img.height/2, img.width/2, img.height/2);


  // image(imgGrayScale, img.width/2, img.height/2, img.width/2, img.height/2);
}
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
  let kernel = [0,-1,0,
                -1,5,-1,
                0,-1,0]

  // ********************************************************************************
  // kernel imagen original
  // ********************************************************************************
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      var index = (y+x*img.width)*4;
      let sumr = 0;
      let sumg = 0;
      let sumb = 0;
      for (let tam = 0; tam < n*n; tam++){
        let valr = img.pixels[index + tam*4 + 0];
        let valg = img.pixels[index + tam*4 + 1];
        let valb = img.pixels[index + tam*4 + 2];
        sumr += kernel[tam] * valr;
        sumg += kernel[tam] * valg;
        sumb += kernel[tam] * valb;
      }
      img.pixels[index + 0] = sumr;
      img.pixels[index + 1] = sumg;
      img.pixels[index + 2] = sumb;
    }
  }
  img.updatePixels();
  image(img, 0, img.height/2, img.width/2, img.height/2);

  // ********************************************************************************
  // kernel escala de grises
  // ********************************************************************************
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      var index = (y+x*img.width)*4;
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
  image(imgGrayScale, img.width/2, img.height/2, img.width/2, img.height/2);
}
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
        //Y' component in YUV (below this line) is equivalent to LUMA
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
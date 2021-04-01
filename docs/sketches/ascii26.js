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
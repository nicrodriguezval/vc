let img;

function setup() {
  noCanvas();

  img = createImage('vc/docs/sketches/lenna.png');
  img.size(512, 512);
  img.loadPixels();
}

function draw() {
  for(let i = 0; i < img.width; i++) {
    for(let j = 0; j < img.height; j++) {
      img.set(i, j, color(255 - red(img.pixels[i + j]), 255 - green(img.pixels[i + j]), 255 - blue(img.pixels[i + j])));
    }
  }
  
  img.updatePixels();
  Image(img, 0, 0);
}
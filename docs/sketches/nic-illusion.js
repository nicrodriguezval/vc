let img;

function preload() {
  img = loadImage("/vc/docs/sketches/grid-illusions.png");
}

function setup() {
  createCanvas(383, 383);
  image(img, 0, 0, width, height);

  frameRate(1);
}
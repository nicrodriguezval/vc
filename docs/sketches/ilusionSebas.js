var img;

function preload() {
    img = loadImage("/vc/docs/sketches/fatigaRetina.gif");
  }

function setup() {
    // Create a canvas that's at least the size of the image.
    createCanvas(512, 512);
    // noLoop();
}

function draw(){
    image(img, 0, 0, width, height);
}
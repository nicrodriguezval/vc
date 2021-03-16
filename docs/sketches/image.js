let img;

function setup() {
  // create an image using the p5 dom library
  // call modelReady() when it is loaded
  img = loadImage("/vc/docs/sketches/lenna.png");
  createCanvas(512, 512);
  // set the image size to the size of the canvas

  frameRate(1); // set the frameRate to 1 since we don't need it to be running quickly in this case
}

function draw() {
  background(img);

  loadPixels();

  for(let i = 0; i < width; i++) {
    for(let j = 0; j < height; j++) {
      set(i, j, color(255 - red(get(i, j)), 255 - green(get(i, j)), 255 - blue(get(i, j))));
    }
  }

  updatePixels();

  noLoop();
}
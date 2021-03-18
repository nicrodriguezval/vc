let img;
let img1;
let x;
let y;

function preload() {
  img = loadImage("/vc/docs/sketches/lenna.png");
}

function setup() {
  // Create a canvas that's at least the size of the image.
  createCanvas(512, 512);
  image(img, 0, 0, 256, 256);
  img1 = createImage(img.width, img.height);
  img1.copy(img, 0,0, img.width, img.height, 0, 0, img.width, img.height)
  img1.loadPixels();
  for (let i = 0; i < img1.width; i++) {
    for (let j = 0; j < img1.height; j++) {
      c = get(i,j);
      img1.set(i, j, color(255-red(c), 255-green(c), 255-blue(c)));
    }
  }
  img1.updatePixels();

  // y = R*O.3+G*O.59+B*O.11 escala de grises
  img2 = createImage(img.width, img.height)
  img2.copy(img, 0,0, img.width, img.height, 0, 0, img.width, img.height)
  img2.loadPixels();
  for (let i = 0; i < img2.width; i++) {
    for (let j = 0; j < img2.height; j++) {
      c = get(i,j);
      img2.set(i, j, color(red(c)*0.3 + green(c)*0.59 + blue(c)*0.11));
    }
  }
  img2.updatePixels();

  image(img1, 256, 0);
  image(img2, 0, 256);
  image(img, 256, 256);

  // image.hide()
  frameRate(1); // set the frameRate to 1 since we don't need it to be running quickly in this case
}


let img;
let smaller;
let allImages = [];
let brightImages = new Array(256);
let bright = [];
let scl = 4;

function preload() {
  img = loadImage("/vc/docs/sketches/lenna.png");

  for (let i = 0; i < 160; i++) {
    allImages[i] = loadImage(`/vc/docs/sketches/dataset/image${i}.jpg`);
  }
}

function setup() {
  createCanvas(512, 512);

  for (let i = 0; i < allImages.length; i++) {
    avg = 0;

    for (let j = 0; j < allImages[i].width; j++) {
      for (let k = 0; k < allImages[i].height; k++) {
        avg += brightness(allImages[i].get(j, k));
      }
    }

    bright[i] = avg / (allImages[i].width * allImages[i].height);
  }

  for (let i = 0; i < brightImages.length; i++) {
    minDiff = 256;

    for (let j = 0; j < bright.length; j++) {
      diff = abs(i - bright[j]);

      if (diff < minDiff) {
        minDiff = diff;
        brightImages[i] = allImages[j];
      }
    }
  }

  smaller = createImage(img.width / scl, img.height);
  smaller.copy(img, 0, 0, img.width, img.height, 0, 0, img.width / scl, img.height / scl);

  noLoop();
}

function draw() {
  background(0);

  for (let i = 0; i < (img.width / scl); i++) {
    for (let j = 0; j < (img.width / scl); j++) {
      index = int(brightness(smaller.get(i, j)));
      image(brightImages[index], i * scl, j * scl, scl, scl);
    }
  }
}
let theShader;
let img;

function preload() {
  theShader = loadShader('/vc/docs/sketches/hardware/grayscale/shader.vert',
    '/vc/docs/sketches/hardware/grayscale/grayscale.frag');
  img = loadImage('/vc/docs/sketches/lenna.png');
}

function setup() {
  createCanvas(512, 512, WEBGL);
  shader(theShader);
  theShader.setUniform('texture', img);
  noStroke();
  noLoop();
}

function draw() {
  background(0);
  //Original mode
  theShader.setUniform('mode', 0);
  beginShape();
  vertex(-width / 2, -height / 2, 0, 0, 0);
  vertex(0, -height / 2, 0, 1, 0);
  vertex(0, 0, 0, 1, 1);
  vertex(-width / 2, 0, 0, 0, 1);
  endShape(CLOSE);

  //Grayscale mode
  theShader.setUniform('mode', 1);

  //Average grayscale
  theShader.setUniform('RGBval', [1.0 / 3.0, 1.0 / 3.0, 1.0 / 3.0]);
  beginShape();
  vertex(0, -height / 2, 0, 0, 0);
  vertex(width / 2, -height / 2, 0, 1, 0);
  vertex(width / 2, 0, 0, 1, 1);
  vertex(0, 0, 0, 0, 1);
  endShape(CLOSE);

  //luma grayscale
  theShader.setUniform('RGBval', [0.3, 0.59, 0.11]);
  beginShape();
  vertex(-width / 2, 0, 0, 0, 0);
  vertex(0, 0, 0, 1, 0);
  vertex(0, height / 2, 0, 1, 1);
  vertex(-width / 2, height / 2, 0, 0, 1);
  endShape(CLOSE);

  //Negative mode
  theShader.setUniform('mode', 2);
  beginShape();
  vertex(0, 0, 0, 0, 0);
  vertex(width / 2, 0, 0, 1, 0);
  vertex(width / 2, height / 2, 0, 1, 1);
  vertex(0, height / 2, 0, 0, 1);
  endShape(CLOSE);
}
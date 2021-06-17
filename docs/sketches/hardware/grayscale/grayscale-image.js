let theShader;
let img;

function preload() {
  theShader = loadShader('/vc/docs/sketches/hardware/grayscale/shader.vert', '/vc/docs/sketches/hardware/grayscale/texture.frag');
  img = loadImage('/vc/docs/sketches/lenna.png');
}

function setup() {
  createCanvas(512, 512, WEBGL);
  shader(theShader);
}

function draw() {
  background(0);

  // drawing the shape 
  beginShape();
  vertex(-width / 2, -height / 2, 0, 0, 0);
  vertex(width / 2, -height / 2, 0, 1, 0);
  vertex(width / 2, height / 2, 0, 1, 1);
  vertex(-width / 2, height / 2, 0, 0, 1);
  endShape(CLOSE);

  // we need to use the loaded shader on the canvas
  theShader.setUniform('texture', img);
}
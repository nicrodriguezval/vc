let theShader;
let img;

function preload() {
  theShader = loadShader('/vc/docs/sketches/hardware/kernels/shader.vert', '/vc/docs/sketches/hardware/kernels/texture.frag');
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
  //fill('red');
  vertex(-width / 2, -height / 2, 0, 0, 0);
  //fill('blue');
  vertex(width / 2, -height / 2, 0, 1, 0);
  //fill('green');
  vertex(width / 2, height / 2, 0, 1, 1);
  vertex(-width / 2, height / 2, 0, 0, 1);
  endShape(CLOSE);
  // we need to use the shader loaded on the canvas
  theShader.setUniform('texture', img);
  theShader.setUniform('textureWidth', 800.0);
  theShader.setUniform('textureHeight', 360.0);
  theShader.setUniform('kernel', [-1.0, -1.0, -1.0, -1.0, 8.0, -1.0, -1.0, -1.0, -1.0])
}
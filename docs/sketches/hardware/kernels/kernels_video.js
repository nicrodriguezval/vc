let theShader;
let vid;
// convolution masks
let originalMask = [0, 0, 0, 0, 1, 0, 0, 0, 0];
let sharpenMask = [0, -1, 0, -1, 5, -1, 0, -1, 0];
let blurMask = [0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625];
let outlineMask = [-1.0, -1.0, -1.0, -1.0, 8.0, -1.0, -1.0, -1.0, -1.0];
//let botomSobelMask = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
// let rightSobelMask = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
//leftSobelMask = [1, 0, -1, 2, 0, -2, 1, 0, -1];
//embossMask = [-2, -1, 0, -1, 1, 1, 0, 1, 2];
//let edgeMask = [0, -1.0, 0, -1.0, 4.0, -1.0, 0, -1.0, 0];

function preload() {
  theShader = loadShader('/vc/docs/sketches/hardware/kernels/shader.vert',
    '/vc/docs/sketches/hardware/kernels/kernel.frag');
}

function setup() {
  createCanvas(512, 512, WEBGL);
  vid = createVideo(["/vc/docs/sketches/fingers.mov", "/vc/docs/sketches/fingers.webm"]);
  vid.loop();
  vid.hide();
  noStroke();
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
  theShader.setUniform('texture', vid);
  theShader.setUniform('textureWidth', 800.0);
  theShader.setUniform('textureHeight', 360.0);

  //Original Kernel
  theShader.setUniform('kernel', originalMask);
  beginShape();
  vertex(-width / 2, -height / 2, 0, 0, 0);
  vertex(0, -height / 2, 0, 1, 0);
  vertex(0, 0, 0, 1, 1);
  vertex(-width / 2, 0, 0, 0, 1);
  endShape(CLOSE);

  //Sharpen Kernel
  theShader.setUniform('kernel', sharpenMask);
  beginShape();
  vertex(0, -height / 2, 0, 0, 0);
  vertex(width / 2, -height / 2, 0, 1, 0);
  vertex(width / 2, 0, 0, 1, 1);
  vertex(0, 0, 0, 0, 1);
  endShape(CLOSE);

  //Blur Kernel
  theShader.setUniform('kernel', blurMask);
  beginShape();
  vertex(-width / 2, 0, 0, 0, 0);
  vertex(0, 0, 0, 1, 0);
  vertex(0, height / 2, 0, 1, 1);
  vertex(-width / 2, height / 2, 0, 0, 1);
  endShape(CLOSE);

  //Outline Kernel
  theShader.setUniform('kernel', outlineMask);
  beginShape();
  vertex(0, 0, 0, 0, 0);
  vertex(width / 2, 0, 0, 1, 0);
  vertex(width / 2, height / 2, 0, 1, 1);
  vertex(0, height / 2, 0, 0, 1);
  endShape(CLOSE);
}
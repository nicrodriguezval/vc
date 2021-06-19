let theShader;
let img;

function preload() {
  theShader = loadShader('/vc/docs/sketches/hardware/kernels/shader.vert',
    '/vc/docs/sketches/hardware/kernels/kernel.frag');
  img = loadImage('/vc/docs/sketches/lenna.png');
}

function setup() {
  createCanvas(512, 512, WEBGL);
  shader(theShader);
  noStroke();
  noLoop();
}

function draw() {
  background(0);

  // we need to use the loaded shader on the canvas
  theShader.setUniform('texture', img);
  theShader.setUniform('textureWidth', 800.0);
  theShader.setUniform('textureHeight', 360.0);

  // drawing the shape 
  beginShape();
  vertex(-width / 2, -height / 2, 0, 0, 0);
  vertex(width / 2, -height / 2, 0, 1, 0);
  vertex(width / 2, height / 2, 0, 1, 1);
  vertex(-width / 2, height / 2, 0, 0, 1);
  endShape(CLOSE);


  //Bottom sobel Kernel
  //theShader.setUniform('kernel', [-1.0, -2.0, -1.0, 0, 0, 0, 1.0, 2.0, 1.0]);

  //Right sobel Kernel
  //theShader.setUniform('kernel', [-1.0, 0, 1.0, -2.0, 0, 2.0, -1.0, 0, 1.0]);

  //Left sobel Kernel
  //theShader.setUniform('kernel', [1.0, 0, -1.0, 2.0, 0, -2.0, 1.0, 0, -1.0]);

  //Emboss Kernel
  //theShader.setUniform('kernel', [-2.0, -1.0, 0, -1.0, 1.0, 1.0, 0, 1.0, 2.0]);

  //Blur Kernel
  //theShader.setUniform('kernel', [0.0625,0.125,0.0625,0.125,0.25,0.125,0.0625,0.125,0.0625]);

  //Sharpen Kernel
  //theShader.setUniform('kernel', [0, -1.0, 0, -1.0, 5.0, -1.0, 0, -1.0, 0]);

  //Edge Kernel
  //theShader.setUniform('kernel', [0, -1.0, 0, -1.0, 4.0, -1.0, 0, -1.0, 0]);

  //Outline Kernel
  //theShader.setUniform('kernel', [-1.0, -1.0, -1.0, -1.0, 8.0, -1.0, -1.0, -1.0, -1.0]);

  //Original Kernel
  theShader.setUniform('kernel', [0, 0, 0, 0, 1.0, 0, 0, 0, 0]);
  beginShape();
  vertex(-width / 2, -height / 2, 0, 0, 0);
  vertex(0, -height / 2, 0, 1, 0);
  vertex(0, 0, 0, 1, 1);
  vertex(-width / 2, 0, 0, 0, 1);
  endShape(CLOSE);

  //Sharpen Kernel
  theShader.setUniform('kernel', [0, -1.0, 0, -1.0, 5.0, -1.0, 0, -1.0, 0]);
  beginShape();
  vertex(0, -height / 2, 0, 0, 0);
  vertex(width / 2, -height / 2, 0, 1, 0);
  vertex(width / 2, 0, 0, 1, 1);
  vertex(0, 0, 0, 0, 1);
  endShape(CLOSE);

  //Blur Kernel
  theShader.setUniform('kernel', [0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625]);
  beginShape();
  vertex(-width / 2, 0, 0, 0, 0);
  vertex(0, 0, 0, 1, 0);
  vertex(0, height / 2, 0, 1, 1);
  vertex(-width / 2, height / 2, 0, 0, 1);
  endShape(CLOSE);


  //Outline Kernel
  theShader.setUniform('kernel', [-1.0, -1.0, -1.0, -1.0, 8.0, -1.0, -1.0, -1.0, -1.0]);
  beginShape();
  vertex(0, 0, 0, 0, 0);
  vertex(width / 2, 0, 0, 1, 0);
  vertex(width / 2, height / 2, 0, 1, 1);
  vertex(0, height / 2, 0, 0, 1);
  endShape(CLOSE);
}
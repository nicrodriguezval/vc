// this variable will hold our shader object
let theShader;
let img;

function preload() {
  // load the shader
  theShader = loadShader("/vc/docs/sketches/shaders/shader.vert", "/vc/docs/sketches/shaders/texture.frag");
  img = loadImage("/vc/docs/sketches/lenna.png");
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(710, 400, WEBGL);
  // perspective(PI/3.0, width/height, 0.1, 500)
  // ortho(-width/2, width/2, -height/2, height/2);
  noStroke();
  textureMode(NORMAL);
  shader(theShader);
  theShader.setUniform('gray', img);
}

function draw() {
  background(0);
  // texture(img);
  beginShape();
  // fill('red');
  vertex(-width / 2, -height / 2, 0, 0, 0);
  // fill('blue');
  vertex(width / 2, -height / 2, 0, 1, 0);
  // fill('green');
  vertex(width / 2, height / 2, 0, 1, 1);
  // fill('yellow');
  vertex(-width / 2, height / 2, 0, 0, 1);
  endShape(CLOSE);

  // orbitControl();
}
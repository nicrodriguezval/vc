// //this variable will hold our shader object
let simpleShader;
let img;

function preload() {
  img = loadImage("/vc/docs/sketches/lenna.png");
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(710, 400);
  // simpleShader = createShader("/vc/docs/sketches/shaders/shader.vert", "C:/Users/sebca/Videos/4Visual/Grupo/vc/docs/sketches/shaders/texture.frag");
  background(img);
}
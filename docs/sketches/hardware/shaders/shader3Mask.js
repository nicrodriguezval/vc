// this variable will hold our shader object
let theShader;
let img;
let sel;
let mapa= new Map();
let kernel;

function preload() {
  theShader = loadShader("/vc/docs/sketches/hardware/shaders/shader.vert", "/vc/docs/sketches/hardware/shaders/mask.frag");
  img = loadImage("/vc/docs/sketches/lenna.png");
}

function setup() {
  createCanvas(710, 400, WEBGL);
  // perspective(PI/3.0, width/height, 0.1, 500)
  ortho(-width/2, width/2, -height/2, height/2);
  noStroke();
  textureMode(NORMAL);
  shader(theShader);
  theShader.setUniform('texture', img);
  theShader.setUniform('steps', [1/img.width, 1/img.height]);
  kernel = [[0,0,0],[0,1,0],[0,0,0]];
}

function mySelectEvent() {
  let namekernel = sel.value();
  kernel = mapa.get(namekernel);
  // console.log(kernel);
  redraw();
}

function draw() {

  mapa.set("identity",[[0,0,0],[0,1,0],[0,0,0]]);
  mapa.set("sharpen",[[0,-1,0],[-1,5,-1],[0,-1,0]]);
  mapa.set("blur",[[0.0625,0.125,0.0625],[0.125,0.25,0.125],[0.0625,0.125,0.0625]]);
  mapa.set("blur Gaussian",[[1,2,1],[2,4,2],[1,2,1]]);
  mapa.set("emboss",[[-2,-1,0],[-1,1,1],[0,1,2]]);
  mapa.set("edge",[[0,-1,0],[-1,4,-1],[0,-1,0]]);
  mapa.set("edge detection",[[-1,-1,-1],[0,0,0],[1,1,1]]);
  mapa.set("edge detect",[[0,1,0],[1,-4,1],[0,1,0]]);
  mapa.set("leftSobel",[[1,0,-1],[2,0,-2],[1,0,-1]]);
  mapa.set("rightSobel",[[-1,0,1],[-2,0,2],[-1,0,1]]);
  mapa.set("outline",[[-1,-1,-1],[-1,8,-1],[-1,-1,-1]]);
  mapa.set("top sobel",[[1,2,1],[0,0,0],[-1,-2,-1]]);
  mapa.set("bottom sobel",[[-1,-2,-1],[0,0,0],[1,2,1]]);

  sel = createSelect();
  sel.position(10, 10);
  sel.option("")
  sel.option("identity")
  sel.option("sharpen");
  sel.option("blur");
  sel.option("blur Gaussian");
  sel.option("emboss");
  sel.option("edge");
  sel.option("edge detection");
  sel.option("edge detect");
  sel.option("leftSobel");
  sel.option("rightSobel");
  sel.option("outline");
  sel.option("top sobel");
  sel.option("bottom sobel");
  sel.changed(mySelectEvent);

  theShader.setUniform('ku', kernel[0]);
  theShader.setUniform('km', kernel[1]);
  theShader.setUniform('kd', kernel[2]);

  background(0);
  // texture(img);
  beginShape();
  // fill('red');
  vertex(-width / 2, -height / 2, 0, 0, 0);
  // fill('blue')
  vertex(width / 2, -height / 2, 0, 1, 0);
  // fill('green')
  vertex(width / 2, height / 2, 0, 1, 1);
  // fill('yellow')
  vertex(-width / 2, height / 2, 0, 0, 1);
  endShape(CLOSE);

  orbitControl();
}
let depthShader;
let angle = 0.0;

function preload() {
  // Load shader
  depthShader = loadShader('/vc/docs/sketches/rendering/zbuffer.vert',
    '/vc/docs/sketches/rendering/zbuffer.frag');
}

function setup() {
  // Set screen size and renderer
  createCanvas(700, 700, WEBGL);
  noStroke();
  //textureMode(NORMAL);
  shader(depthShader);
  depthShader.setUniform("near", 0.0); // Standard: 0.0
  depthShader.setUniform("far", 100.0); // Standard: 100.0
  depthShader.setUniform("nearColor", [1.0, 1.0, 1.0, 1.0]); // Standard: white
  depthShader.setUniform("farColor", [0.0, 0.0, 0.0, 1.0]); // Standard: black 
}

function draw() {
  // Fill background and set camera
  background(100);
  camera(0, 0, 80, 0, 0, 0, 0, 1, 0);

  //lights that illuminate the background
  specularColor(color(40));
  specularMaterial(0, 240);
  pointLight(color(125), 0, 0, 0);
  pointLight(color(255), 0, -80, -40);
  pointLight(color(255), 0, 80, -40);

  // Calculate angle
  angle += 0.01;

  //ambientMaterial(color(255));
  // Render "sky"-cube
  push();
  rotate(angle, [0, 1, 0]);
  box(80);
  pop();

  noLights();
  //lights that illuminate the background
  ambientMaterial(255);
  //pointLight(color(60), 0, 50, 100);
  pointLight(color(155), 0, 0, 100);
  pointLight(color(120), -width / 2, -width / 2, -200);
  pointLight(color(120), -width / 2, width / 2, -200);
  pointLight(color(120), width / 2, -width / 2, -200);
  pointLight(color(120), width / 2, width / 2, -200);
  //pointLight(color(60), 0, -50, 100);
  //directionalLight(color(170),0,0,-1);

  // Render cubes
  push();
  translate(-30, 20, -25);
  rotate(angle, [1, 1, 1]);
  box(20);
  pop();

  push();
  translate(30, -20, -25);
  rotate(angle, [1, 1, 1]);
  box(20);
  pop();

  // Render spheres
  push();
  translate(-30, -20, -30);
  rotate(angle, [1, 1, 1]);
  sphere(15);
  pop();

  push();
  translate(30, 20, -30);
  rotate(angle, [1, 1, 1]);
  sphere(15);
  pop();
}
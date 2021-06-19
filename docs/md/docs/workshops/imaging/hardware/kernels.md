<h1 align="center">Kernel processing</h1>

# Problem statement

## Propósito

Introducir el análisis de imágenes/video al implementar las siguientes operaciones de análisis para imágenes/video:

## Tareas

* (imágenes/video) Aplicación de algunas _máscaras de convolución_.

# Background

## Kernel (image processing)

To make image processing we need to use a small matrix that uses different values in it. This matrix is called Kernel. There are lots of effects such as blur, bottom sobel, emboss, identity, etc.

## Kernels imagenes

> :Tabs
> > :Tab title=sketch
> >
> > > :P5 sketch=/docs/sketches/hardware/kernels/kernels_image.js, width=512, height=512
> 
> > :Tab title=.js
> > 
> >```js | kernels_image.js
> >let theShader;
> >let img;
> >
> >function preload() {
> >  //theShader = loadShader('/vc/docs/sketches/hardware/kernels/shader.vert', '/vc/docs/sketches/hardware/kernels/texture.frag');
> >  theShader = loadShader('shader.vert', 'kernel.frag');
> >  //img = loadImage('/vc/docs/sketches/lenna.png');
> >  img = loadImage('lenna.png');
> >}
> >
> >function setup() {
> >  createCanvas(512, 512, WEBGL);
> >  shader(theShader);
> >}
> >
> >function draw() {
> >  background(0);
> >
> >  // drawing the shape 
> >  beginShape();
> >  vertex(-width / 2, -height / 2, 0, 0, 0);
> >  vertex(width / 2, -height / 2, 0, 1, 0);
> >  vertex(width / 2, height / 2, 0, 1, 1);
> >  vertex(-width / 2, height / 2, 0, 0, 1);
> >  endShape(CLOSE);
> >
> >  // we need to use the loaded shader on the canvas
> >  theShader.setUniform('texture', img);
> >  theShader.setUniform('textureWidth', 800.0);
> >  theShader.setUniform('textureHeight', 360.0);
> >
> >  //Bottom sobel Kernel
> >  //theShader.setUniform('kernel', [-1.0, -2.0, -1.0, 0, 0, 0, 1.0, 2.0, 1.0]);
> >
> >  //Right sobel Kernel
> >  //theShader.setUniform('kernel', [-1.0, 0, 1.0, -2.0, 0, 2.0, -1.0, 0, 1.0]);
> >
> >  //Left sobel Kernel
> >  //theShader.setUniform('kernel', [1.0, 0, -1.0, 2.0, 0, -2.0, 1.0, 0, -1.0]);
> >
> >  //Emboss Kernel
> >  //theShader.setUniform('kernel', [-2.0, -1.0, 0, -1.0, 1.0, 1.0, 0, 1.0, 2.0]);
> >
> >  //Blur Kernel
> >  //theShader.setUniform('kernel', [0.0625,0.125,0.0625,0.125,0.25,0.125,0.0625,0.125,0.0625]);
> >
> >  //Sharpen Kernel
> >  //theShader.setUniform('kernel', [0, -1.0, 0, -1.0, 5.0, -1.0, 0, -1.0, 0]);
> >                
> >  //Edge Kernel
> >  //theShader.setUniform('kernel', [0, -1.0, 0, -1.0, 4.0, -1.0, 0, -1.0, 0]);
> >
> >  //Outline Kernel
> >  //theShader.setUniform('kernel', [-1.0, -1.0, -1.0, -1.0, 8.0, -1.0, -1.0, -1.0, -1.0]);
> >  
> >  //Original Kernel
> >  theShader.setUniform('kernel', [0, 0, 0, 0, 1.0, 0, 0, 0, 0]);
> >  beginShape();
> >  vertex(-width / 2, -height / 2, 0, 0, 0);
> >  vertex(0, -height / 2, 0, 1, 0);
> >  vertex(0, 0, 0, 1, 1);
> >  vertex(-width / 2, 0, 0, 0, 1);
> >  endShape(CLOSE);
> >
> >  //Sharpen Kernel
> >  theShader.setUniform('kernel', [0, -1.0, 0, -1.0, 5.0, -1.0, 0, -1.0, 0]);
> >  beginShape();
> >  vertex(0, -height / 2, 0, 0, 0);
> >  vertex(width / 2, -height / 2, 0, 1, 0);
> >  vertex(width / 2, 0, 0, 1, 1);
> >  vertex(0, 0, 0, 0, 1);
> >  endShape(CLOSE);  
> >  
> >  //Blur Kernel
> >  theShader.setUniform('kernel', [0.0625,0.125,0.0625,0.125,0.25,0.125,0.0625,0.125,0.0625]);
> >  beginShape();
> >  vertex(-width / 2, 0, 0, 0, 0);
> >  vertex(0, 0, 0, 1, 0);
> >  vertex(0, height / 2, 0, 1, 1);
> >  vertex(-width / 2, height / 2, 0, 0, 1);
> >  endShape(CLOSE);  
> >  
> >
> >  //Outline Kernel
> >  theShader.setUniform('kernel', [-1.0, -1.0, -1.0, -1.0, 8.0, -1.0, -1.0, -1.0, -1.0]);
> >  beginShape();
> >  vertex(0, 0, 0, 0, 0);
> >  vertex(width / 2, 0, 0, 1, 0);
> >  vertex(width / 2, height / 2, 0, 1, 1);
> >  vertex(0, height / 2, 0, 0, 1);
> >  endShape(CLOSE);  
> >}
> >
> >```
> 
> > :Tab title=.vert
> >
> >```glsl | shader.vert
> >// Precision seems mandatory in webgl
> >precision highp float;
> >
> >// 1. Attributes and uniforms sent by p5.js
> >
> >// Vertex attributes and some uniforms are sent by
> >// p5.js following these naming conventions:
> >// https://github.com/processing/p5.js/blob/main/contributor_docs/webgl_mode_architecture.md
> >
> >// 1.1. Attributes
> >// vertex position attribute
> >attribute vec3 aPosition;
> >
> >// vertex texture coordinate attribute
> >attribute vec2 aTexCoord;
> >
> >// vertex color attribute
> >attribute vec4 aVertexColor;
> >
> >// 1.2. Matrix uniforms
> >
> >// The vertex shader should project the vertex position into clip space:
> >// vertex_clipspace = vertex * projection * view * model (see the gl_Position below)
> >// Details here: http://visualcomputing.github.io/Transformations
> >
> >// Either a perspective or an orthographic projection
> >uniform mat4 uProjectionMatrix;
> >
> >// modelview = view * model
> >uniform mat4 uModelViewMatrix;
> >
> >// B. varying variable names are defined by the shader programmer:
> >// vertex color
> >varying vec4 vVertexColor;
> >
> >// vertex texcoord
> >varying vec2 vTexCoord;
> >
> >void main() {
  > >// copy / interpolate color
  > >vVertexColor = aVertexColor;
  > >// copy / interpolate texcoords
  > >vTexCoord = aTexCoord;
  > >// vertex projection into clipspace
  > >gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
> >}
> >```
>
> > :Tab title=.frag
> >
> >```glsl | texture.frag
> >precision mediump float;
> >
> >// texture is sent by the sketch
> >uniform sampler2D texture;
> >
> >uniform float textureWidth;
> >uniform float textureHeight;
> >uniform float kernel[9];
> >// interpolated color (same name and type as in vertex shader)
> >varying vec4 vVertexColor;
> >// interpolated texcoord (same name and type as in vertex shader)
> >varying vec2 vTexCoord;
> >
> >void main(){
> >// texture2D(texture, vTexCoord) samples texture at vTexCoord
> >// and returns the normalized texel color
> >// texel color times vVertexColor gives the final normalized pixel color
> >
> >// vec4 sum = vec4(0.0);
> >float stepSizeX=1.0/textureWidth;
> >float stepSizeY=1.0/textureHeight;
> >
> >//vec4 color = texture2D(texture, vTexCoord) * vVertexColor;
> >//float gray = dot(color.rgb /*color.xyz*/, vec3(0.333, 0.333, 0.333));
> >//gl_FragColor = vec4(vec3(gray), 1.0);
> >
> >vec2 tc0=vTexCoord+vec2(-stepSizeX,-stepSizeY);
> >vec4 col0=texture2D(texture,tc0)*kernel[0];
> >vec2 tc1=vTexCoord+vec2(0.0,-stepSizeY);
> >vec4 col1=texture2D(texture,tc1)*kernel[1];
> >vec2 tc2=vTexCoord+vec2(stepSizeX,-stepSizeY);
> >vec4 col2=texture2D(texture,tc2)*kernel[2];
> >vec2 tc3=vTexCoord+vec2(-stepSizeX,0.);
> >vec4 col3=texture2D(texture,tc3)*kernel[3];
> >vec2 tc4=vTexCoord+vec2(0.0,0.0);
> >vec4 col4=texture2D(texture,tc4)*kernel[4];
> >vec2 tc5=vTexCoord+vec2(stepSizeX,0.0);
> >vec4 col5=texture2D(texture,tc5)*kernel[5];
> >vec2 tc6=vTexCoord+vec2(-stepSizeX,stepSizeY);
> >vec4 col6=texture2D(texture,tc6)*kernel[6];
> >vec2 tc7=vTexCoord+vec2(0.0,stepSizeY);
> >vec4 col7=texture2D(texture,tc7)*kernel[7];
> >vec2 tc8=vTexCoord+vec2(stepSizeX,stepSizeY);
> >vec4 col8=texture2D(texture,tc8)*kernel[8];
> >
> >vec4 sum=col0+col1+col2+col3+col4+col5+col6+col7+col8;
> > 
> >gl_FragColor=vec4(vec3(sum),1.)*vVertexColor;
> >}
> >```

## Kernels videos

> :Tabs
> > :Tab title=sketch
> >
> > > :P5 sketch=/docs/sketches/hardware/kernels/kernels_video.js, width=512, height=512
> 
> > :Tab title=.js
> > 
> >```js | kernels_video.js
> >let theShader;
> >let vid;
> >// convolution masks
> >let originalMask = [0, 0, 0, 0, 1, 0, 0, 0, 0];
> >let sharpenMask = [0, -1, 0, -1, 5, -1, 0, -1, 0];
> >let blurMask = [0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625];
> >let outlineMask = [-1.0, -1.0, -1.0, -1.0, 8.0, -1.0, -1.0, -1.0, -1.0];
> >//let botomSobelMask = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
> >// let rightSobelMask = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
> >//leftSobelMask = [1, 0, -1, 2, 0, -2, 1, 0, -1];
> >//embossMask = [-2, -1, 0, -1, 1, 1, 0, 1, 2];
> >//let edgeMask = [0, -1.0, 0, -1.0, 4.0, -1.0, 0, -1.0, 0];
> >
> >function preload() {
> >  theShader = loadShader('./shader.vert',
> >    './kernel.frag');
> >}
> >
> >function setup() {
> >  createCanvas(512, 512, WEBGL);
> >  vid = createVideo(["/vc/docs/sketches/fingers.mov", 
> >                      "/vc/docs/sketches/fingers.webm"]);
> >  vid.loop()
> >  vid.hide()
> >  noStroke();
> >  shader(theShader);
> >}
> >
> >function draw() {
> >  background(0);
> >
> >  // drawing the shape 
> >  beginShape();
> >  vertex(-width / 2, -height / 2, 0, 0, 0);
> >  vertex(width / 2, -height / 2, 0, 1, 0);
> >  vertex(width / 2, height / 2, 0, 1, 1);
> >  vertex(-width / 2, height / 2, 0, 0, 1);
> >  endShape(CLOSE);
> >
> >  // we need to use the loaded shader on the canvas
> >  theShader.setUniform('texture', vid);
> >  theShader.setUniform('textureWidth', 800.0);
> >  theShader.setUniform('textureHeight', 360.0);
> >
> >  //Original Kernel
> >  theShader.setUniform('kernel', originalMask);
> >  beginShape();
> >  vertex(-width / 2, -height / 2, 0, 0, 0);
> >  vertex(0, -height / 2, 0, 1, 0);
> >  vertex(0, 0, 0, 1, 1);
> >  vertex(-width / 2, 0, 0, 0, 1);
> >  endShape(CLOSE);
> >
> >  //Sharpen Kernel
> >  theShader.setUniform('kernel', sharpenMask);
> >  beginShape();
> >  vertex(0, -height / 2, 0, 0, 0);
> >  vertex(width / 2, -height / 2, 0, 1, 0);
> >  vertex(width / 2, 0, 0, 1, 1);
> >  vertex(0, 0, 0, 0, 1);
> >  endShape(CLOSE);
> >
> >  //Blur Kernel
> >  theShader.setUniform('kernel', blurMask);
> >  beginShape();
> >  vertex(-width / 2, 0, 0, 0, 0);
> >  vertex(0, 0, 0, 1, 0);
> >  vertex(0, height / 2, 0, 1, 1);
> >  vertex(-width / 2, height / 2, 0, 0, 1);
> >  endShape(CLOSE);
> >
> >  //Outline Kernel
> >  theShader.setUniform('kernel', outlineMask);
> >  beginShape();
> >  vertex(0, 0, 0, 0, 0);
> >  vertex(width / 2, 0, 0, 1, 0);
> >  vertex(width / 2, height / 2, 0, 1, 1);
> >  vertex(0, height / 2, 0, 0, 1);
> >  endShape(CLOSE);
> >}
> >```
> 
> > :Tab title=.vert
> >
> >```glsl | shader.vert
> >// Precision seems mandatory in webgl
> >precision highp float;
> >
> >// 1. Attributes and uniforms sent by p5.js
> >
> >// Vertex attributes and some uniforms are sent by
> >// p5.js following these naming conventions:
> >
> >// 1.1. Attributes
> >// vertex position attribute
> >attribute vec3 aPosition;
> >
> >// vertex texture coordinate attribute
> >attribute vec2 aTexCoord;
> >
> >// vertex color attribute
> >attribute vec4 aVertexColor;
> >
> >// 1.2. Matrix uniforms
> >
> >// Either a perspective or an orthographic projection
> >uniform mat4 uProjectionMatrix;
> >
> >// modelview = view * model
> >uniform mat4 uModelViewMatrix;
> >
> >// B. varying variable names are defined by the shader programmer:
> >// vertex color
> >varying vec4 vVertexColor;
> >
> >// vertex texcoord
> >varying vec2 vTexCoord;
> >
> >void main() {
> >// copy / interpolate color
> >vVertexColor = aVertexColor;
> >// copy / interpolate texcoords
> >vTexCoord = aTexCoord;
> >// vertex projection into clipspace
> >gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
> >}
> >```
>
> > :Tab title=.frag
> >
> >```glsl | texture.frag
> >precision mediump float;
> >
> >// texture is sent by the sketch
> >uniform sampler2D texture;
> >
> >uniform float textureWidth;
> >uniform float textureHeight;
> >uniform float kernel[9];
> >// interpolated color (same name and type as in vertex shader)
> >varying vec4 vVertexColor;
> >// interpolated texcoord (same name and type as in vertex shader)
> >varying vec2 vTexCoord;
> >
> >void main(){
> >// texture2D(texture, vTexCoord) samples texture at vTexCoord
> >// and returns the normalized texel color
> >// texel color times vVertexColor gives the final normalized pixel color
> >
> >// vec4 sum = vec4(0.0);
> >float stepSizeX=1.0/textureWidth;
> >float stepSizeY=1.0/textureHeight;
> >
> >//vec4 color = texture2D(texture, vTexCoord) * vVertexColor;
> >//float gray = dot(color.rgb /*color.xyz*/, vec3(0.333, 0.333, 0.333));
> >//gl_FragColor = vec4(vec3(gray), 1.0);
> >
> >vec2 tc0=vTexCoord+vec2(-stepSizeX,-stepSizeY);
> >vec4 col0=texture2D(texture,tc0)*kernel[0];
> >vec2 tc1=vTexCoord+vec2(0.0,-stepSizeY);
> >vec4 col1=texture2D(texture,tc1)*kernel[1];
> >vec2 tc2=vTexCoord+vec2(stepSizeX,-stepSizeY);
> >vec4 col2=texture2D(texture,tc2)*kernel[2];
> >vec2 tc3=vTexCoord+vec2(-stepSizeX,0.);
> >vec4 col3=texture2D(texture,tc3)*kernel[3];
> >vec2 tc4=vTexCoord+vec2(0.0,0.0);
> >vec4 col4=texture2D(texture,tc4)*kernel[4];
> >vec2 tc5=vTexCoord+vec2(stepSizeX,0.0);
> >vec4 col5=texture2D(texture,tc5)*kernel[5];
> >vec2 tc6=vTexCoord+vec2(-stepSizeX,stepSizeY);
> >vec4 col6=texture2D(texture,tc6)*kernel[6];
> >vec2 tc7=vTexCoord+vec2(0.0,stepSizeY);
> >vec4 col7=texture2D(texture,tc7)*kernel[7];
> >vec2 tc8=vTexCoord+vec2(stepSizeX,stepSizeY);
> >vec4 col8=texture2D(texture,tc8)*kernel[8];
> >
> >vec4 sum=col0+col1+col2+col3+col4+col5+col6+col7+col8;
> > 
> >gl_FragColor=vec4(vec3(sum),1.)*vVertexColor;
> >}
> >```

# References

+ [Kernel (image processing)](https://en.wikipedia.org/wiki/Kernel_(image_processing))
+ [Image Kernels](https://setosa.io/ev/image-kernels/)

> :ToCPrevNext
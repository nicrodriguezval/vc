<h1 align="center">Grayscale processing</h1>

# Problem statement

## Propósito

Introducir el análisis de imágenes/video al implementar las siguientes operaciones de análisis para imágenes/video:

## Tareas

* (imágenes/video) Conversión a escala de grises: promedio _rgb_ y _luma_.

# Background

## Grayscale

The grayscale is a kind of image which represents the amount of light of every pixel of the whole image. The image is composed exclusively of shades of gray. The gray color is one in which the RGB channels have got the same or a similar quantity. To transform an image to grayscale, we calculated the average of the components Red, Green and Blue of each pixel, but we can also do this using this equation: Red*0.3+Green*0.59+Blue*0.11.

## Negative and grayscale images

> :Tabs
> > :Tab title=sketch
> >
> > > :P5 sketch=/docs/sketches/hardware/grayscale/grayscale-image.js, width=512, height=512
> 
> > :Tab title=.js
> > 
> >```js | graysale-image.js
> >let theShader;
> >let img;
> >
> >function preload() {
> >  theShader = loadShader('shader.vert', 'texture.frag');
> >  
> >  img = loadImage('lenna.png');
> >}
> >
> >function setup() {
> >  createCanvas(512, 512, WEBGL);
> >  shader(theShader);
> >  theShader.setUniform('texture', img);
> >}
> >
> >function draw() {
> >  background(0);
> >  //Original mode
> >  theShader.setUniform('mode',0);
> >  beginShape();
> >  vertex(-width / 2, -height / 2, 0, 0, 0);
> >  vertex(0, -height / 2, 0, 1, 0);
> >  vertex(0, 0, 0, 1, 1);
> >  vertex(-width / 2, 0, 0, 0, 1);
> >  endShape(CLOSE);
> >  
> >  //Grayscale mode
> >  theShader.setUniform('mode',1); 
> >  
> >  //Average grayscale
> >  theShader.setUniform('RGBval',[1.0/3.0, 1.0/3.0, 1.0/3.0]);
> >  beginShape();
> >  vertex(0, -height / 2, 0, 0, 0);
> >  vertex(width / 2, -height / 2, 0, 1, 0);
> >  vertex(width / 2, 0, 0, 1, 1);
> >  vertex(0, 0, 0, 0, 1);
> >  endShape(CLOSE);  
> >  
> >  //luma grayscale
> >  theShader.setUniform('RGBval',[0.3, 0.59, 0.11]);
> >  beginShape();
> >  vertex(-width / 2, 0, 0, 0, 0);
> >  vertex(0, 0, 0, 1, 0);
> >  vertex(0, height / 2, 0, 1, 1);
> >  vertex(-width / 2, height / 2, 0, 0, 1);
> >  endShape(CLOSE);  
> >  
> >  //Negative mode
> >  theShader.setUniform('mode',2);
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
> >```glsl | grayscale.frag
> >precision mediump float;
> >
> >// texture is sent by the sketch
> >uniform sampler2D texture;
> >
> >uniform float RGBval[3];
> >uniform int mode;
> >
> >// interpolated color (same name and type as in vertex shader)
> >varying vec4 vVertexColor;
> >// interpolated texcoord (same name and type as in vertex shader)
> >varying vec2 vTexCoord;
> >
> >void main(){
> >  // texture2D(texture, vTexCoord) samples texture at vTexCoord
> >  // and returns the normalized texel color
> >  // texel color times vVertexColor gives the final normalized pixel color
> >  
> >  vec4 color = texture2D(texture, vTexCoord) * vVertexColor;
> >  //float gray = dot(color.rgb /*color.xyz*/, vec3(1.0 / 3.0, 1.0 / 3.0, 1.0 / 3.0));
> >  float gray = dot(color.rgb /*color.xyz*/, vec3(RGBval[0],RGBval[1],RGBval[2]));
> >  vec4 negColor = vec4(vec3(1.0) - vec3(color.r,color.g,color.b),1.0);
> >  if(mode == 0){ //Original color mode
> >	gl_FragColor = color;
> >  } else if(mode == 1){ //Grayscale mode
> >	gl_FragColor = vec4(vec3(gray), 1.0);
> >  } else if(mode == 2){ //Negative mode
> >	gl_FragColor = negColor;
> >  }
> >}
> >```

## Negative and grayscale videos

> :Tabs
> > :Tab title=sketch
> >
> > > :P5 sketch=/docs/sketches/negaGrayVideo.js, width=512, height=512
> 
> > :Tab title=.js
> > 
> >```js | grayscale-video.js
> >let theShader;
> >let vid;
> >
> >function preload() {
> >  theShader = loadShader('/vc/docs/sketches/hardware/grayscale/shader.vert',
> >    '/vc/docs/sketches/hardware/grayscale/grayscale.frag');
> >}
> >
> >function setup() {
> >  createCanvas(512, 512, WEBGL);
> >  vid = createVideo(["/vc/docs/sketches/fingers.mov", "/vc/docs/sketches/fingers.webm"]);
> >  vid.loop();
> >  vid.hide();
> >  shader(theShader);
> >  theShader.setUniform('texture', vid);
> >  noStroke();
> >}
> >
> >function draw() {
> >  background(0);
> >
> >  //Original mode
> >  theShader.setUniform('mode', 0);
> >  beginShape();
> >  vertex(-width / 2, -height / 2, 0, 0, 0);
> >  vertex(0, -height / 2, 0, 1, 0);
> >  vertex(0, 0, 0, 1, 1);
> >  vertex(-width / 2, 0, 0, 0, 1);
> >  endShape(CLOSE);
> >
> >  //Grayscale mode
> >  theShader.setUniform('mode', 1);
> >
> >  //Average grayscale
> >  theShader.setUniform('RGBval', [1.0 / 3.0, 1.0 / 3.0, 1.0 / 3.0]);
> >  beginShape();
> >  vertex(0, -height / 2, 0, 0, 0);
> >  vertex(width / 2, -height / 2, 0, 1, 0);
> >  vertex(width / 2, 0, 0, 1, 1);
> >  vertex(0, 0, 0, 0, 1);
> >  endShape(CLOSE);
> >
> >  //luma grayscale
> >  theShader.setUniform('RGBval', [0.3, 0.59, 0.11]);
> >  beginShape();
> >  vertex(-width / 2, 0, 0, 0, 0);
> >  vertex(0, 0, 0, 1, 0);
> >  vertex(0, height / 2, 0, 1, 1);
> >  vertex(-width / 2, height / 2, 0, 0, 1);
> >  endShape(CLOSE);
> >
> >  //Negative mode
> >  theShader.setUniform('mode', 2);
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
> > // copy / interpolate color
> > vVertexColor = aVertexColor;
> > // copy / interpolate texcoords
> > vTexCoord = aTexCoord;
> > // vertex projection into clipspace
> > gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
> >}
> >```
>
> > :Tab title=.frag
> >
> >```glsl | grayscale.frag
> >precision mediump float;
> >
> >// texture is sent by the sketch
> >uniform sampler2D texture;
> >
> >uniform float RGBval[3];
> >uniform int mode;
> >
> >// interpolated color (same name and type as in vertex shader)
> >varying vec4 vVertexColor;
> >// interpolated texcoord (same name and type as in vertex shader)
> >varying vec2 vTexCoord;
> >
> >void main(){
> > // texture2D(texture, vTexCoord) samples texture at vTexCoord
> > // and returns the normalized texel color
> > // texel color times vVertexColor gives the final normalized pixel color
> >  
> > vec4 color = texture2D(texture, vTexCoord) * vVertexColor;
> > //float gray = dot(color.rgb /*color.xyz*/, vec3(1.0 / 3.0, 1.0 / 3.0, 1.0 / 3.0));
> > float gray = dot(color.rgb /*color.xyz*/, vec3(RGBval[0],RGBval[1],RGBval[2]));
> > vec4 negColor = vec4(vec3(1.0) - vec3(color.r,color.g,color.b),1.0);
> > if(mode == 0){ //Original color mode
> > gl_FragColor = color;
> >  } else if(mode == 1){ //Grayscale mode
> >	gl_FragColor = vec4(vec3(gray), 1.0);
> >  } else if(mode == 2){ //Negative mode
> >	gl_FragColor = negColor;
> >  }
> >}
> >```

# References

+ [Grayscale](https://en.wikipedia.org/wiki/Grayscale)
+ [HSL and HSV](https://en.wikipedia.org/wiki/HSL_and_HSV)
+ [RGB to grayscale conversion](https://stackoverflow.com/questions/17615963/standard-rgb-to-grayscale-conversion)

> :ToCPrevNext
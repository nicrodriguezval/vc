<div align="center">
  <h1>
    Z-buffering
  </h1>
</div>

# Problem statement

## Propósito
Realizar indagación teórica-práctica de [rendering](https://visualcomputing.github.io/Rendering).

## Tarea
Realizar una indagación teórica de algún [algoritmo de visibilidad](https://en.wikipedia.org/wiki/Hidden-surface_determination) o algún método de [iluminación global](https://en.wikipedia.org/wiki/Global_illumination#List_of_methods).

# Background

*Z-buffering* , also known as *depth buffering*, is a technique in [graphics programming](https://en.wikipedia.org/wiki/Computer_graphics) and was first described in 1974 by Wolfgang Straßer in his PhD thesis on fast algorithms for rendering occluded objects. Later that year, Edwin Catmull invented the concept of Z-buffer. It is used to determine whether an object (or part of an object) is visible in a scene from a certain perspective. Most of the time, this algorithm is done in hardware, but sometimes is used in software, as well. It is one solution to the visibility problem that is the problem of which rendered scenes are visible and which are hidden. 

When scenes are being rendered, each pixel has two differents coordinates *X* and *Y* (horizontal and vertical orientation to the camera), and a *Z* coordinate (distance from the camera). The z-buffer is a two-dimensional array that stores the Z-value of each screen pixel. If another object must be rendered at the same pixel location (*X*, *Y*), the algorithm compares which Z-value is closer to the camera, if the first one is deeper than the second one, then the algorithm overrides the oldest value. The Z-Buffer algorithm tries to reproduce the usual way we perceive the objects in the real world, a closer object hides a further one.

Also, it's important to know hen a new scene starts, the z-buffer is 1.0, because that is the highest value of it on a scale from 0 to 1 of depth, meaning that almost all the objects are going to have a fewer value and hence will be shown on the scene.

>:P5 width=360, height=240
>
> let img;
>
> function preload() {
>   img = loadImage("/vc/docs/sketches/rendering/z-buffer-rep.png");
> }
>
> function setup() {
>   createCanvas(360, 240);
>   image(img, 0, 0, width, height);
>
>   frameRate(1);
> }

In the previous image, we can see that objects that are located in the back of the scene (i.e. have got a higher Z-buffer) have less illumination than the other ones that are in the front. Every part of each object which isn't showed means that has a higher Z-buffer than the object that is in front of it and its value is stored in order to know which elements the algorithm has to show and which ones should be hidden.

That said, let’s consider an example to understand the algorithm in a better way. In starting, assume that the depth of each pixel is infinite.

>:P5 width=254, height=247
>
> let img;
>
> function preload() {
>   img = loadImage("/vc/docs/sketches/rendering/Zbuffer1.PNG");
> }
>
> function setup() {
>   createCanvas(254, 247);
>   image(img, 0, 0, width, height);
>
>   frameRate(1);
> }

As the z value i.e, the depth value at every place in the given polygon is 3, 2, 1 or 0, on applying the algorithm, the result is.

>:P5 width=251, height=251
>
> let img;
>
> function preload() {
>   img = loadImage("/vc/docs/sketches/rendering/Zbuffer2.PNG");
> }
>
> function setup() {
>   createCanvas(251, 251);
>   image(img, 0, 0, width, height);
>
>   frameRate(1);
> }

Therefore, in the Z buffer method, each surface is processed separately one position at a time across the surface. After that the depth values i.e, the z values for a pixel are compared and the closest i.e, (smallest z) surface determines the color to be displayed in frame buffer. The z values, i.e, the depth values are usually normalized to the range [0, 1]. When the z = 0, it is known as Back Clipping Pane and when z = 1, it is called as the Front Clipping Pane.

In this method, 2 buffers are used:
+ Frame buffer
+ Depth buffer

And, how is the depth calculated? As we know that the equation of the plane is : [ax+by+cz+d=0](:Formula) which implies [z=\frac{-(ax+by+d)}{c}](:Formula), [c \neq 0](:Formula)

Calculation of each depth could be very expensive, but the computation can be reduced to a single add per pixel by using an increment method as shown in figure below:

>:P5 width=287, height=243
>
> let img;
>
> function preload() {
>   img = loadImage("/vc/docs/sketches/rendering/Zbuffer3.PNG");
> }
>
> function setup() {
>   createCanvas(287, 243);
>   image(img, 0, 0, width, height);
>
>   frameRate(1);
> }

Let’s denote the depth at point A as Z and at point B as Z’. Therefore:

[AX + BY + CZ + D = 0](:Formula) implies:

> :Formula align=center
> 
> Z = (-AX - BY - D)/C
>
> Z' = (-A(X + 1) - BY -D)/C

Hence from (1) and (2), we conclude:

> :Formula align=center
>
> Z' = Z - A/C

Hence, calculation of depth can be done by recording the plane equation of each polygon in the (normalized) viewing coordinate system and then using the incremental method to find the depth Z.

This algorithm has the advantage that increases rendering speed for opaque objects, but transparent objects don't benefit since the distant objects are partially invisible and must be fully rendered.

Due to a bad management of a significant chunk of the available memory bandwidth, a lot of methods have been employed to reduce the performance cost of z-buffering, such as lossless compression, and ultra-fast hardware z-clear that makes obsolete the "*one frame positive, one frame negative*" trick. These changes were implemented since 1999.

Despite every single problem the algorithm had for any reason, this technique has the advantage that increases rendering speed for opaque objects, but being aware that transparent objects don't benefit since the distant objects are partially invisible and must be fully rendered, so most of the time this algorithm is a good idea to use in most situations.

# Code (solution) and results

> :Tabs
> > :Tab title=sketch
> >
> > > :P5 sketch=/docs/sketches/rendering/z-buffer.js, width=700, height=700
> 
> > :Tab title=.js
> >
> >```js | z-buffer.js
> >let depthShader;
> >let angle = 0.0;
> >
> >function preload() {
> >  // Load shader
> >  depthShader = loadShader('zbuffer.vert', 'zbuffer.frag');
> >}
> >
> >function setup() {
> >  // Set screen size and renderer
> >  createCanvas(700, 700, WEBGL);
> >  noStroke();
> >  //textureMode(NORMAL);
> >  shader(depthShader);
> >  depthShader.setUniform("near", 0.0); // Standard: 0.0
> >  depthShader.setUniform("far", 100.0); // Standard: 100.0
> >  depthShader.setUniform("nearColor", [1.0, 1.0, 1.0, 1.0]); // Standard: white
> >  depthShader.setUniform("farColor", [0.0, 0.0, 0.0, 1.0]); // Standard: black 
> >}
> >
> >function draw() {
> >  // Fill background and set camera
> >  background(100);
> >  camera(0, 0, 80, 0, 0, 0, 0, 1, 0);
> >
> >  // lights that illuminate the backgound
> >  specularColor(color(40));
> >  specularMaterial(0, 240);
> >  pointLight(color(125), 0, 0, 0);
> >  pointLight(color(255), 0, -80, -40);
> >  pointLight(color(255), 0, 80, -40);
> >
> >  // Calculate angle
> >  angle += 0.01;
> > 
> >  // Render "sky"-cube
> >  push();
> >  rotate(angle, [0, 1, 0]);
> >  box(80);
> >  pop();
> >
> >  noLights();
> >  // lights that illuminate the backgound
> >  ambientMaterial(255);
> >  pointLight(color(155), 0, 0, 100);
> >  pointLight(color(120), -width / 2, -width / 2, -200);
> >  pointLight(color(120), -width / 2, width / 2, -200);
> >  pointLight(color(120), width / 2, -width / 2, -200);
> >  pointLight(color(120), width / 2, width / 2, -200);
> >
> >  // Render cubes
> >  push();
> >  translate(-30, 20, -25);
> >  rotate(angle, [1, 1, 1]);
> >  box(20);
> >  pop();
> >
> >  push();
> >  translate(30, -20, -25);
> >  rotate(angle, [1, 1, 1]);
> >  box(20);
> >  pop();
> >
> >  // Render spheres
> >  push();
> >  translate(-30, -20, -30);
> >  rotate(angle, [1, 1, 1]);
> >  sphere(15);
> >  pop();
> >
> >  push();
> >  translate(30, 20, -30);
> >  rotate(angle, [1, 1, 1]);
> >  sphere(15);
> >  pop();
> >}
> >```
>
> > :Tab title=.frag
> >
> >```glsl | shader.frag
> >uniform mat4 transform;
> >
> >attribute vec4 vertex;
> >attribute vec4 color;
> >
> >varying vec4 vertColor;
> >
> >void main() {
> >    gl_Position = transform * vertex;
> >    vertColor = color;
> >}
> >```
>
> > :Tab title=.vert
> >
> >```glsl | shader.vert
> >precision mediump float;
> >precision mediump int;
> > 
> >uniform vec4 nearColor = vec4(1.0, 1.0, 1.0, 1.0);
> >uniform vec4 farColor = vec4(0.0, 0.0, 0.0, 1.0);
> >uniform float near = 0.0;
> >uniform float far = 100.0;
> >
> >varying vec4 vertColor;
> >
> >void main() {
> >    gl_FragColor = mix(nearColor, farColor, smoothstep(near, far, gl_FragCoord.z / gl_FragCoord.w));
> >}
> >```

# Conclusions

+ Z-buffer is a technique used in several devices such as computers, smartphones, etc. In plenty of cases this technique is a great method to render 3D scenes into video games or 3D simulations because it has a good performance in these sorts of situations.
+ Z-buffer is an algorithm that is better to use in situations where don't exist invisible objects, because in that case the position of that ones should be calculated using a different way.
+ A lot of improvements have been imlemented in the Z-buffer algorithm since it was created in 1974.
+ This method can be executed quickly even with many polygons, because its easy to calculate the depth of a complete row by calculating the depth of only one pixel of that row.

# Future work

+ We expect this technique improves in the future considerably in order to be able to use this method more efficiently to represent multiple polygons in 3d scenarios using a 2-dimensional array.
+ This method has the potential to become the main algorithm to represent different kinds of 3D scenes like in video games.
+ We expect to be able to implement improvements to this algorithm that haven't been implemented before, so that this method uses less resources from the machine.

# References
1. Wikipedia contributors. (2021, 28 junio). Z-buffering. Wikipedia. https://en.wikipedia.org/wiki/Z-buffering
2. LearnOpenGL - Depth testing. (s. f.). Depth Testing. https://learnopengl.com/Advanced-OpenGL/Depth-testing
3. Computer Hope. (2017, 27 junio). What is z-buffering? https://www.computerhope.com/jargon/z/zbuffering.htm
4. Z-Buffer or Depth-Buffer method. geeksforgeeks. https://www.geeksforgeeks.org/z-buffer-depth-buffer-method/
5. How to render z-buffer (Depth pass) image of a 3D scene. https://forum.processing.org/two/discussion/2153/how-to-render-z-buffer-depth-pass-image-of-a-3d-scene

> :ToCPrevNext

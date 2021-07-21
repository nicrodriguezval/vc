<div align="center">
  <h1>
    Z-Buffer
  </h1>
</div>

# Problem statement
Realizar una indagación teórica de algún [algoritmo de visibilidad](https://en.wikipedia.org/wiki/Hidden-surface_determination) o algún método de [iluminación global](https://en.wikipedia.org/wiki/Global_illumination#List_of_methods).

# Background
*Z-buffering* , also known as *depth buffering*, is a technique in [graphics programming](https://en.wikipedia.org/wiki/Computer_graphics). It is used to determine whether an object (or part of an object) is visible in a scene from a certain perspective. Most of the time, this algorithm is done in hardware, but sometimes is used in software, as well. It is one solution to the visibility problem that is the problem of which rendered scenes are visible and which are hidden.

When scenes are being rendered, each pixel has two differents coordinates *X* and *Y* (horizontal and vertical orientation to the camera), and a *Z* coordinate (distance from the camera). The z-buffer is a two-dimensional array that stores the Z-value of each screen pixel. If another object must be rendered at the same pixel location (*X*, *Y*), the algorithm compares which Z-value is closer to the camera, if the first one is deeper than the second one, then the algorithm overrides the oldest value. The Z-Buffer algorithm tries to reproduce the usual way we perceive the objects in the real world, a closer object hides a further one.

That said, let’s consider an example to understand the algorithm in a better way. In starting, assume that the depth of each pixel is infinite.

>:P5 width=360, height=240
>
> let img;
>
> function preload() {
>   img = loadImage("/vc/docs/sketches/rendering/Zbuffer1.png");
> }
>
> function setup() {
>   createCanvas(254, 247);
>   image(img, 0, 0, width, height);
>
>   frameRate(1);
> }

As the z value i.e, the depth value at every place in the given polygon is 3, 2, 1 or 0, on applying the algorithm, the result is.

>:P5 width=360, height=240
>
> let img;
>
> function preload() {
>   img = loadImage("/vc/docs/sketches/rendering/Zbuffer2.png");
> }
>
> function setup() {
>   createCanvas(251, 251);
>   image(img, 0, 0, width, height);
>
>   frameRate(1);
> }

Therefore, in the Z buffer method, each surface is processed separately one position at a time across the surface. After that the depth values i.e, the z values for a pixel are compared and the closest i.e, (smallest z) surface determines the color to be displayed in frame buffer. The z values, i.e, the depth values are usually normalized to the range [0, 1]. When the z = 0, it is known as Back Clipping Pane and when z = 1, it is called as the Front Clipping Pane.

In this method, 2 buffers are used :

+ Frame buffer
+ Depth buffer

And, how is the depth calculated? As we know that the equation of the plane is : ax+by+cz+d=0 which implies z=-(ax+by+d)/c, c!= 0

Calculation of each depth could be very expensive, but the computation can be reduced to a single add per pixel by using an increment method as shown in figure below :

>:P5 width=360, height=240
>
> let img;
>
> function preload() {
>   img = loadImage("/vc/docs/sketches/rendering/Zbuffer3.png");
> }
>
> function setup() {
>   createCanvas(287, 243);
>   image(img, 0, 0, width, height);
>
>   frameRate(1);
> }

Let’s denote the depth at point A as Z and at point B as Z’. Therefore :

AX + BY + CZ + D = 0 implies

Z = (-AX - BY - D)/C  ------------(1)

Similarly, Z' = (-A(X + 1) - BY -D)/C   ----------(2)

Hence from (1) and (2), we conclude :

Z' = Z - A/C  ------------(3)

Hence, calculation of depth can be done by recording the plane equation of each polygon in the (normalized) viewing coordinate system and then using the incremental method to find the depth Z.

This algorithm has the advantage that increases rendering speed for opaque objects, but transparent objects don't benefit since the distant objects are partially invisible and must be fully rendered.

Z-buffering was first described in 1974 by Wolfgang Straßer in his PhD thesis on fast algorithms for rendering occluded objects. Later that year, Edwin Catmull invented the concept of Z-buffer. 

Due to a bad management of a significant chunk of the available memory bandwidth, a lot of methods have been employed to reduce the performance cost of z-buffering, such as lossless compression, and ultra-fast hardware z-clear that makes obsolete the "one frame positive, one frame negative" trick. These changes were implemented since 1999.

## Z-buffer representation

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

# Code (solution) and results
> :Tabs
> > :Tab title=sketch
> >
> > >:P5 width=600, height=480
> > >
> > >let fingers;
> > >
> > >function setup() {
> > >createCanvas(600, 478);
> > >fingers = createVideo('/vc/docs/sketches/rendering/zbuffervid.mp4');
> > >fingers.hide(); // by default video shows up in separate dom
> > >fingers.loop()
> > >}
> > >function draw() {
> > >background(255);
> > >image(fingers, 0, -2); // draw the video frame to canvas
> > >}
> 
> > :Tab title=.pde
> > 
> >```java | zbuffer.pde
> > PShader depthShader;
> > float angle = 0.0;
> > 
> > void setup(){  
> > // Set screen size and renderer
> > size(600, 480, P3D);
> > noStroke();
> >  
> > // Load shader
> > depthShader = loadShader("shader.frag", "shader.vert");
> > //depthShader.set("near", 40.0); // Standard: 0.0
> > //depthShader.set("far", 60.0); // Standard: 100.0
> > //depthShader.set("nearColor", 1.0, 0.0, 0.0, 1.0); // Standard: white
> > //depthShader.set("farColor", 0.0, 0.0, 1.0, 1.0); // Standard: black 
> > }
> >
> > void draw(){
> >   
> > // Fill background and set camera
> > background(#000000);
> > camera(0.0, 0.0, 50.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
> >    
> > // Bind shader
> > shader(depthShader);
> >   
> > // Calculate angle
> > angle += 0.01;
> >  
> > // Render "sky"-cube
> > pushMatrix();
> > rotate(angle, 0.0, 1.0, 0.0);
> > box(100.0);
> > popMatrix();
> >  
> > // Render cubes
> > pushMatrix();
> > translate(-30.0, 20.0, -50.0);
> > rotate(angle, 1.0, 1.0, 1.0);
> > box(25.0);
> > popMatrix();
> > pushMatrix();
> > translate(30.0, -20.0, -50.0);
> > rotate(angle, 1.0, 1.0, 1.0);
> > box(25.0);
> > popMatrix();
> > 
> > // Render spheres
> > pushMatrix();
> > translate(-30.0, -20.0, -50.0);
> > rotate(angle, 1.0, 1.0, 1.0);
> > sphere(20.0);
> > popMatrix();
> > pushMatrix();
> > translate(30.0, 20.0, -50.0);
> > rotate(angle, 1.0, 1.0, 1.0);
> > sphere(20.0);
> > popMatrix();
> > }
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
+ Z-buffer is an algorithm that is better to use in situations where don't exist invisible objects, because in that case the position of that ones should be calculated using a different way.

+ Z-buffer is a great algorithm to represent 3d escenarios in a 2 dimensional array.

+ A lot of improvements have been imlemented in the Z-buffer algorithm since it was created in 1974.

+ This method can be executed quickly even with many polygons, because its easy to calculate the depth of a complete row by calculating the depth of only one pixel of that row.

# Future work
+ ...

# References
1. Wikipedia contributors. (2021, 28 junio). Z-buffering. Wikipedia. https://en.wikipedia.org/wiki/Z-buffering
2. LearnOpenGL - Depth testing. (s. f.). Depth Testing. https://learnopengl.com/Advanced-OpenGL/Depth-testing
3. Z-Buffer or Depth-Buffer method. geeksforgeeks. https://www.geeksforgeeks.org/z-buffer-depth-buffer-method/

> :ToCPrevNext
<div align="center">
  <h1>
    Z-Buffer
  </h1>
</div>

## Problem statement
Realizar una indagación teórica de algún [algoritmo de visibilidad](https://en.wikipedia.org/wiki/Hidden-surface_determination) o algún método de [iluminación global](https://en.wikipedia.org/wiki/Global_illumination#List_of_methods).

## Background
*Z-buffering* , also known as *depth buffering*, is a technique in [graphics programming](https://en.wikipedia.org/wiki/Computer_graphics). It is used to determine whether an object (or part of an object) is visible in a scene from a certain perspective. Most of the time, this algorithm is done in hardware, but sometimes is used in software, as well. It is one solution to the visibility problem that is the problem of which rendered scenes are visible and which are hidden.

When scenes are being rendered, each pixel has two differents coordinates *X* and *Y* (horizontal and vertical orientation to the camera), and a *Z* coordinate (distance from the camera). The z-buffer is a two-dimensional array that stores the Z-value of each screen pixel. If another object must be rendered at the same pixel location (*X*, *Y*), the algorithm compares which Z-value is closer to the camera, if the first one is deeper than the second one, then the algorithm overrides the oldest value. The Z-Buffer algorithm tries to reproduce the usual way we perceive the objects in the real world, a closer object hides a further one.

This algorithm has the advantage that increases rendering speed for opaque objects, but transparent objects don't benefit since the distant objects are partially invisible and must be fully rendered.

### Z-buffer representation

>:P5 width=740, height=400
>
> let img;
>
> function preload() {
>   img = loadImage("/vc/docs/sketches/rendering/z-buffer-rep.png");
> }
>
> function setup() {
>   createCanvas(740, 400);
>   image(img, 0, 0, width, height);
>
>   frameRate(1);
> }

## Code (solution) and results

> :P5 sketch=/docs/sketches/rendering/.js, width=740, height=400

## Conclusions
+ Z-buffer is an algorithm that is better to use in situations where don't exist invisible objects, because in that case the position of that ones should be calculated using a different way.

## Future work
+ ...

## References
1. Wikipedia contributors. (2021, 28 junio). Z-buffering. Wikipedia. https://en.wikipedia.org/wiki/Z-buffering
2. LearnOpenGL - Depth testing. (s. f.). Depth Testing. https://learnopengl.com/Advanced-OpenGL/Depth-testing
3. 

> :ToCPrevNext
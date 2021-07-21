<div align="center">
  <h1>
    Rasterization
  </h1>
</div>

# Problem statement
Visualizar algún algoritmo de computación visual, e.g., image-kernels acá un [ejemplo](https://setosa.io/ev/image-kernels/) o rasterización de un triángulo empleando coordenadas baricéntricas, etc. Nota: se puede emplear la librería [p5.quadrille.js](https://objetos.github.io/p5.quadrille.js/).

# Background

## Rasterization
The *rasterization rendering technique* is a common technique used to render images of 3D scenes. The algorithm takes an image described in a vector graphic formant and converting it into a raster image. The raster image could be described as a series of pixels, dots or lines, and they together can represent the whole initial image.

This technique was created a long time ago (between the '60s and the early '80s), it doesn't mean that it is obsolete, quite the contrary, plenty of the images which are rendered use this technique. This algorithm solves the **visibility problem** where we want to describe which parts of 3D objects are visible to the camera located at a certain point. We need to be aware that some parts of the object could be either hidden by others objects on the scene or outside of the camera's visibility.

There are lots of rasterization algorithms and they are different, however, they're based in the same overall principle. In other words, all these algorithms are different ways to develop de same idea. To rasterize a triangle we're gonna use a method called *barycentric coordinates*.

## Triangle rasterization using barycentric coordinates
When we are talking about a  triangle in 2D, it consists in 3 vertices and 3 edges and it divides the plane into two regions: the *interior*, which is finite, and the *exterior* which is not. These regions are delimited or separated by the boundary of the triangle and its three edges. If we want to rasterize a triangle, we need to query a bunch of points which corresponding to the pixel grid, and find out whether they are inside or not.

So, what are barycentric coordinates? they can be used to express the position of any point located, in this particular case, on the triangle with three scalars [w_0, w_1, w_2](:Formula) that acts as *weights* for the corresponding vertices. The position could be any position inside or on the triangle, any of the edges, or tringle's vertices. For example, the coordinates [(1, 0, 0)](:Formula), [(0, 1, 0)](:Formula), [(0, 0, 1)](:Formula) correspond to [v_0](:Formula), [v_1](:Formula) and [v_2](:Formula) respectively. So we can compute the position of a certain point using the next equation:

> :Formula align=center
> 
> P = uA + uB + wC

Where [A](:Formula), [B](:Formula), [C](:Formula) are the triangle's vertices and [u](:Formula), [v](:Formula), [w](:Formula) the barycentric coordinates, where [u + v + w = 1](:Formula) (v.c. are normalized). The point [P](:Formula) is within the triangle if [0 \leq u, v, w \leq 1](:Formula), if any point is zero means that the point is on the edge, and if any point is negative or greater than one that's because it is outside the triangle.

>:P5 width=285, height=285
>
> let img;
>
> function preload() {
>   img = loadImage("/vc/docs/sketches/rendering/bCoordinates.png");
> }
>
> function setup() {
>   createCanvas(285, 285);
>   image(img, 0, 0, width, height);
>
>   frameRate(1);
> }

# Code (solution) and results

> :P5 sketch=/docs/sketches/rendering/.js, width=740, height=400

# Conclusions
+ ...

# Future work
+ ...

# References
1. Wikipedia contributors. (2021, 10 julio). Rasterisation. Wikipedia. https://en.wikipedia.org/wiki/Rasterisation
2. S. (2015, 25 enero). Rasterization: a Practical Implementation. Scratchapixel. https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/overview-rasterization-algorithm 
3. The barycentric conspiracy. (2017, 9 abril). The Ryg Blog. https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/
4. S. (2014, 15 agosto). Ray Tracing: Rendering a Triangle (Barycentric Coordinates). © 2009–2016 Scratchapixel. https://www.scratchapixel.com/lessons/3d-basic-rendering/ray-tracing-rendering-a-triangle/barycentric-coordinates

> :ToCPrevNext
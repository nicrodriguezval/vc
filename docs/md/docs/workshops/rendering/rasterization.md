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

>:P5 width=754, height=275
>
> let img;
>
> function preload() {
>   img = loadImage("/vc/docs/sketches/rendering/rasterizatioExample.png");
> }
>
> function setup() {
>   createCanvas(754, 275);
>   image(img, 0, 0, width, height);
>
>   frameRate(1);
> }

## Triangle rasterization using barycentric coordinates

When we are talking about a  triangle in 2D, barycentric coordinates are also known as *area coordinates* or *areal coordinates*, it consists in 3 vertices and 3 edges and it divides the plane into two regions: the *interior*, which is finite, and the *exterior* which is not. These regions are delimited or separated by the boundary of the triangle and its three edges. If we want to rasterize a triangle, we need to query a bunch of points which corresponding to the pixel grid, and find out whether they are inside or not.

So, what are barycentric coordinates? Barycentric coordinates are a type of homogeneous coordinates, and in fact both were introduced in the same paper by Möbius in 1827. They can be used to express the position of any point located, in this particular case, on the triangle with three scalars [w_0, w_1, w_2](:Formula) that acts as *weights* for the corresponding vertices. The position could be any position inside or on the triangle, any of the edges, or tringle's vertices. For example, the coordinates [(1, 0, 0)](:Formula), [(0, 1, 0)](:Formula), [(0, 0, 1)](:Formula) correspond to [v_0](:Formula), [v_1](:Formula) and [v_2](:Formula) respectively. So we can compute the position of a certain point using the next equation:

> :Formula align=center
> 
> p = \frac{w_0v_0 + w_1v_1 + w_2v_2}{w_0 + w_1 + w_2}

Where [v_0](:Formula), [v_1](:Formula), [v_2](:Formula) are the triangle's vertices and [w_0](:Formula), [w_1](:Formula), [w_2](:Formula) the barycentric coordinates, where [w_0 + w_1 + w_2 = 1](:Formula) (v.c. are normalized). The point [p](:Formula) is within the triangle if [0 \leq w_0, w_1, w_2 \leq 1](:Formula), if any point is zero means that the point is on the edge, and if any point is negative or greater than one that's because it is outside the triangle. Since we divide through by their sum, they’re only unique up to scale.

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

To get a normalized version of the barycentric coordinates [\lambda](:Formula), before we need to know about the *edge functions* that tell us how a point [p](:Formula) is related to a certain edge. For example, regarding de edges [v_0v_1, v_1v_2, v_2v_0](:Formula) and a point [p](:Formula) we've got:

> :Formula align=center
>
> F_{01}(p) := (v_{0y} - v_{1y})p_x + (v_{1x} - v_{0x})p_y + (v_{0x}v_{1y} - v_{0y}v_{1x})
>
> F_{12}(p) := (v_{1y} - v_{2y})p_x + (v_{2x} - v_{1x})p_y + (v_{1x}v_{2y} - v_{1y}v_{2x})
>
> F_{20}(p) := (v_{2y} - v_{0y})p_x + (v_{0x} - v_{2x})p_y + (v_{2x}v_{0y} - v_{2y}v_{0x})

These are what we'll call the *edge functions* for every single edge on the triangle, where [F_{01}(p) + F_{12}(p) + F_{20}(p) = F_{01}(v_2) = F_{12}(v_0) = F_{20}(v_1) = 2\triangle{(v_0, v_1, v_2)}](:Formula).

Already having knowledge about the *edge functions* we can define [\lambda](:Formula) as a normalized version of the barycentric coordinates with their sum always being 1:

> :Formula align=center
>
> \lambda_0(p):= \frac{F_{12}(p)}{2\triangle{(v_0, v_1, v_2)}}
>
> \lambda_1(p):= \frac{F_{20}(p)}{2\triangle{(v_0, v_1, v_2)}}
>
> \lambda_2(p):= \frac{F_{01}(p)}{2\triangle{(v_0, v_1, v_2)}}

# Code (solution) and results
> :Tabs
> > :Tab title=sketch
> >
> > > :P5 sketch=/docs/sketches/rendering/barycentricCoordinates.js, width=800, height=400
>
> > :Tab title=code
> >
> >```js |barycentricCoordinates.js
> >let pg;
> >let pg2;
> >//Declaracion de variables para las coordenadas
> >var alpha;
> >var beta;
> >var gamma;
> >var alphaS;
> >var betaS;
> >var gammaS;
> >
> >/* Definición de coordenadas baricentricas a partir de tres puntos de un 
> >   triangulo (a, b, c) y un punto arbitrario p=(x,y)*/
> >function barycentric(ax, ay, bx, by, cx, cy, x, y) {
> >    var d = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
> >    alpha = ((by - cy) * (x - cx) + (cx - bx) * (y - cy)) / d;
> >    beta = ((cy - ay) * (x - cx) + (ax - cx) * (y - cy)) / d;
> >    gamma = 1.0 - alpha - beta;
> >    alphaS = nf(alpha, 1, 2);
> >    betaS = nf(beta, 1, 2);
> >    gammaS = nf(gamma, 1, 2);
> >}
> >
> >// Declaracion de variables usadas en la realizacion de la cuadricula en el canvas
> >var squares;
> >var squaresF;
> >var row;
> >var col;
> >var pointA;
> >var i;
> >var j;
> >
> >//Algoritmo de Rasterizacion que emplea coordenadas baricentricas
> >function drawSquares() {
> >    //Inicializacion de contadores
> >    i = 0;
> >    j = 0;
> >    col = 0;
> >    row = squaresF;
> >    //Recorrer las columnas y las filas
> >    for (i = 0; i <= squares; i++) {
> >        col = 0;
> >        for (j = 0; j <= squares; j++) {
> >            //Grosor del trazo
> >            strokeWeight(1);
> >            /*Si el punto medio de la celda que estoy analizando esta dentro del 
> >             area cubierta por el triangulo*/
> >            if (inside_triangle(ax, ay, bx, by, cx, cy, col + pointA, row + pointA)) {
> >                //Calcular las coordenadas baricentricas del punto medio de la celda
> >                barycentric(ax, ay, bx, by, cx, cy, col + pointA, row + pointA);
> >                /*Rellenar la celda con la interpolacion entre las coordenadas 
> >                  baricentricas y los colores definidos*/
> >                pg2.fill(239 * alpha, 247 * beta, 255 * gamma);
> >                //Dibujar la celda recien analizada
> >                pg2.rect(col, row, squaresF, squaresF);
> >            } else {
> >                //Si el punto medio no está en el area cubierta por el triangulo
> >                //Rellenar de color blanco la celda
> >                pg2.fill(255, 255, 255);
> >                //Dibujar la celda recien analizada
> >                pg2.rect(col, row, squaresF, squaresF);
> >            }
> >            //Pintar el en canvas el punto medio de la celda analizada
> >            strokeWeight(3);
> >            stroke(153, 153, 255);
> >            point(col + pointA, row + pointA);
> >            //Poner el color de trazo en negro para el siguiente ciclo
> >            stroke(0);
> >            /*Actualizar la variable col con el valor de la ubicacion del
> >              inicio de la siguiente columna de celdas*/
> >            col += squaresF;
> >        }
> >        /*Actualizar la variable row con el valor de la ubicacion del 
> >          inicio de la siguiente fila de celdas*/
> >        row += squaresF;
> >    }
> >    //Poner el rellenado en transparenete para el siguiente ciclo del canvas
> >    pg2.fill(255, 255, 255, 0);
> >}
> >
> >/* Comprobación de si un punto (x, y) dado esta dentro del área que cubre 
> >   un triangulo con vertices a, b, c*/
> >// 1. Calcula coordenadas baricentricas del punto p
> >// 2. Comprueba si los valores de alpha, beta y gamma tienen valores entre 0 y 1, 
> >//   es decir demostrando que p está dentro del triangulo
> >function inside_triangle(ax, ay, bx, by, cx, cy, x, y) {
> >    var d = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
> >    var alpha = ((by - cy) * (x - cx) + (cx - bx) * (y - cy)) / d;
> >    var beta = ((cy - ay) * (x - cx) + (ax - cx) * (y - cy)) / d;
> >    var gamma = 1.0 - alpha - beta;
> >    return !(alpha < 0 || alpha > 1 || beta < 0 || beta > 1 || gamma < 0 || gamma > 1);
> >}
> >
> >// Declaracion de variables para definir los tres puntos que conforman el triangulo
> >var ax;
> >var ay;
> >var bx;
> >var by;
> >var cx;
> >var cy;
> >
> >// Setup del canvas con la inicialización de variables y la creación del canvas
> >function setup() {
> >    alpha = 0;
> >    beta = 0;
> >    gamma = 0;
> >    alphaS = null;
> >    betaS = null;
> >    gammaS = null;
> >    //Cantidad de celdas en alto y ancho que habrá en la cuadrícula
> >    squares = 20;
> >    //Valor del tammaño de cada celda de la cuadricula inicial
> >    squaresF = 10;
> >    //Contador de la fila y la columna inicial de la cuadricula
> >    row = 0;
> >    col = 0;
> >    //Punto medio inicial
> >    pointA = 0;
> >    //Contadores de ciclos
> >    i = 0;
> >    j = 0;
> >    //Coordenadas del triangulo inicial
> >    ax = 0;
> >    ay = 0;
> >    bx = 0;
> >    by = 0;
> >    cx = 0;
> >    cy = 0;
> >    //Creación del canvas
> >    createCanvas(800, 400);
> >    pg = createGraphics(400, 400);
> >    pg2 = createGraphics(400, 400);
> >    //Definir cantidad de pixeles por celda de la cuadrícula
> >    squaresF = ((width/2) / squares);
> >    // Punto medio de la primer celda
> >    pointA = (squaresF / 2);
> >    //Coordenadas del triangulo inicial
> >    //Definición del modo de color y escala de este
> >    pg.colorMode(RGB, 255);
> >    //Coordenadas del triangulo inicial
> >    ax = width / 8;
> >    ay = 50;
> >    bx = ax * 3;
> >    by = 50;
> >    cx = ((bx - ax) / 2) + ax;
> >    cy = height - 11;
> >}
> >
> >function draw() {
> >    //Poner fondo blanco en el canvas
> >    background(255);
> >    pg.background(100);
> >    //pg2.background(254);
> >    //Dibujar la cuadrícula y rasterizar el tríangulo actual
> >    drawSquares();
> >    //Grosor del trazado 
> >    pg.strokeWeight(1);
> > 
> >    //Tazar con color negro
> >    pg.stroke(0);
> >    pg2.stroke(0);
> >    //Rellenar con color negro el triangulo actual
> >    pg.fill(1);
> >    pg.triangle(ax, ay, bx, by, cx, cy);
> >    pg2.triangle(ax, ay, bx, by, cx, cy);
> >  
> >    //Calcular coordenadas baricentricas
> >    barycentric(ax, ay, bx, by, cx, cy, mouseX, mouseY);
> >    //Estilizar tamaño de texto y alineación del mismo en el canvas
> >    pg.textSize(20);
> >    pg.textAlign(LEFT, CENTER);
> >    //Mostrar en pantalla los valores calculados de alpha, beta y gamma
> >    pg.fill(163, 217, 255);
> >    pg.text("λ0: " + alphaS, 10, 60);
> >    pg.fill(220, 247, 99);
> >    pg.text("λ1: " + betaS, 10, 80);
> >    pg.fill(239, 199, 194);
> >    pg.text("λ2: " + gammaS, 10, 100);
> >
> >    pg.strokeWeight(2);
> >    /*Si el mouse está en el area dentro del triangulo llenar los subtriangulos 
> >    que se forman entre el mouse y los vertices con el color respectivo*/
> >    if (inside_triangle(ax, ay, bx, by, cx, cy, mouseX, mouseY)) {
> >        pg.stroke(0, 0, 0);
> >        pg.fill(239, 199, 194);
> >        pg.triangle(ax, ay, mouseX, mouseY, bx, by);
> >        pg.fill(163, 217, 255);
> >        pg.triangle(bx, by, mouseX, mouseY, cx, cy);
> >        pg.fill(220, 247, 99);
> >        pg.triangle(cx, cy, mouseX, mouseY, ax, ay);
> >    } else {
> >        pg.stroke(1, 0, 0);
> >    }
> >    //Marcador de punto en la ubicación del cursor en el canvas
> >    pg.point(mouseX, mouseY);
> >
> >    /*Cambio de coordenadas de los vertices del triangulo segun el 
> >    click con los botones central, derecho e izquierdo*/
> >    if (mouseIsPressed) {
> >        if (mouseButton == LEFT) {
> >            ax = mouseX;
> >            ay = mouseY;
> >        }
> >        if (mouseButton == RIGHT) {
> >            bx = mouseX;
> >            by = mouseY;
> >        }
> >        if (mouseButton == CENTER) {
> >            cx = mouseX;
> >            cy = mouseY;
> >        }
> >    }
> >
> >    image(pg, 0, 0)
> >    image(pg2, 400, 0, 400, 400)
> >}
> >```

# Conclusions

+ ...

# Future work

+ ...

# References

1. Wikipedia contributors. (2021, 10 julio). Rasterisation. Wikipedia. https://en.wikipedia.org/wiki/Rasterisation
2. S. (2015, 25 enero). Rasterization: a Practical Implementation. Scratchapixel. https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/overview-rasterization-algorithm 
3. The barycentric conspiracy. (2017, 9 abril). The Ryg Blog. https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/
4. S. (2014, 15 agosto). Ray Tracing: Rendering a Triangle (Barycentric Coordinates). © 2009–2016 Scratchapixel. https://www.scratchapixel.com/lessons/3d-basic-rendering/ray-tracing-rendering-a-triangle/barycentric-coordinates
5. Barycentric Coordinates. (s. f.). OpenProcessing. https://openprocessing.org/sketch/187087/
6. JoseMolano. (2017, 27 noviembre). CompVisualProy. GitHub repository. https://github.com/JoseMolano/CompVisualProy.git

> :ToCPrevNext

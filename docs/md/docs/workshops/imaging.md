# Image and video processing

## Propósito

Introducir el análisis de imágenes/video al implementar las siguientes operaciones de análisis para imágenes/video:

## Tareas

Implementar:

* (imágenes/video) Conversión a escala de grises: promedio _rgb_ y [luma](https://en.wikipedia.org/wiki/HSL_and_HSV#Disadvantages).
* (imágenes/video) Aplicación de algunas [máscaras de convolución](https://en.wikipedia.org/wiki/Kernel_(image_processing)).
* (solo para imágenes) Conversión de la imagen a [ascii art](https://en.wikipedia.org/wiki/ASCII_art). Nota: Se puede emplear [p5.quadrille.js](https://objetos.github.io/p5.quadrille.js/).
* (solo para imágenes) Conversión de la imagen a un [foto-mosaico](https://en.wikipedia.org/wiki/Photographic_mosaic).

## Entrega

* Emplear esta página para realizar el reporte de la actividad en el formato de [blog-post](/#grading) sugerido.
* Antes de las 24h del 4/4/21.
* Exposiciones en las clase(s) subsiguiente(s). Tiempo: 7m (5m presentación del reporte + 2m preguntas).
Took from the [ml5](https://ml5js.org/) example [here](https://learn.ml5js.org/#/reference/facemesh?id=examples). Also shows how to load an image.

# Negativo y escala de grises imágenes

> :P5 sketch=/docs/sketches/negaGray.js, width=512, height=512

The markdown of the above sketch looks like:

```md
> :P5 sketch=/docs/sketches/negaGray.js, width=512, height=512
``` 

# Negativo y escala de grises videos

> :P5 sketch=/docs/sketches/negaGrayVideo.js, width=512, height=512

The markdown of the above sketch looks like:

```md
> :P5 sketch=/docs/sketches/negaGrayVideo.js, width=512, height=512
``` 

# Kernels imagenes

> :P5 sketch=/docs/sketches/kernels.js, width=512, height=512

The markdown of the above sketch looks like:

```md
> :P5 sketch=/docs/sketches/kernels.js, width=512, height=512
```

Check the [component specs](/docs/snippets/component) for details.

# Kernels videos

> :P5 sketch=/docs/sketches/kernelsVideo.js, width=512, height=512

The markdown of the above sketch looks like:

```md
> :P5 sketch=/docs/sketches/kernelsVideo.js, width=512, height=512
```

Check the [component specs](/docs/snippets/component) for details.

# ASCII art (26 símbolos)

Tamaño del superpixel 4x4 (Imagen compuesta por 128x128 símbolos)

> :P5 sketch=/docs/sketches/ascii26.js, width=700, height=700

The markdown of the above sketch looks like:

```md
> :P5 sketch=/docs/sketches/ascii26.js, width=700, height=700
```
# ASCII art (52 símbolos)

Tamaño del superpixel 4x4 (Imagen compuesta por 128x128 símbolos)

> :P5 sketch=/docs/sketches/ascii52.js, width=700, height=700

The markdown of the above sketch looks like:

```md
> :P5 sketch=/docs/sketches/ascii52.js, width=700, height=700
```

> :ToCPrevNext

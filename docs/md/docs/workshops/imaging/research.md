# Image and Video Processing

# Problem statement

## Propósito

Introducir el análisis de imágenes/video al implementar las siguientes operaciones de análisis para imágenes/video:

## Tareas

Implementar:

* (imágenes/video) Conversión a escala de grises: promedio _rgb_ y _luma_.
* (imágenes/video) Aplicación de algunas _máscaras de convolución_.
* (solo para imágenes) Conversión de la imagen a _ascii art_.
* (solo para imágenes) Conversión de la imagen a un _foto-mosaico_.

# Background

## Grayscale

The grayscale is a kind of image which represents the amount of light of every pixel of the whole image. The image is composed exclusively of shades of gray. The gray color is one in which the RGB channels have got the same or a similar quantity. To transform an image to grayscale, we calculated the average of the components Red, Green and Blue of each pixel, but we can also do this using this equation: Red*0.3+Green*0.59+Blue*0.11.

## Kernel (image processing)

To make image processing we need to use a small matrix that uses different values in it. This matrix is called Kernel. There are lots of effects such as blur, bottom sobel, emboss, identity, etc.

## ASCII art

ASCII art is a technique that represents an image into characters of the ASCII standard. This technique of representing images using characters is old, one of the first representations we know is "Simmias de Rodas. El hacha, ca. 300 a. C." which looks like the below image.

>:P5 width=280, height=415
>
> let img;
>
> function preload() {
>   img = loadImage("/vc/docs/sketches/asciibackground.png");
> }
>
> function setup() {
>   createCanvas(280, 415);
>   image(img, 0, 0, width, height);
>
>   frameRate(1);
> }

We represented Lenna's photo using this technique.

## Photographic mosaic

A photographic mosaic is an image or picture that has been split into smaller sections, usually grids or squares. The original image is represented by others smaller photos that are in the grids and they fulfill the property that they've got a similar color to the section they're representing. Joseph Francis is believed to be the inventor of the kind of photographic mosaics that we see nowadays. In this example, we are representing the photo of Lenna with a mosaic.

# Conclusions

+ It's very important to insert several different densities in the ASCII characters we're gonna use.
+ In the photograph mosaic, we need to use images with different color scales to try to represent the image correctly.
+ If we use heavy and a large number of images to represent the whole image, the task becomes a hard computational problem.
+ Using the Ascii art technique is a pretty good way to represent images, and it is not hard to program.

# Future work

+ We can use the convolutional mask to modify images that we could use in the future.
+ The photographic mosaic could be an artistic way to express big thoughts into smaller ones.   

# References 

+ [Grayscale](https://en.wikipedia.org/wiki/Grayscale)
+ [HSL and HSV](https://en.wikipedia.org/wiki/HSL_and_HSV)
+ [Kernel (image processing)](https://en.wikipedia.org/wiki/Kernel_(image_processing))
+ [Image Kernels](https://setosa.io/ev/image-kernels/)
+ [ASCII art](https://en.wikipedia.org/wiki/ASCII_art)
+ [Future potentials for ASCII art](http://goto80.com/chipflip/06/)
+ [Photographic mosaic](https://en.wikipedia.org/wiki/Photographic_mosaic)
+ [Photo mosaic challenge](https://www.youtube.com/watch?v=nnlAH1zDBDE)
+ [History of Photo Mosaics](https://digitalartform.com/2017/01/05/history-of-photo-mosaics/)
+ [RGB to grayscale conversion](https://stackoverflow.com/questions/17615963/standard-rgb-to-grayscale-conversion)

> :ToCPrevNext

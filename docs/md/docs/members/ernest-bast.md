# Ernesto Bastidas Pulido

## Ilusión

Esta ilusión se basa en que las líneas en realidad son paralelas, pero la imagen hace que se vean torcidas.

> :P5 lib1=https://unpkg.com/ml5@latest/dist/ml5.min.js, sketch=/docs/sketches/pl.js, width=512, height=512

<script>
let img;

function setup() {
  // create an image using the p5 dom library
  // call modelReady() when it is loaded
  img = loadImage("/vc/docs/sketches/Paralelas.png");
  createCanvas(512, 512);
  // set the image size to the size of the canvas

  frameRate(1); // set the frameRate to 1 since we don't need it to be running quickly in this case
}

function draw() {
  background(img);

  noLoop();
}
</script>

## Bio
Naci en diciembre de 1999, me gradué del colegio en 2016 e inmediatamente empecé a estudiar sistemas en la Universidad Nacional. Escogí esta carrera debido a que siempre me han gustado las matemáticas y la lógica. 

## Interests

Cryptografía, Desarrollo de software, Inteligencia Artificial, Redes Neuronales y Seguridad Informática

## Contributions

Backend y certificado https en [Geosmart app](https://github.com/GEGOSMART), varios programas de python [Tesseract OCR](https://en.wikipedia.org/wiki/Tesseract_(software)) and [pyinstaller](https://pypi.org/project/pyinstaller/) module, Backend en [tournity](https://github.com/tournity), distintos programas de inteligencia artificial escritos en Java, etc.

## Hobbies

Ajedrez, ver fútbol, leer biografías de personas.

> :ToCPrevNext
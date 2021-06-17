# Kernel processing

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
> > > :P5 sketch=/docs/sketches/hardware/kernels/kernels.js, width=512, height=512
> 
> > :Tab title=js code
> > 
> >```js | kernels.js
> >let theShader;
> >let img;
> >
> >function preload() {
> >theShader = loadShader('/vc/docs/sketches/hardware/kernels/shader.vert', '/vc/docs/sketches/hardware/kernels/texture.frag');
> >img = loadImage('/vc/docs/sketches/lenna.png');
> >}
> >
> >function setup() {
> >createCanvas(512, 512, WEBGL);
> >shader(theShader);
> >}
> >
> >function draw() {
> >background(0);
> >// drawing the shape 
> >beginShape();
> >//fill('red');
> >vertex(-width / 2, -height / 2, 0, 0, 0);
> >//fill('blue');
> >vertex(width / 2, -height / 2, 0, 1, 0);
> >//fill('green');
> >vertex(width / 2, height / 2, 0, 1, 1);
> >vertex(-width / 2, height / 2, 0, 0, 1);
> >endShape(CLOSE);
> >// we need to use the shader loaded on the canvas
> >theShader.setUniform('texture', img);
> >theShader.setUniform('textureWidth', 800.0);
> >theShader.setUniform('textureHeight', 360.0);
> >theShader.setUniform('kernel', [1.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 1.0])
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
> > > :P5 sketch=/docs/sketches/kernelsVideo.js, width=512, height=512
> 
> > :Tab title=code
> > 
> >```js | kernelsVideo.js
> >var vid;
> >var n =3
> >function setup() {
> >  createCanvas(512, 512);
> >  textSize(20);
> >  pixelDensity(1);
> >  vid = createVideo(["/vc/docs/sketches/fingers.mov",
> >                      "/vc/docs/sketches/fingers.webm"],
> >                      );
> >  vid.loop()
> >  vid.hide()
> >  noStroke();
> >}
> >
> >function draw() {
> >  // ********************************************************************************
> >  // video original
> >  // ********************************************************************************
> >  image(vid, 0, 0, width/2, height/2)
> >
> >  // ********************************************************************************
> >  // video en escala de grises luma
> >  // ********************************************************************************
> >  vidGrisLuma = vid.get();
> >  if(vidGrisLuma.width > 0) {
> >    vidGrisLuma.loadPixels(); // getting pixel array
> >		
> >		for(var i = 0; i < vidGrisLuma.pixels.length; i += 4) // combination of double for loop mentioned in other tutorials
> >		{	
> >			var r = vidGrisLuma.pixels[i+0];
> >			var g = vidGrisLuma.pixels[i+1];
> >			var b = vidGrisLuma.pixels[i+2];
> >			let sum = (r*0.3 + g*0.59 + b*0.11);
> >			vidGrisLuma.pixels[i+0] = sum;
> >			vidGrisLuma.pixels[i+1] = sum;
> >			vidGrisLuma.pixels[i+2] = sum;
> >		}
> >		vidGrisLuma.updatePixels();
> >		image(vidGrisLuma, width/2, 0, width/2, height/2);
> >	}
> >
> >  // outline
> >  let kernel = [-1,-1,-1, 
> >    -1,8,-1,
> >    -1,-1,-1]
> >
> >  // bottom sobel
> >  // let kernel = [-1,-2,-1, 
> >  //               0,0,0,
> >  //               1,2,1]
> >
> >  // rightSobel
> >  // let kernel = [-1,0,1, 
> >  //               -2,0,2,
> >  //               -1,0,1]
> >
> >  // leftSobel
> >  // let kernel = [1,0,-1, 
> >  //               2,0,-2,
> >  //               1,0,-1]
> >
> >  // emboss
> >  // let kernel = [-2,-1,0, 
> >  //               -1,1,1,
> >  //               0,1,2]
> >
> >  // blur
> >  // let kernel = [0.0625,0.125,0.0625,
> >  //               0.125,0.25,0.125,
> >  //               0.0625,0.125,0.0625]
> >
> >  // sharpen
> >  // let kernel = [0,-1,0,
> >  //               -1,5,-1,
> >  //               0,-1,0]
> >
> >  // edge
> >  // let kernel = [0,-1,0,
> >  //               -1,4,-1,
> >  //               0,-1,0]
> >
> >  // ********************************************************************************
> >  // kernel video original
> >  // ********************************************************************************
> >  vidColKer = vid.get()
> >  if(vidColKer.width > 0) {
> >    vidColKer.loadPixels()
> >    for (var i = 0; i < vidColKer.pixels.length; i+=4) {
> >      let sumr = 0;
> >      let sumg = 0;
> >      let sumb = 0;
> >      for (let tam = 0; tam < n*n; tam++){
> >        let valr = vidColKer.pixels[i + tam*4 + 0];
> >        let valg = vidColKer.pixels[i + tam*4 + 1];
> >        let valb = vidColKer.pixels[i + tam*4 + 2];
> >        sumr += kernel[tam] * valr;
> >        sumg += kernel[tam] * valg;
> >        sumb += kernel[tam] * valb;
> >      }
> >      vidColKer.pixels[i + 0] = sumr;
> >      vidColKer.pixels[i + 1] = sumg;
> >      vidColKer.pixels[i + 2] = sumb;
> >    }
> >    vidColKer.updatePixels();
> >    image(vidColKer, 0, height/2, width/2, height/2);
> >  }
> >
> >  // ********************************************************************************
> >  // kernel escala de grises
> >  // ********************************************************************************
> >  vidGrisKernel = vidGrisLuma.get()
> >  if(vidGrisKernel.width > 0) {
> >    vidGrisKernel.loadPixels()
> >    for (let x = 0; x < width; x++) {
> >      for (let y = 0; y < height; y++) {
> >        var index = (y+x*width)*4;
> >        let sum = 0; 
> >        for (let tam = 0; tam < n*n; tam++){
> >          let val = vidGrisKernel.pixels[index + tam*4];
> >          sum += kernel[tam] * val;
> >        }
> >        vidGrisKernel.pixels[index + 0] = sum;
> >        vidGrisKernel.pixels[index + 1] = sum;
> >        vidGrisKernel.pixels[index + 2] = sum;
> >      }
> >    }
> >    vidGrisKernel.updatePixels();
> >    image(vidGrisKernel, width/2, height/2, width/2, height/2);
> >  }
> >}
> >```

# References

+ [Kernel (image processing)](https://en.wikipedia.org/wiki/Kernel_(image_processing))
+ [Image Kernels](https://setosa.io/ev/image-kernels/)

> :ToCPrevNext
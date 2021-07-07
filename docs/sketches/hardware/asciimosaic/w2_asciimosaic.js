let gif;
let mosaic;
let cntImages = 0;
let bright;
var mosaicShader;
var image;
var symbol1, symbol2, symbols;
var debug;
var luma;
var maxWidePixels = 15500 ; //Limite de ancho del mosaico. Depende de la GPU
var speedAlg = 1; //Velocidad del algoritmo que saca el promedio de RGB
var resolution = 80; //cantidad de cuadros

function preload(){
  //Images: images/colormap.png, images/mandrill.png
  image = loadImage("/vc/docs/sketches/hardware/asciimosaic/images/mandrill.png");
  mosaicShader = loadShader("/vc/docs/sketches/hardware/asciimosaic/shader.vert","/vc/docs/sketches/hardware/asciimosaic/asciimosaic.frag");
  // gifs/arial.gif, gifs/erica-one.gif
  gif = loadImage("/vc/docs/sketches/hardware/asciimosaic/gifs/erica-one.gif");
  // gif = loadImage("/vc/docs/sketches/hardware/asciimosaic/gifs/arial.gif");
}

function setup() {
  createCanvas(600,600, WEBGL);
  textureMode(NORMAL);
  noStroke();
  shader(mosaicShader);
  let rgbArray;
  if( gif.numFrames() * gif.width > maxWidePixels){ //If generated image is too wide
    let limitFrames = getLimitFramesGIF();
    console.log("Warning, gif size/number of frames too wide! Only picking first "+limitFrames+" frames");
    rgbArray = getOrganizedSymbolsImageFromGIF(speedAlg,limitFrames); 
    mosaicShader.setUniform("parts",limitFrames);
    console.log("parts: "+limitFrames);
  } else {
    rgbArray = getOrganizedSymbolsImageFromGIF(speedAlg);
    mosaicShader.setUniform("parts", gif.numFrames());
    console.log("parts: "+gif.numFrames());  
}
  
  mosaicShader.setUniform("image",image);
  //Se carga la imagen con todas las texturas
  mosaicShader.setUniform("symbols",mosaic);  
  mosaicShader.setUniform("resolution",resolution);
  debug = true;
  luma = true;
  mosaicShader.setUniform("debug",debug);
  mosaicShader.setUniform("luma",luma);
}

function draw() {
  background(33);
  cover(true);
}

function cover(texture = false){
  beginShape();
  if(texture){
    vertex(-width / 2, -height /2, 0, 0, 0);
    vertex( width / 2, -height /2, 0, 1, 0);
    vertex( width / 2, height /2, 0, 1, 1);
    vertex( -width / 2, height /2, 0, 0, 1);
  } else {
    vertex(-width / 2, -height /2, 0);
    vertex( width / 2, -height /2, 0);
    vertex( width / 2, height /2, 0);
    vertex( -width / 2, height /2, 0);
  }
  endShape(CLOSE);
}

function keyPressed(){
  if(key === "d"){
    debug = !debug;
    mosaicShader.setUniform("debug",debug);
  }
  if(key === "g"){
    luma = !luma;
    mosaicShader.setUniform("luma",luma);
  }
}

function getOrganizedSymbolsImageFromGIF(speed,maxFrames = gif.numFrames()){
  const tempValues = [];
  for(let frameNumber = 0 ; frameNumber < maxFrames;frameNumber++){
     gif.setFrame(frameNumber);
      let temp = 0;
      for (let i = 0; i < gif.width; i += speed) {
       for (let j = 0; j < gif.height; j += speed) {
          let c = gif.get(i,j);    
          temp += (c[0] + c[1] + c[2]);
       }
     }
     //console.log("temp: "+temp); 
     tempValues.push(temp);  
   }
   var min = Math.min(...tempValues);
   var max = Math.max(...tempValues);
   var maxFinal = max + 1 ;
   while(min != maxFinal){
     //console.log("tempValues: "+tempValues);
     //console.log("length: "+tempValues.length);
     //console.log("min: "+min); 
     var ind = tempValues.indexOf(min);
     addToMosaic(ind);
     tempValues.splice(ind, 1,maxFinal); 
     min = Math.min(...tempValues);
   }
   //mosaic.save("mosaic", "png");
   cntImages = 0;
}

function addToMosaic(index){
    gif.setFrame(index);
    let img = createImage(gif.width * (cntImages + 1), gif.height);
     if(cntImages != 0){
       img.copy(mosaic,0,0,mosaic.width,mosaic.height,0,0,mosaic.width,mosaic.height);
     }
     mosaic = createImage(gif.width * (cntImages + 1), gif.height);
     img.copy(gif,0,0,gif.width,gif.height,gif.width * cntImages,0,gif.width,gif.height);
     mosaic.copy(img,0,0,img.width,img.height,0,0,img.width,img.height); 
     cntImages++;
}

function getLimitFramesGIF(){
  let limit = 0;
  while(gif.width * limit < maxWidePixels){
    limit++;
  }
  return limit;
}

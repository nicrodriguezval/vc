<h1 align="center">ASCII Art by Software Performance</h1>

# Problem statement

This is an adaptation of the ASCII art sketch shown in the software implementations of Image Processing. The purpose of this sketch is to compare it to the hardware sketch, in order to have metrics about its performance.

# ASCII art Benchmark (52 symbols)

> :Tabs
> > :Tab title=sketch
> >
> > > :P5 sketch=/docs/sketches/benchmark/software/bench_ascii.js, width=700, height=600
> 
> > :Tab title=code
> > 
> >```js | bench_Ascii.js
> >let pg;
> >let lenna, copy_lenna;
> >var initialFPS = 120; //FPS iniciales del sketch
> >let resolution = 80;
> >let charRes; //Resolución de los caracteres (calculada en Setup)
> >let BGoption= new Map();
> >let BGselector;
> >let Symbolsoption = new Map();
> >let Symbolsselector;
> >//Buttons and Inputs
> >var resInput;
> >var numTexDiv;
> >var setResButton;
> >var fpsButton;
> >var fpsDiv;
> >var avgfpsDiv;
> >var fpsInput;
> >var setFpsButton;
> >var secondsDiv;
> >//Reset 
> >var resetButton;
> >var resetTime = 0;
> >var resetFrame = 0;
> >//Offset
> >let rightOffset = 100;
> >
> >function preload(){  
> >  lenna = loadImage("/vc/docs/sketches/lenna.png"); 
> >}
> >
> >function setup() {
> >    resizeCopyImage();
> >    //Así el dibujo del ascii será siempre 600x600
> >    charRes = 600 / (resolution * 0.9);
> >    createCanvas(600 + rightOffset, 600);
> >    background(33);
> >    fill(255);
> >    square(0,0,600);
> >    
> >    BGselector = createSelect();
> >    BGselector.option("lenna");
> >    Symbolsselector = createSelect();
> >    Symbolsselector.option("monospace");
> >    rightMenu();
> >}
> >
> >function draw() {
> >  ASCIImage(copy_lenna);
> >  //BGselector.changed(BGImageSelectEvent);
> >  //Symbolsselector.changed(GIFImageSelectEvent);
> >  //debugButton.mousePressed(mosaicMode);
> >  //lumaButton.mousePressed(toggleLuma);
> >  setFpsButton.mousePressed(changeFPS);
> >  resetButton.mousePressed(resetSeconds);
> >  updateFPS();
> >}
> >
> >function ASCIImage(imag){
> >    fill(255);
> >    square(0,0,600);
> >    toASCII52(copy_lenna,charRes,0,0);
> >}
> >
> >function monospaceChar(content, size, posX, posY){
> >    fill(0);
> >    textSize(size);
> >    textFont("monospace");
> >    textStyle(BOLD)
> >    text(content,posX,posY);
> >}
> >
> >function yuvGrayscale(imag){
> >    let copied = createGraphics(imag.width,imag.height);
> >    copied.loadPixels();  
> >    for(let i = 0; i < imag.width; i++) {
> >      for(let j = 0; j < imag.height; j++) {
> >        //Y' component in YUV (below this line) is equivalent to LUMA
> >        copied.set(i, j, color(0.299*red(imag.get(i, j)) +  0.587*green(imag.get(i, j)) + 0.114*blue(imag.get(i, j))));
> >      }
> >    }
> >    copied.updatePixels();
> >    return copied;
> >  }
> >
> >// Opacity information taken from https://observablehq.com/@grantcuster/sort-font-characters-by-percent-of-black-pixels
> >function getSimilarChar52(number){
> >  let ordered = "@g$WBMR%OHGKSmUdq56X3ahVk1{yt7}nzr]ixLv=<+/\"!;:,\'´-." //52 ASCII elements, ordered by opacity
> >  return ordered.substr(Math.floor(number/5),1) //Returns the corresponding string character for determined opacity of the pixel
> >}
> >
> >function toASCII52(imag, size, initialX , initialY){
> >  for(let i = 0; i < imag.width; i++) {
> >    for(let j = 0; j < imag.height; j++) {
> >      monospaceChar(getSimilarChar52(red(imag.get(i, j))),size,0.9*size*i + initialX,0.9*size*j + initialY); //Since the image is already gray, all rgb channels have the same value, we can pick any value
> >    }
> >  }
> >}
> >
> >//Menu functions
> >
> >function resetSeconds(){
> >  resetTime = millis();
> >  resetFrame = frameCount;
> >}
> >
> >function rightMenu(){
> >  //Background image selector
> >  let ySpace = 0;
> >  let vidSetText = createP("Images Set");
> >  setText(vidSetText,90,20,width - rightOffset + 10,ySpace,'white',14);
> >  ySpace += 30;
> >  //Background selector
> >  BGselector.position(width - rightOffset + 10, ySpace);
> >  BGselector.size(90, 20);
> >  ySpace += 10;
> >  let fontSetText = createP("Fonts Set");
> >  setText(fontSetText,90,20,width - rightOffset + 10,ySpace,'white',14);
> >  ySpace += 30;
> >  //Symbols image selector
> >  Symbolsselector.position(width - rightOffset + 10, ySpace);
> >  Symbolsselector.size(90, 20);
> >  ySpace += 10;
> >  let numTexText = createP("Num. Textures:");
> >  setText(numTexText,100,20,width - rightOffset+7,ySpace,'white',12);
> >  ySpace += 30;
> >  numTexDiv = createDiv(52);
> >  setDiv(numTexDiv,40,20,width - rightOffset + 35,ySpace,'white',20,0,2);
> >  ySpace += 30;
> >  //Input and Button to set Resolution
> >  resInput = createInput(resolution);
> >  resInput.position(width - rightOffset + 10, ySpace);
> >  resInput.size(40, 20);
> >  setResButton = createButton('set');
> >  setResButton.position(width - rightOffset + 60, ySpace);
> >  setResButton.size(40, 25);
> >  ySpace += 30;
> >  setResButton.mousePressed(changeResolution);
> >  frameRate(initialFPS);
> >  fpsInput = createInput(initialFPS);
> >  fpsInput.position(width - rightOffset + 10, ySpace);
> >  fpsInput.size(40, 20);
> >  setFpsButton = createButton('fps');
> >  setFpsButton.position(width - rightOffset + 60, ySpace);
> >  setFpsButton.size(40, 25);
> >  ySpace += 10;
> >  let fpsText = createP("FPS");
> >  setText(fpsText,75,20,width - rightOffset + 20,ySpace,'white',24);
> >  ySpace += 50;
> >  fpsDiv = createDiv(0);
> >  setDiv(fpsDiv,50,50,width - rightOffset + 25,ySpace,'white',30,15,15);
> >  ySpace += 60;
> >  let avgfpsText = createP("AVG FPS");
> >  setText(avgfpsText,77,20,width - rightOffset + 20,ySpace,'white',14);
> >  ySpace += 30;
> >  avgfpsDiv = createDiv(0);
> >  setDiv(avgfpsDiv,60,30,width - rightOffset + 25,ySpace,'white',20,8,8);
> >  ySpace += 30;
> >  let secondsText = createP("Time (s)");
> >  setText(secondsText,77,20,width - rightOffset + 20,ySpace,'white',14);
> >  ySpace += 30;
> >  secondsDiv = createDiv(0);
> >  setDiv(secondsDiv,60,30,width - rightOffset + 25,ySpace,'white',20,8,8);
> >  ySpace += 50;
> >  resetButton = createButton('reset');
> >  resetButton.position(width - rightOffset + 17, ySpace);
> >  resetButton.size(80, 25);
> >}
> >
> >function setDiv(divElem,sizeX,sizeY,x,y,BGcolor,Fontsize,padTop,padLeft){
> >  divElem.position(x, y);
> >  divElem.style('background-color', BGcolor);
> >  divElem.style('font-family', 'Helvetica');
> >  divElem.style('padding-top', padTop + 'px');
> >  divElem.style('padding-left', padLeft + 'px');
> >  divElem.style('font-size',Fontsize + 'px');
> >  divElem.size(sizeX, sizeY);
> >}
> >
> >function setText(textElem,sizeX,sizeY,x,y,color,size){
> >  textElem.size(sizeX, sizeY);
> >  textElem.position(x, y);
> >  textElem.style('color', color);
> >  textElem.style('text-align', 'center');
> >  textElem.style('font-family', 'Helvetica');
> >  textElem.style('font-size', size + 'px');
> >}
> >
> >function changeFPS(){
> >  console.log("fpsInput.value(): "+fpsInput.value())
> >  frameRate(int(fpsInput.value()));
> >}
> >
> >function changeResolution(){
> >  const newRes = parseInt(resInput.value());
> >  resolution = newRes;
> >  charRes = 600 / (resolution * 0.9);
> >  resizeCopyImage();
> >}
> >
> >function resizeCopyImage(){
> >    copy_lenna = createImage(lenna.width,lenna.height);
> >    copy_lenna.copy(lenna,0,0,lenna.width,lenna.height,0,0,lenna.width,lenna.height);
> >    copy_lenna.resize(resolution,resolution); //Resizing the image we get the superpixels
> >    copy_lenna.copy(yuvGrayscale(copy_lenna),0,0,copy_lenna.width,copy_lenna.height,0,0,copy_lenna.width,copy_lenna.height); //Convert to grayscale
> >}
> >
> >let savedMillis = 1000;
> >let savedFPS = 0;
> >function updateFPS(){
> >  let decimalMillis = millis() % 1000;
> >  let fps = 0;
> >  if(decimalMillis < savedMillis){
> >    updateAvgFPS();
> >    savedMillis = decimalMillis;
> >    fps = savedFPS + frameCount;
> >    fpsDiv.html(fps);
> >    if(fps <= 15){
> >      fpsDiv.style('color', '#FF0000');
> >    } else{
> >      fpsDiv.style('color', '#000000');
> >      
> >    }
> >    savedFPS = -frameCount;
> >  } else {
> >    savedMillis = decimalMillis;
> >  }
> >  
> >}
> >
> >function updateAvgFPS(){
> >  let s = (millis() - resetTime) / 1000;
> >  let avg = Math.round(((frameCount - resetFrame )/ s)*100)/100;
> >  avgfpsDiv.html(avg);
> >  secondsDiv.html(Math.floor(s));
> >}
> >```

> :ToCPrevNext
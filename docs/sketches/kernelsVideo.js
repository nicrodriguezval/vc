var vid;
var n =3
function setup() {
  createCanvas(512, 512);
  textSize(20);
  pixelDensity(1);
  vid = createVideo(["/vc/docs/sketches/fingers.mov",
                      "/vc/docs/sketches/fingers.webm"],
                      );
  vid.loop()
  vid.hide()
  noStroke();
}

function draw() {
  // ********************************************************************************
  // video original
  // ********************************************************************************
  image(vid, 0, 0, width/2, height/2)

  // ********************************************************************************
  // video en escala de grises luma
  // ********************************************************************************
  vidGrisLuma = vid.get();
  if(vidGrisLuma.width > 0) {
    vidGrisLuma.loadPixels(); // getting pixel array
		
		for(var i = 0; i < vidGrisLuma.pixels.length; i += 4) // combination of double for loop mentioned in other tutorials
		{	
			var r = vidGrisLuma.pixels[i+0];
			var g = vidGrisLuma.pixels[i+1];
			var b = vidGrisLuma.pixels[i+2];
			let sum = (r*0.3 + g*0.59 + b*0.11);
			vidGrisLuma.pixels[i+0] = sum;
			vidGrisLuma.pixels[i+1] = sum;
			vidGrisLuma.pixels[i+2] = sum;
		}
		vidGrisLuma.updatePixels();
		image(vidGrisLuma, width/2, 0, width/2, height/2);
	}

  // outline
  let kernel = [-1,-1,-1, 
    -1,8,-1,
    -1,-1,-1]

  // bottom sobel
  // let kernel = [-1,-2,-1, 
  //               0,0,0,
  //               1,2,1]

  // rightSobel
  // let kernel = [-1,0,1, 
  //               -2,0,2,
  //               -1,0,1]

  // leftSobel
  // let kernel = [1,0,-1, 
  //               2,0,-2,
  //               1,0,-1]

  // emboss
  // let kernel = [-2,-1,0, 
  //               -1,1,1,
  //               0,1,2]

  // blur
  // let kernel = [0.0625,0.125,0.0625,
  //               0.125,0.25,0.125,
  //               0.0625,0.125,0.0625]

  // sharpen
  // let kernel = [0,-1,0,
  //               -1,5,-1,
  //               0,-1,0]

  // edge
  // let kernel = [0,-1,0,
  //               -1,4,-1,
  //               0,-1,0]

  // ********************************************************************************
  // kernel video original
  // ********************************************************************************
  vidColKer = vid.get()
  if(vidColKer.width > 0) {
    vidColKer.loadPixels()
    for (var i = 0; i < vidColKer.pixels.length; i+=4) {
      let sumr = 0;
      let sumg = 0;
      let sumb = 0;
      for (let tam = 0; tam < n*n; tam++){
        let valr = vidColKer.pixels[i + tam*4 + 0];
        let valg = vidColKer.pixels[i + tam*4 + 1];
        let valb = vidColKer.pixels[i + tam*4 + 2];
        sumr += kernel[tam] * valr;
        sumg += kernel[tam] * valg;
        sumb += kernel[tam] * valb;
      }
      vidColKer.pixels[i + 0] = sumr;
      vidColKer.pixels[i + 1] = sumg;
      vidColKer.pixels[i + 2] = sumb;
    }
    vidColKer.updatePixels();
    image(vidColKer, 0, height/2, width/2, height/2);
  }

  // ********************************************************************************
  // kernel escala de grises
  // ********************************************************************************
  vidGrisKernel = vidGrisLuma.get()
  if(vidGrisKernel.width > 0) {
    vidGrisKernel.loadPixels()
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        var index = (y+x*width)*4;
        let sum = 0; 
        for (let tam = 0; tam < n*n; tam++){
          let val = vidGrisKernel.pixels[index + tam*4];
          sum += kernel[tam] * val;
        }
        vidGrisKernel.pixels[index + 0] = sum;
        vidGrisKernel.pixels[index + 1] = sum;
        vidGrisKernel.pixels[index + 2] = sum;
      }
    }
    vidGrisKernel.updatePixels();
    image(vidGrisKernel, width/2, height/2, width/2, height/2);
  }
}
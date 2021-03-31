var vid;
function setup() {
  createCanvas(512, 512);
  textSize(20);
  pixelDensity(10);
  vid = createVideo(["/vc/docs/sketches/fingers.mov",
                      "/vc/docs/sketches/fingers.webm"],
                      );
  vid.loop()
  vid.hide()
  noStroke();
}

function draw() {
  // ********************************************************************************
  // imagen original
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

  // ********************************************************************************
  // video en escala de grises promedio
  // ********************************************************************************
  vidGrisProm = vid.get();
  if(vidGrisProm.width > 0) {
    vidGrisProm.loadPixels(); // getting pixel array
		
		for(var i = 0; i < vidGrisProm.pixels.length; i += 4) // combination of double for loop mentioned in other tutorials
		{	
			var r = vidGrisProm.pixels[i+0];
			var g = vidGrisProm.pixels[i+1];
			var b = vidGrisProm.pixels[i+2];
			let sum = (r + g + b)/3;
			vidGrisProm.pixels[i+0] = sum;
			vidGrisProm.pixels[i+1] = sum;
			vidGrisProm.pixels[i+2] = sum;
		}
		vidGrisProm.updatePixels();
		image(vidGrisProm, 0, height/2, width/2, height/2);
	}

  // ********************************************************************************
  // video negativo
  // ********************************************************************************
  vidNeg = vid.get();
  if(vidNeg.width > 0) {
    vidNeg.loadPixels(); // getting pixel array
		
		for(var i = 0; i < vidNeg.pixels.length; i += 4) // combination of double for loop mentioned in other tutorials
		{	
			var r = vidNeg.pixels[i+0];
			var g = vidNeg.pixels[i+1];
			var b = vidNeg.pixels[i+2];
			
			vidNeg.pixels[i+0] = 255-r;
			vidNeg.pixels[i+1] = 255-g;
			vidNeg.pixels[i+2] = 255-b;
		}
		vidNeg.updatePixels();
		image(vidNeg, width/2, height/2, width/2, height/2);
	}

  fill(255, 255, 255);
  text("Original", 0, 25);
  text("Luma", 256, 25);
  text("Promedio RGB", 0, 280);
  text("Negativo", 256, 280);
}
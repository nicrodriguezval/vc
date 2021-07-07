precision mediump float;

// image is sent by the sketch
uniform sampler2D image;
//symbols texture is sent by the sketch
uniform sampler2D symbols;
// The number of textures also comes from the sketch
uniform int parts;
// toggles image display
uniform bool debug;
//toggles luma grayscale
uniform bool luma;
// target horizontal & vertical resolution
uniform float resolution;


// interpolated color (same name and type as in vertex shader)
varying vec4 vVertexColor;
// interpolated texcoord (same name and type as in vertex shader)
varying vec2 vTexCoord;


void main(){
	// remap symbolCoord to [0.0, resolution] in R
	vec2 symbolCoord = vTexCoord * resolution;
	// remap imageCoord to [0.0, 1.0] in R
	vec2 imageCoord = floor(symbolCoord);
	// remap symbolCoord to [0.0, 1.0] in R
	symbolCoord = symbolCoord - imageCoord;
	// remap imageCoord to [0.0, 1.0] in R
	imageCoord = imageCoord * vec2(1.0) / vec2(resolution);
	// get vec4 color hash index
	vec4 index = texture2D(image, imageCoord);
	//gl_FragColor = (debug ? index : texture2D(symbol1, symbolCoord)) * vVertexColor;
	if(debug){
		gl_FragColor = index * vVertexColor;
	} else {
		float parts_f = float(parts);
 		float div = 1.0 / parts_f;  //Computes de division of the texture symbols 
		float gray = 0.0;
		if(luma){
			//Luma grayscale
			gray = (index.x * 0.3) + (index.y * 0.59) + (index.z * 0.11); //Computes the magnitude of the vector
		} else {
			//Average grayscale
			gray = (index.x + index.y + index.z) / 3.0; //Computes the magnitude of the vector 
		}
			
		for(int i = 0; i < 100000; i++){ //Loop to a very large number
			if(i == parts) break;
			float i_f = float(i);
			if( (gray > div * i_f) && (gray < div * (i_f + 1.0))){ //If magnitude is inside a division of the texture symbols
				//Divides the coords to only print one part of the image
				//And after sums a vector that begin to print in the actual division
				gl_FragColor = texture2D(symbols, (symbolCoord / vec2(parts_f,1.0)) + vec2(div*i_f,0.0) ) * vVertexColor;
			}
		} 
	}
}
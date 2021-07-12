precision mediump float;

//Set a constant to max number of textures
#define MAXTEXTURES 256
#define MAXTEXTURES_RGB MAXTEXTURES * 3

// image is sent by the sketch
uniform sampler2D image;
//symbols texture is sent by the sketch
uniform sampler2D symbols;
// The number of textures also comes from the sketch
uniform int parts;
// toggles image display
uniform bool debug;
// target horizontal & vertical resolution
uniform float resolution;

//Defines the rgb values for the symbols texture
uniform float rgbValues[MAXTEXTURES_RGB]; //Max number of data from textures

// interpolated color (same name and type as in vertex shader)
varying vec4 vVertexColor;
// interpolated texcoord (same name and type as in vertex shader)
varying vec2 vTexCoord;

//Declares function to be used in the program
int minDistIndex (vec3 rgbValue);

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
		vec3 values = index.xyz;
		int minIndex = 15;
		minIndex = minDistIndex(values);
		for(int i = 0; i < MAXTEXTURES; i++){ 
			if(i == parts) break;
			float i_f = float(i);
			if( minIndex == i ){ 
				//Divides the coords to only print one part of the image
				//And after sums a vector that begin to print in the actual division
				gl_FragColor = texture2D(symbols, (symbolCoord / vec2(parts_f,1.0)) + vec2(div*i_f,0.0) ) * vVertexColor;
			}
		}
	}
}

int minDistIndex (vec3 rgbValue){
	float dist = 50000.0;
	int ind = 0;
	for(int i = 0; i < MAXTEXTURES; i++){ 
		if(i == parts) break;
		//Picks the closest rgb vector 
		float temp = distance(rgbValue, vec3(rgbValues[(i*3)+0],rgbValues[(i*3)+1],rgbValues[(i*3)+2]));
		if( temp < dist){
			dist = temp;
			ind = i;
		}  
	}
	return ind;
}
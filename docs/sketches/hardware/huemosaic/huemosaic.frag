precision mediump float;

// image is sent by the sketch
uniform sampler2D image;
//symbols texture is sent by the sketch
uniform sampler2D symbols;
// The number of textures also comes from the sketch
uniform int partsX;
uniform int partsY;
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


float getHue(vec3 colors);

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
		float partsX_f = float(partsX);
		float partsY_f = float(partsY);
 		float divX = 360.0 / partsX_f;  //Computes de division of the texture symbols 
		float divXmin = 1.0 / partsX_f;
		float divY = 1.0 / partsY_f;
		float gray = 0.0;
		if(luma){
			//Luma grayscale
			gray = (index.x * 0.3) + (index.y * 0.59) + (index.z * 0.11); //Computes the magnitude of the vector
		} else {
			//Average grayscale
		    gray = (index.x + index.y + index.z) / 3.0; //Computes the magnitude of the vector 
		}
		
		float hue = getHue(index.rgb);
		
		for(int i = 0; i < 100000; i++){
			if(i == partsX) break;
			float i_f = float(i);
			for(int j = 0; j < 100000; j++){
				if(j == partsY) break;
				float j_f = float(j);
				if( (hue >= divX * i_f) && (hue <= divX * (i_f + 1.0))){
					if((gray >= divY * j_f) && (gray <= divY * (j_f + 1.0))){
						gl_FragColor = texture2D(symbols, (symbolCoord / vec2(partsX_f,partsY_f)) + vec2(divXmin*i_f,divY*j_f) ) * vVertexColor;
					}
				}
			}
		}

		
		//for(int i = 0; i < 100000; i++){ //Loop to a very large number
		//	if(i == parts) break;
		//	float i_f = float(i);
		//	if( (gray >= div * i_f) && (gray <= div * (i_f + 1.0))){ //If magnitude is inside a division of the texture symbols
				//Divides the coords to only print one part of the image
				//And after sums a vector that begin to print in the actual division
		//		gl_FragColor = texture2D(symbols, (symbolCoord / vec2(parts_f,1.0)) + vec2(div*i_f,0.0) ) * vVertexColor;
		//	}
		//} 
	}
}

float getHue(vec3 colors){
	float hueVal = 0.0;
	float minVal = min(min(colors.r, colors.g), colors.b);
    float maxVal = max(max(colors.r, colors.g), colors.b);
	
	if(minVal == maxVal){
		return 0.0;
	}
	
	if(maxVal == colors.r){
		hueVal = ((colors.g - colors.b) / (maxVal - minVal));
	} else if (maxVal == colors.g){
		hueVal = (2.0 + (colors.b - colors.r) / (maxVal - minVal));
	} else{
		hueVal = (4.0 + (colors.r - colors.g) / (maxVal - minVal));
	}
	
	hueVal = hueVal * 60.0;
    if( hueVal < 0.0 ){
      hueVal = hueVal + 360.0;
    }
    return hueVal;
}
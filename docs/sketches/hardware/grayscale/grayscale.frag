precision mediump float;

// texture is sent by the sketch
uniform sampler2D texture;

uniform float RGBval[3];
uniform int mode;

// interpolated color (same name and type as in vertex shader)
varying vec4 vVertexColor;
// interpolated texcoord (same name and type as in vertex shader)
varying vec2 vTexCoord;

void main(){
  // texture2D(texture, vTexCoord) samples texture at vTexCoord
  // and returns the normalized texel color
  // texel color times vVertexColor gives the final normalized pixel color
  
  vec4 color = texture2D(texture, vTexCoord) * vVertexColor;
  //float gray = dot(color.rgb /*color.xyz*/, vec3(1.0 / 3.0, 1.0 / 3.0, 1.0 / 3.0));
  float gray = dot(color.rgb /*color.xyz*/, vec3(RGBval[0],RGBval[1],RGBval[2]));
  vec4 negColor = vec4(vec3(1.0) - vec3(color.r,color.g,color.b),1.0);
  if(mode == 0){ //Original color mode
	gl_FragColor = color;
  } else if(mode == 1){ //Grayscale mode
	gl_FragColor = vec4(vec3(gray), 1.0);
  } else if(mode == 2){ //Negative mode
	gl_FragColor = negColor;
  }
}
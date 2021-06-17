precision mediump float;

// texture is sent by the sketch
uniform sampler2D texture;

uniform float textureWidth;
uniform float textureHeight;
uniform float kernel[9];
// interpolated color (same name and type as in vertex shader)
varying vec4 vVertexColor;
// interpolated texcoord (same name and type as in vertex shader)
varying vec2 vTexCoord;

void main(){
  // texture2D(texture, vTexCoord) samples texture at vTexCoord
  // and returns the normalized texel color
  // texel color times vVertexColor gives the final normalized pixel color
  
  // calculating the steps
  float stepSizeX=1.0/textureWidth;
  float stepSizeY=1.0/textureHeight;

  // applying the convolution mask
  vec2 tc0=vTexCoord+vec2(-stepSizeX,-stepSizeY);
  vec4 col0=texture2D(texture,tc0)*kernel[0];
  vec2 tc1=vTexCoord+vec2(0.0,-stepSizeY);
  vec4 col1=texture2D(texture,tc1)*kernel[1];
  vec2 tc2=vTexCoord+vec2(stepSizeX,-stepSizeY);
  vec4 col2=texture2D(texture,tc2)*kernel[2];
  vec2 tc3=vTexCoord+vec2(-stepSizeX,0.0);
  vec4 col3=texture2D(texture,tc3)*kernel[3];
  vec2 tc4=vTexCoord+vec2(0.0,0.0);
  vec4 col4=texture2D(texture,tc4)*kernel[4];
  vec2 tc5=vTexCoord+vec2(stepSizeX,0.0);
  vec4 col5=texture2D(texture,tc5)*kernel[5];
  vec2 tc6=vTexCoord+vec2(-stepSizeX,stepSizeY);
  vec4 col6=texture2D(texture,tc6)*kernel[6];
  vec2 tc7=vTexCoord+vec2(0.0,stepSizeY);
  vec4 col7=texture2D(texture,tc7)*kernel[7];
  vec2 tc8=vTexCoord+vec2(stepSizeX,stepSizeY);
  vec4 col8=texture2D(texture,tc8)*kernel[8];
  
  vec4 sum=col0+col1+col2+col3+col4+col5+col6+col7+col8;
  
  gl_FragColor=vec4(vec3(sum),1.)*vVertexColor;
}
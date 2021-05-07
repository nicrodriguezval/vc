precision mediump float;

// texture is sent by the sketch
uniform sampler2D gray;

// interpolated color (same name and type as in vertex shader)
varying vec4 vVertexColor;
// interpolated texcoord (same name and type as in vertex shader)
varying vec2 vTexCoord;

void main() {
  // texture2D(texture, vTexCoord) samples texture at vTexCoord 
  // and returns the normalized texel color
  // texel color times vVertexColor gives the final normalized pixel color
  // gl_FragColor = texture2D(texture, vTexCoord);
  // gl_FragColor = vVertexColor;
  // gl_FragColor = texture2D(texture, vTexCoord) * vVertexColor;
  // gl_FragColor = vec4(1.0,0.0,1.0,1.0);
  vec4 col = texture2D(gray, vTexCoord) * vVertexColor;
  float gris = dot(col.rgb,vec3(0.299, 0.587, 0.114));
  // float gris = dot(col.xyz,vec3(0.333, 0.333, 0.333));
  gl_FragColor = vec4(vec3(gris), 1.0); 
}
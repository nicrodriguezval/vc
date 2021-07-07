precision mediump float;

// texture is sent by the sketch
uniform sampler2D texture;
uniform vec2 steps;

uniform vec3 ku;
uniform vec3 km;
uniform vec3 kd;

// uniform float uKernel[9];

// interpolated color (same name and type as in vertex shader)
varying vec4 vVertexColor;
// interpolated texcoord (same name and type as in vertex shader)
varying vec2 vTexCoord;

void main() {

    vec2 tc0 = vTexCoord + vec2(-steps.x, -steps.y);
    vec2 tc1 = vTexCoord + vec2(0.0, -steps.y);
    vec2 tc2 = vTexCoord + vec2(+steps.x, -steps.y);
    vec2 tc3 = vTexCoord + vec2(-steps.x, 0.0);
    vec2 tc4 = vTexCoord + vec2(0.0, 0.0);
    vec2 tc5 = vTexCoord + vec2(+steps.x, 0.0);
    vec2 tc6 = vTexCoord + vec2(-steps.x, +steps.y);
    vec2 tc7 = vTexCoord + vec2(0.0, +steps.y);
    vec2 tc8 = vTexCoord + vec2(+steps.x, +steps.y);
  
    vec4 col0 = texture2D(texture, tc0);
    vec4 col1 = texture2D(texture, tc1);
    vec4 col2 = texture2D(texture, tc2);
    vec4 col3 = texture2D(texture, tc3);
    vec4 col4 = texture2D(texture, tc4);
    vec4 col5 = texture2D(texture, tc5);
    vec4 col6 = texture2D(texture, tc6);
    vec4 col7 = texture2D(texture, tc7);
    vec4 col8 = texture2D(texture, tc8);
    
    vec4 sumku = vec4(ku.x*col6) + vec4(ku.y*col7) + vec4(ku.z*col8);
    vec4 sumkm = vec4(km.x*col3) + vec4(km.y*col4) + vec4(km.z*col5);
    vec4 sumkd = vec4(kd.x*col0) + vec4(kd.y*col1) + vec4(kd.z*col2);
    

    vec4 sum = vec4(sumku) + vec4(sumkm) + vec4(sumkd);
    sum.w = 1.0;
  
    gl_FragColor = vec4(sum) * vVertexColor;
    // gl_FragColor = texture2D(texture, vTexCoord) * vVertexColor;
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
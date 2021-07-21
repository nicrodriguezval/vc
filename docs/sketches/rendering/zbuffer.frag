precision mediump float;
precision mediump int;

uniform vec4 nearColor;
uniform vec4 farColor;
uniform float near;
uniform float far;

varying vec4 vertColor;
 
void main() {
    gl_FragColor = mix(nearColor, farColor, smoothstep(near, far, gl_FragCoord.z / gl_FragCoord.w));
}
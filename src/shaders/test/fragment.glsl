precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main() {
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= (vElevation * 0.5) + 0.6;
    // textureColor.a = vElevation * 10.0;
    gl_FragColor = vec4(textureColor);
}
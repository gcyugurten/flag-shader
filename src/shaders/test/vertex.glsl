// uniform mat4 projectionMatrix; // transform the coordinates into the clip space coordinates
// uniform mat4 viewMatrix; // apply transformations relative to the camera (position, rotation, fov, near, far)
// uniform mat4 modelMatrix; // apply transformations to the mesh (position, rotation, scale)
uniform vec2 uFrequency;
uniform float uTime;
uniform vec3 uColor;
uniform sampler2D uTexture;

// attribute vec3 position;
// attribute vec2 uv;

varying vec2 vUv;
varying float vElevation;

void main() {


    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
    modelPosition.z += elevation;
   

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedMatrix = projectionMatrix * viewPosition;

    gl_Position = projectedMatrix;


    vUv = uv;
    vElevation = elevation;

}


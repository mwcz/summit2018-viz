#define PATH_LENGTH 3

attribute vec3 color;
attribute float progress;

uniform float size;
uniform float paths[4*PATH_LENGTH];

varying vec3 vColor;

vec2 pointOnPath(float p, int pi) {
    float x = paths[pi+0];
    float y = paths[pi+1];
    return vec2(p * x, p * y);
}

void main() {
    vColor = color;

    vec2 pathPos = pointOnPath(progress, 3);
    vec4 mvPosition = modelViewMatrix * vec4( pathPos, 0.0, 1.0 );

    gl_PointSize = size * ( 300.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}

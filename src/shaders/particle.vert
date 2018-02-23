// PATH_LENGTH is how many nodes there are in each particle's path
#define PATH_LENGTH 3

// two components to each path node, x and y
#define PATH_COMPONENTS 2

// how many paths there are (can't pass this in dynamically; array indices must be static)
#define PATH_COUNT 1

attribute vec3 color;
attribute float progress;
attribute float path;

uniform float size;
uniform float paths[PATH_LENGTH * PATH_COMPONENTS * PATH_COUNT];

varying vec3 vColor;

// p = progress [0..1)
// pi = path index, the index within the paths attribute where this particle's path begins
vec2 pointOnPath(float p, float pi) {
    p = clamp(p, 0.0, 1.0);
    float pwide = p * float(PATH_LENGTH);
    float pprev = floor(pwide);
    float pnext = ceil(pwide);
    float a = pwide - pprev;

    int p1i = int(pi + pprev);
    int p2i = int(pi + pnext);

    vec2 pos = mix(
        vec2(paths[p1i+0], paths[p1i+1]),
        vec2(paths[p2i+0], paths[p2i+1]),
        a
    );

    return pos;
}

void main() {
    vColor = color;

    vec2 pathPos = pointOnPath(progress, path);
    vec4 mvPosition = modelViewMatrix * vec4( pathPos, 0.0, 1.0 );

    gl_PointSize = size * ( 300.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}

// PATH_NODES is how many nodes there are in each particle's path
#define PATH_NODES 4

// two components to each path node, x and y
#define PATH_COMPONENTS 2

// how many paths there are (can't pass this in dynamically; array indices must be static)
#define PATH_COUNT 3

// how many floats are in a single path
#define PATH_LENGTH (PATH_NODES*PATH_COMPONENTS)

attribute vec3 color;
attribute float progress;
attribute float path;

uniform float size;
uniform float paths[PATH_NODES * PATH_COMPONENTS * PATH_COUNT];

varying vec3 vColor;

// p = progress [0..1)
// pn = path number, indicating whether this particle should use path 0, path 1, etc
vec2 pointOnPath(float p, int pn) {
    p = clamp(p, 0.0, 1.0);

    int path_i = PATH_LENGTH * pn;
    float path_progress = p * float((PATH_NODES - PATH_COMPONENTS + 1) * PATH_COMPONENTS);
    int x1i = path_i + int(path_progress / 2.0) * 2;
    int y1i = x1i + 1;
    int x2i = x1i + PATH_COMPONENTS;
    int y2i = x2i + 1;

    float a = fract(p * float((PATH_NODES - PATH_COMPONENTS + 1)));

    vec2 p1 = vec2(paths[x1i], paths[y1i]);
    vec2 p2 = vec2(paths[x2i], paths[y2i]);

    vec2 pos = mix( p1, p2, a );

    return pos;
}

void main() {
    vColor = color;

    vec2 pathPos = pointOnPath(progress, int(path));
    vec4 mvPosition = modelViewMatrix * vec4( pathPos, 0.0, 1.0 );

    gl_PointSize = size * ( 100.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}

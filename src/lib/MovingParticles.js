import * as THREE from "three";
import Actor from "./Actor.js";
import { makeLogger } from "./logging/Logger.js";
import ShaderLoader from "./ShaderLoader.js";

const log = makeLogger("MovingParticles");

export default class MovingParticles extends Actor {
  constructor(stage, paths = []) {
    super(stage);

    this.paths = paths;

    this.pointCount = 1000;
    this.speed = 0.005;
    this.delaySpread = 3;
    this.size = 32;

    log("created");

    this._initParticles();

    // setTimeout(this._startMove.bind(this), 1000);
  }
  update() {
    this._updateMove();
    this._updateProgress();
  }

  _updateMove() {}

  _updateProgress() {
    const progress = this.geometry.attributes.progress;

    for (let i = 0; i < progress.array.length; ++i) {
      progress.array[i] += this.speed;
    }

    progress.needsUpdate = true;
  }

  _initParticles(addToScene = true) {
    this.moveDelay = this._getMoveDelayAttribute();
    this.material = this._getMaterial();
    this.geometry = this._getGeometry(this.material, this.moveDelay);
    this.points = this._getPoints(this.geometry, this.material);

    log("particles initialized");

    if (addToScene) {
      this.stage.scene.add(this.points);
    }
  }

  _getGeometry(material, delay) {
    log("creating geometry");
    const geometry = new THREE.BufferGeometry();

    const positions = this._getPositionAttribute();

    // save a copy of the initial positions
    this.initialPositions = positions.clone().array;

    geometry.addAttribute("position", positions);
    geometry.addAttribute("moveDelay", this.moveDelay);
    geometry.addAttribute("variation", this._getVariationAttribute());
    geometry.addAttribute("progress", this._getProgressAttribute(delay));
    geometry.addAttribute(
      "path",
      this._getPathAttribute(material.uniforms.paths.value.length)
    );
    geometry.addAttribute("color", this._getColorAttribute(positions));

    return geometry;
  }

  _getPoints(geometry, material) {
    log("creating points");
    const points = new THREE.Points(geometry, material);
    return points;
  }

  _getMaterial() {
    log("creating material");
    const shaders = ShaderLoader.load();
    return new THREE.ShaderMaterial({
      uniforms: {
        size: { type: "t", value: this.size },
        paths: this._getPathsUniform()
      },
      vertexShader: shaders.vert,
      fragmentShader: shaders.frag
    });
  }

  _getPositionAttribute() {
    log("creating position attribute");
    const array = new Float32Array(this.pointCount * 3);

    for (let i = 0; i < this.pointCount; i++) {
      const x = i % 200;
      const y = Math.floor(i / 200);
      const z = 0;

      array[i * 3 + 0] = x;
      array[i * 3 + 1] = -y; // flip y
      array[i * 3 + 2] = z;
    }

    return new THREE.Float32BufferAttribute(array, 3);
  }

  _getPathsUniform() {
    log("creating paths attribute");
    // [ x1, y1, x2, y2, x3, y3, ..., xN, yN ]
    return new THREE.Uniform(
      [
        58, // path 0
        146.2,
        68,
        141,
        78,
        146.4,
        88,
        141,

        58, // path 1
        146.2,
        68,
        152,
        78,
        157,
        88,
        162,

        58, // path 2
        146.2,
        68,
        141,
        78,
        136,
        88,
        130.4
      ].map((v, i) => {
        if (i % 2 === 0) {
          // offset x values a certain amount to center the graph
          return (v - 58 - 13.1) * 19.4;
        } else {
          // offset y values a certain amount to center the graph
          return (v - 146) * 18.6;
        }
      })
    );
  }

  _getProgressAttribute(delay) {
    log("creating progress attribute");
    const array = delay.array.slice();
    return new THREE.Float32BufferAttribute(array, 1);
  }

  _getPathAttribute(pathCount) {
    log("creating path attribute");
    const array = new Float32Array(this.pointCount);
    for (let i = 0; i < this.pointCount; i++) {
      array[i] = this._pickPath(Math.random());
    }
    return new THREE.Float32BufferAttribute(array, 1);
  }

  /**
   * Choose a path using the given probability distribution.
   */
  _pickPath(x = 0) {
    const probabilitySums = this.paths.slice();

    // add up the probabilities sequentially, so the final number in the array is 1.0

    probabilitySums.forEach((p, i, c) => (c[i] = c[i] + (c[i - 1] || 0)));

    return probabilitySums.findIndex(p => x <= p);
  }

  _getMoveDelayAttribute() {
    log("creating move delay attribute");
    const array = new Float32Array(this.pointCount);

    for (let i = 0; i < this.pointCount; i++) {
      array[i] = -this.delaySpread * Math.random();
    }

    return new THREE.Float32BufferAttribute(array, 1);
  }

  _getVariationAttribute() {
    log("creating position variation attribute");
    const array = new Float32Array(this.pointCount);

    for (let i = 0; i < this.pointCount; i++) {
      array[i] = Math.random();
    }

    return new THREE.Float32BufferAttribute(array, 1);
  }

  /* colors are based on positions, currently, but not forever */
  _getColorAttribute(positions) {
    log("creating color attribute");
    const array = new Float32Array(this.pointCount * 3);
    const color = new THREE.Color();
    let vertex;

    for (let i = 0; i < this.pointCount; ++i) {
      const i3 = i * 3;
      array[i3 + 0] = 246 / 255;
      array[i3 + 1] = 203 / 255;
      array[i3 + 2] = 105 / 255;
    }

    return new THREE.Float32BufferAttribute(array, 3);
  }
}

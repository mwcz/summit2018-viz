import * as THREE from "three";
import Actor from "./Actor.js";
import { makeLogger } from "./logging/Logger.js";
import ShaderLoader from "./ShaderLoader.js";

const log = makeLogger("MovingParticles");

export default class MovingParticles extends Actor {
  constructor(stage) {
    super(stage);

    this.pointCount = 2;

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
      progress.array[i] += 0.01;
    }

    progress.needsUpdate = true;
  }

  _initParticles(addToScene = true) {
    this.material = this._getMaterial();
    this.geometry = this._getGeometry(this.material);
    this.points = this._getPoints(this.geometry, this.material);
    this.moveDelay = this._getMoveDelayAttribute();

    log("particles initialized");

    if (addToScene) {
      this.stage.scene.add(this.points);
    }
  }

  _getGeometry(material) {
    log("creating geometry");
    const geometry = new THREE.BufferGeometry();

    const positions = this._getPositionAttribute();

    // save a copy of the initial positions
    this.initialPositions = positions.clone().array;

    geometry.addAttribute("position", positions);
    geometry.addAttribute("progress", this._getProgressAttribute());
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
        size: { type: "t", value: 16 },
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
    return new THREE.Uniform([
      0,
      0,
      90,
      0,
      180,
      -180,
      0,
      0,
      -90,
      0,
      -180,
      -180
    ]);
  }

  _getProgressAttribute() {
    log("creating progress attribute");
    const array = new Float32Array(this.pointCount);
    return new THREE.Float32BufferAttribute(array, 1);
  }

  _getPathAttribute(pathCount) {
    log("creating path attribute");
    const array = new Float32Array(this.pointCount);
    for (let i = 0; i < this.pointCount; i++) {
      array[i] = i;
    }
    return new THREE.Float32BufferAttribute(array, 1);
  }

  _getMoveDelayAttribute() {
    log("creating move delay attribute");
    const array = new Float32Array(this.pointCount);

    for (let i = 0; i < this.pointCount; i++) {
      array[i] = Math.random() / 3;
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
      array[i3 + 0] = 1;
      array[i3 + 1] = 0;
      array[i3 + 2] = 0;
    }

    return new THREE.Float32BufferAttribute(array, 3);
  }
}

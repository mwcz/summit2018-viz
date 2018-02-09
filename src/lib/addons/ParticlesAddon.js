import * as THREE from "three";
import Addon from "./Addon";
import { makeLogger } from "../logging/Logger";

const log = makeLogger("ParticlesAddon");

class ParticlesAddon extends Addon {
  constructor(stage) {
    super("ParticlesAddon", stage);

    this.width = 400;
    this.height = 300;

    this.pointCount = this.width * this.height;

    this._initParticles(stage);
  }
  update(stage) {
    // log(`updating ${this.name}`);
  }

  _initParticles(stage) {
    log("particles initialized");
    this.geometry = this._getGeometry();
    this.material = this._getMaterial();
    this.points = this._getPoints(this.geometry, this.material);

    stage.scene.add(this.points);
  }

  _getGeometry() {
    const geometry = new THREE.BufferGeometry();

    const positions = this._getPositionAttribute();

    geometry.addAttribute("position", positions);
    geometry.addAttribute("color", this._getColorAttribute(positions));

    return geometry;
  }

  _getPoints(geometry, material) {
    return new THREE.Points(geometry, material);
  }

  _getMaterial() {
    return new THREE.PointsMaterial({
      size: 1,
      color: 0xffffff,
      vertexColors: THREE.VertexColors
    });
  }

  _getPositionAttribute() {
    const array = new Float32Array(this.pointCount * 3);

    for (let i = 0; i < this.pointCount; i++) {
      const x = i % this.width - this.width / 2;
      const y = i / this.width - this.width / 2;
      const z = 0;

      array[i * 3 + 0] = x;
      array[i * 3 + 1] = y;
      array[i * 3 + 2] = z;
    }

    return new THREE.Float32BufferAttribute(array, 3);
  }

  /* colors are based on positions, currently, but not forever */
  _getColorAttribute(positions) {
    const array = new Float32Array(this.pointCount * 3);
    const color = new THREE.Color();
    let vertex;

    for (let i = 0; i < this.pointCount; ++i) {
      const x = positions.array[i + 0];
      const y = positions.array[i + 1];
      const z = positions.array[i + 2];

      const r = x / 400 + 0.5;
      const g = y / 400 + 0.5;
      const b = z / 400 + 0.5;

      color.setRGB(r, g, b);

      array[i + 0] = color.r;
      array[i + 1] = color.g;
      array[i + 2] = color.b;
    }

    return new THREE.Float32BufferAttribute(array, 3);
  }
}

export default ParticlesAddon;

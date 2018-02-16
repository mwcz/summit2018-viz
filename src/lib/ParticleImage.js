import * as THREE from "three";
import Actor from "./Actor.js";
import { makeLogger } from "./logging/Logger.js";
import Paths from "./Paths.js";

const log = makeLogger("ParticleImage");

export default class ParticleImage extends Actor {
  constructor(stage, imagedata) {
    super(stage);

    this.imagedata = imagedata;

    this.pointCount = this.imagedata.width * this.imagedata.height;

    log("created");

    this._initParticles();
  }
  update() {
    if (window.jitter) {
      this._jitterParticles();
    }

    this._updateMove();

    // log(`updating ${this.name}`);
  }

  _startMove(x = 0, y = 0) {
    for (let i = 0; i < this.destinations.length; i += 3) {
      this.destinations[i + 0] = x;
      this.destinations[i + 1] = y;
    }
  }

  _updateMove(l = 0.1) {
    const position = this.geometry.attributes.position;
    for (let i = 0; i < position.count; ++i) {
      const i3 = i * 3;

      const x =
        (1 - l) * position.array[i3 + 0] + l * this.destinations[i3 + 0];
      const y =
        (1 - l) * position.array[i3 + 1] + l * this.destinations[i3 + 1];

      // if (i === 1) {
      //   console.log(
      //     `moving ${position.array[i + 0]},${position.array[i + 1]} toward ${
      //       this.destinations[i + 0]
      //     },${this.destinations[i + 1]}... currently ${x},${y}`
      //   );
      // }
      position.array[i3 + 0] = x;
      position.array[i3 + 1] = y;
    }
    this.geometry.attributes.position.needsUpdate = true;
  }

  _jitterParticles() {
    const pos = this.geometry.attributes.position.array;
    for (let i = 0; i < pos.length; ++i) {
      // pos[i + 0] += 0.1;
      pos[i + 0] += (Math.random() - 0.5) / 10;
      pos[i + 1] += (Math.random() - 0.5) / 10;
      pos[i + 2] += (Math.random() - 0.5) / 10;
    }
    this.geometry.attributes.position.needsUpdate = true;
  }

  _initParticles(addToScene = true) {
    this.geometry = this._getGeometry();
    this.material = this._getMaterial();
    this.points = this._getPoints(this.geometry, this.material);

    log("particles initialized");

    if (addToScene) {
      this.stage.scene.add(this.points);
    }
  }

  _getGeometry() {
    log("creating geometry");
    const geometry = new THREE.BufferGeometry();

    const positions = this._getPositionAttribute();

    geometry.addAttribute("position", positions);
    geometry.addAttribute("color", this._getColorAttribute(positions));
    // not needed as an attribute until I switch to custom shaders
    // geometry.addAttribute("destination", this._getDestinationAttribute(positions));
    this.destinations = this._getDestinationAttribute(positions);

    return geometry;
  }

  _getPoints(geometry, material) {
    log("creating points");
    const points = new THREE.Points(geometry, material);
    points.position.x -= this.imagedata.width / 2;
    points.position.y -= this.imagedata.height / 2;
    return points;
  }

  _getMaterial() {
    log("creating material");
    return new THREE.PointsMaterial({
      size: 2.0,
      color: 0xffffff,
      vertexColors: THREE.VertexColors
      // map: new THREE.Texture()
    });
  }

  _getPositionAttribute() {
    log("creating position attribute");
    const array = new Float32Array(this.pointCount * 3);

    for (let i = 0; i < this.pointCount; i++) {
      const x = i % this.imagedata.width;
      const y = Math.floor(i / this.imagedata.width);
      const z = 0;

      array[i * 3 + 0] = x;
      array[i * 3 + 1] = -y + this.imagedata.height; // flip y
      array[i * 3 + 2] = z;
    }

    return new THREE.Float32BufferAttribute(array, 3);
  }

  _getDestinationAttribute(positions) {
    log("creating destination attribute");
    return positions.clone().array;
  }

  /* colors are based on positions, currently, but not forever */
  _getColorAttribute(positions) {
    log("creating color attribute");
    const array = new Float32Array(this.pointCount * 3);
    const color = new THREE.Color();
    let vertex;

    for (let i = 0; i < this.pointCount; ++i) {
      const i3 = i * 3;
      const i4 = i * 4;
      array[i3 + 0] = this.imagedata.data[i4 + 0] / 255;
      array[i3 + 1] = this.imagedata.data[i4 + 1] / 255;
      array[i3 + 2] = this.imagedata.data[i4 + 2] / 255;
    }

    return new THREE.Float32BufferAttribute(array, 3);
  }
}

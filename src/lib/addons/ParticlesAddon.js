import Addon from "./Addon";
import { makeLogger } from "../logging/Logger";

const log = makeLogger("ParticlesAddon");

class ParticlesAddon extends Addon {
  constructor(...args) {
    super("ParticlesAddon", ...args);

    console.log(args);

    this._initParticles();
  }
  update(viz) {
    // log(`updating ${this.name}`);
  }

  _initParticles() {
    log("particles initialized");
  }

  _getPoints(geometry, material) {
    return new THREE.Points(geometry, material);
  }

  _getMaterial() {
    return new THREE.PointsMaterial({ size });
  }
}

export default ParticlesAddon;

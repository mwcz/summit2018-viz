import * as THREE from "three";
import { makeLogger } from "./logging/Logger.js";

const log = makeLogger("Paths");

export default class Paths {
  static get(startPoint) {
    const d = 300;
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(d, d),
      new THREE.Vector2(-d, d),
      new THREE.Vector2(-d, -d),
      new THREE.Vector2(d, -d)
    ]);
    if (startPoint) {
      curve.points.unshift(startPoint);
    }
    log(`created curve`);
    return curve;
  }
}

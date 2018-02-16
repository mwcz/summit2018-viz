import * as THREE from "three";
import { makeLogger } from "./logging/Logger.js";

const log = makeLogger("Paths");

export default class Paths {
  static get(startPoint) {
    const d = 600;
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(startPoint.x / 8 + d, startPoint.y / 8),
      new THREE.Vector2(startPoint.x / 16 + d, startPoint.y / 16 - d),
      new THREE.Vector2(startPoint.x / 128 + 3 * d, startPoint.y / 128 - d)
    ]);
    if (startPoint) {
      curve.points.unshift(startPoint);
    }
    return curve;
  }
}

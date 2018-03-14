import MovingParticles from "./MovingParticles.js";
import { makeLogger } from "./logging/Logger";

const log = makeLogger("MovingParticleFactory");

export default class MovingParticleFactory {
  static create(stage) {
    log("creating a moving particle object");

    const probability = [0.9, 0.05, 0.05];

    return new MovingParticles(stage, probability);
  }
}

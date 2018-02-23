import MovingParticles from "./MovingParticles.js";
import { makeLogger } from "./logging/Logger";

const log = makeLogger("MovingParticleFactory");

export default class MovingParticleFactory {
  static create(stage) {
    log("creating a moving particle object");
    return new MovingParticles(stage);
  }
}

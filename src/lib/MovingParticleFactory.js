import MovingParticles from "./MovingParticles.js";
import { makeLogger } from "./logging/Logger";

const log = makeLogger("MovingParticleFactory");

export default class MovingParticleFactory {
  static create(stage) {
    log("creating a moving particle object");

    const probability = [0.9, 0.05, 0.05];
    const paths = {
      nodes: 4,
      components: 2,
      count: 3,
      coordinates: [
        626,
        533,
        878,
        407,
        1128,
        283,
        1379,
        157,
        626,
        533,
        877,
        659,
        1127,
        533,
        1379,
        657,
        626,
        533,
        877,
        659,
        1128,
        782,
        1379,
        908
      ]
    };
    return new MovingParticles(stage, paths, probability);
  }
}

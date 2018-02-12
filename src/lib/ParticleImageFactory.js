import ParticleImage from "./ParticleImage.js";
import { makeLogger } from "./logging/Logger";

const log = makeLogger("ParticleImageFactory");

export default class ParticleImageFactory {
  static create(stage, imagedata) {
    log("creating a particle image");
    return new ParticleImage(stage, imagedata);
  }
}

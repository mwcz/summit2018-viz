import { makeLogger } from "../logging/Logger";

const log = makeLogger("Addon");

class Addon {
  constructor(stage) {
    log(`created ${this.constructor.name}`);
  }
  update(stage) {}
}

export default Addon;

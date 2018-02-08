import { makeLogger } from "../logging/Logger";

const log = makeLogger("Addon");

class Addon {
  constructor(viz) {
    log(`created ${this.constructor.name}`);
  }
  update(viz) {}
}

export default Addon;

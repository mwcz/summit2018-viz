import * as THREE from "three";
import { makeLogger } from "../logging/Logger";

const log = makeLogger("Stage");

class Stage {
  constructor() {
    log("created");
    this.addons = [];

    // start the animation loop
    this.render();
  }
  use(addonClass) {
    const addon = new addonClass(this);
    log(`using addon ${addon.name}`);
    this.addons.push(addon);
  }
  update() {
    this.addons.forEach(addon => addon.update(this));
  }
  render() {
    this.update();
    requestAnimationFrame(this.render.bind(this));
  }
}

export default Stage;

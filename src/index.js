import Stage from "./lib/stage/Stage";
import ParticlesAddon from "./lib/addons/ParticlesAddon";
import { makeLogger } from "./lib/logging/Logger";

const log = makeLogger("index");

log("launching app");

const stage = new Stage();

window.stage = stage;

stage.use(ParticlesAddon);

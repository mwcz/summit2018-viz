import Stage from "./lib/Stage.js";
import { makeLogger } from "./lib/logging/Logger.js";

const log = makeLogger("index");

log("launching app");

const stage = new Stage();

window.stage = stage;

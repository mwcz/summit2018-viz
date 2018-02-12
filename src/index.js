import Stage from "./lib/Stage";
import { makeLogger } from "./lib/logging/Logger";

const log = makeLogger("index");

log("launching app");

const stage = new Stage();

window.stage = stage;

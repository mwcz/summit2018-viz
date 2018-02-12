import * as THREE from "three";
import Addon from "./Addon";
import { makeLogger } from "../logging/Logger";

const log = makeLogger("ImageAddon");

class ImageAddon extends Addon {
  constructor(stage) {
    super(stage);

    this.stage = stage;

    this.loader = new THREE.ImageBitmapLoader();

    this.loader.load(
      document.querySelector("#tots").src,
      bitmap => {
        this._saveTexture(this._bitmapToTexture(bitmap));
      },
      undefined,
      err => {
        throw err;
      }
    );
  }
  update(stage) {
    // log(`updating ${this.name}`);
  }
  _bitmapToTexture(bitmap) {
    return new THREE.CanvasTexture(bitmap);
  }
  _saveTexture(texture) {
    this.stage.data.texture = texture;
  }
}

export default ImageAddon;

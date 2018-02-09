import * as THREE from "three";
import { makeLogger } from "../logging/Logger";

const log = makeLogger("Stage");

class Stage {
  constructor({ container = document.body } = {}) {
    log("created");
    this.addons = [];
    this.container = container;

    this._init();

    // start the animation loop
    this._render();
  }
  use(addonClass) {
    const addon = new addonClass(this);
    log(`using addon ${addon.name}`);
    this.addons.push(addon);
  }
  _init() {
    this._initCamera();
    this._initScene();
    this._initRenderer();
  }
  _initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1,
      3000
    );
    this.camera.position.y = -160;
    this.camera.position.z = 400;
  }
  _initScene() {
    this.scene = new THREE.Scene();
  }
  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);
  }
  _update() {
    this.addons.forEach(addon => addon.update(this));
  }
  _render() {
    requestAnimationFrame(this._render.bind(this));
    this._update();
    this.renderer.render(this.scene, this.camera);
  }
}

export default Stage;

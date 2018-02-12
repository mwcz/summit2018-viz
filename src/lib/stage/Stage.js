import * as THREE from "three";
import { makeLogger } from "../logging/Logger";

const log = makeLogger("Stage");

class Stage {
  constructor({ container = document.body, data = {} } = {}) {
    log("created");
    this.addons = [];
    this.container = container;
    this.data = {}; // arbitrary store for addons to share data

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
    this._initScene();
    this._initRenderer();
    this._initCamera();
  }
  _initCamera() {
    // this._initOrthographicCamera();
    this._initPerspectiveCamera();
  }
  _initPerspectiveCamera() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    log(`res: ${w} x ${h}`);
    this.camera = new THREE.PerspectiveCamera(70, w / h, 1, 1000);
    this.camera.position.z = 400;
  }
  _initOrthographicCamera() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const f = 1000;

    this.camera = new THREE.OrthographicCamera(
      w / -2,
      w / 2,
      h / 2,
      h / -2,
      1,
      f
    );
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

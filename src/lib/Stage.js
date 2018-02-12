import * as THREE from "three";
import OrbitControls from "./OrbitControls.js";
import DropImageSource from "./DropImageSource.js";
import ParticleImageFactory from "./ParticleImageFactory.js";
import { makeLogger } from "./logging/Logger";

const log = makeLogger("Stage");

export default class Stage {
  constructor({ container = document.body, data = {} } = {}) {
    log("created");
    this.actors = [];
    this.container = container;

    this._init();

    // start the animation loop
    this._render();
  }
  _init() {
    this._initScene();
    this._initRenderer();
    this._initCamera();
    this._initControls();

    this._initImageSource();
  }
  _initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }
  _initImageSource() {
    this._initDropImageSource();
  }
  _initDropImageSource() {
    const dropSource = new DropImageSource();
    dropSource.onImage(pixels => {
      log(`image dropped, ${pixels.width}x${pixels.height}`);
      const particleImage = ParticleImageFactory.create(this, pixels);
      this._registerActor(particleImage);
    });
  }
  _registerActor(actor) {
    this.actors.push(actor);
  }
  _initCamera() {
    // this._initOrthographicCamera();
    this._initPerspectiveCamera();
  }
  _initPerspectiveCamera() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    log(`res: ${w} x ${h}`);
    this.camera = new THREE.PerspectiveCamera(70, w / h, 1, 3000);
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
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);
  }
  _update() {
    this.actors.forEach(actor => actor.update(this));
  }
  _render() {
    requestAnimationFrame(this._render.bind(this));
    this._update();
    this.renderer.render(this.scene, this.camera);
  }
}

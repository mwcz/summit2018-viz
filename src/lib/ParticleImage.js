import * as THREE from "three";
import Actor from "./Actor.js";
import { makeLogger } from "./logging/Logger";

const log = makeLogger("ParticleImage");

export default class ParticleImage extends Actor {
  constructor(stage, imagedata) {
    super(stage);

    this.imagedata = imagedata;

    this.pointCount = this.imagedata.width * this.imagedata.height;

    log("created");

    this._initParticles();
  }
  update() {
    if (window.jitter) {
      this._jitterParticles();
    }
    // log(`updating ${this.name}`);
  }
  _jitterParticles() {
    const pos = this.geometry.attributes.position.array;
    for (let i = 0; i < pos.length; ++i) {
      // pos[i + 0] += 0.1;
      pos[i + 0] += (Math.random() - 0.5) / 8;
      pos[i + 1] += (Math.random() - 0.5) / 8;
      pos[i + 2] += (Math.random() - 0.5) / 8;
    }
    this.geometry.attributes.position.needsUpdate = true;
  }

  _initParticles(addToScene = true) {
    this.geometry = this._getGeometry();
    this.material = this._getMaterial();
    this.points = this._getPoints(this.geometry, this.material);

    log("particles initialized");

    if (addToScene) {
      this.stage.scene.add(this.points);
    }
  }

  _getGeometry() {
    log("creating geometry");
    const geometry = new THREE.BufferGeometry();

    const positions = this._getPositionAttribute();

    geometry.addAttribute("position", positions);
    geometry.addAttribute("color", this._getColorAttribute(positions));

    return geometry;
  }

  _getPoints(geometry, material) {
    log("creating points");
    const points = new THREE.Points(geometry, material);
    points.position.x -= this.imagedata.width / 2;
    points.position.y -= this.imagedata.height / 2;
    return points;
  }

  _getMaterial() {
    log("creating material");
    return new THREE.PointsMaterial({
      size: 1.3,
      color: 0xffffff,
      vertexColors: THREE.VertexColors
      // map: new THREE.Texture()
    });
  }

  _getPositionAttribute() {
    log("creating position attribute");
    const array = new Float32Array(this.pointCount * 3);

    for (let i = 0; i < this.pointCount; i++) {
      const x = i % this.imagedata.width;
      const y = Math.floor(i / this.imagedata.width);
      const z = 0;

      array[i * 3 + 0] = x;
      array[i * 3 + 1] = -y + this.imagedata.height;
      array[i * 3 + 2] = z;
    }

    return new THREE.Float32BufferAttribute(array, 3);
  }

  /* colors are based on positions, currently, but not forever */
  _getColorAttribute(positions) {
    log("creating color attribute");
    const array = new Float32Array(this.pointCount * 3);
    const color = new THREE.Color();
    let vertex;

    for (let i = 0; i < this.pointCount; ++i) {
      const i3 = i * 3;
      const i4 = i * 4;
      array[i3 + 0] = this.imagedata.data[i4 + 0] / 255;
      array[i3 + 1] = this.imagedata.data[i4 + 1] / 255;
      array[i3 + 2] = this.imagedata.data[i4 + 2] / 255;
      // const x = positions.array[i + 0];
      // const y = positions.array[i + 1];
      // const z = positions.array[i + 2];

      // const r = x / 400 + 0.5;
      // const g = y / 400 + 0.5;
      // const b = z / 400 + 0.5;

      // color.setRGB(r, g, b);

      // array[i + 0] = color.r;
      // array[i + 1] = color.g;
      // array[i + 2] = color.b;
    }

    return new THREE.Float32BufferAttribute(array, 3);
  }
}

////////////////////////////////////////////////////////////////////////
//                            WOOT, TOTS!                             //
////////////////////////////////////////////////////////////////////////

// function getImageData( image ) {

//     var canvas = document.createElement( 'canvas' );
//     canvas.width = image.width;
//     canvas.height = image.height;

//     var context = canvas.getContext( '2d' );
//     context.drawImage( image, 0, 0 );

//     return context.getImageData( 0, 0, image.width, image.height );

// }

// function getPixel( imagedata, x, y ) {

//     var position = ( x + imagedata.width * y ) * 4, data = imagedata.data;
//     return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };

// }

// const imagedata = getImageData(stage.data.texture.image).data;
// for(var i = 0; i < imagedata.length / 4; i++) {
//   stage.addons[1].geometry.attributes.color.array[i*3+0] = imagedata[i*4+0] / 255;
//   stage.addons[1].geometry.attributes.color.array[i*3+1] = imagedata[i*4+1] / 255;
//   stage.addons[1].geometry.attributes.color.array[i*3+2] = imagedata[i*4+2] / 255;
// }
// stage.addons[1].geometry.attributes.color.needsUpdate = true;

////////////////////////////////////////////////////////////////////////
//                     THE ABOVE MAKES TOTS WORK                      //
////////////////////////////////////////////////////////////////////////

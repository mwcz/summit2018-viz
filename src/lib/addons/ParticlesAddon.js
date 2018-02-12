import * as THREE from "three";
import Addon from "./Addon";
import { makeLogger } from "../logging/Logger";

const log = makeLogger("ParticlesAddon");

class ParticlesAddon extends Addon {
  constructor(stage) {
    super(stage);

    this.width = 400;
    this.height = 300;

    this.pointCount = this.width * this.height;

    this._initParticles(stage);
  }
  update(stage) {
    // log(`updating ${this.name}`);
  }

  _initParticles(stage) {
    this.geometry = this._getGeometry();
    this.material = this._getMaterial();
    this.points = this._getPoints(this.geometry, this.material);

    log("particles initialized");

    stage.scene.add(this.points);
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
    points.position.x -= this.width / 2;
    points.position.y -= this.height / 2;
    return points;
  }

  _getMaterial() {
    log("creating material");
    return new THREE.PointsMaterial({
      size: 1,
      color: 0xffffff,
      vertexColors: THREE.VertexColors
      // map: new THREE.Texture()
    });
  }

  _getPositionAttribute() {
    log("creating position attribute");
    const array = new Float32Array(this.pointCount * 3);

    for (let i = 0; i < this.pointCount; i++) {
      const x = i % this.width;
      const y = Math.floor(i / this.width);
      const z = 0;

      array[i * 3 + 0] = x;
      array[i * 3 + 1] = y;
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
      const x = positions.array[i + 0];
      const y = positions.array[i + 1];
      const z = positions.array[i + 2];

      const r = x / 400 + 0.5;
      const g = y / 400 + 0.5;
      const b = z / 400 + 0.5;

      color.setRGB(r, g, b);

      array[i + 0] = color.r;
      array[i + 1] = color.g;
      array[i + 2] = color.b;
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

export default ParticlesAddon;

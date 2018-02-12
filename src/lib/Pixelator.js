import { makeLogger } from "./logging/Logger";

const log = makeLogger("Pixelator");

export default class Pixelator {
  static _extractImageData(img) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);

    return context.getImageData(0, 0, img.width, img.height);
  }
  static _getImg(src) {
    const img = document.createElement("img");
    img.src = src;

    return img;
  }
  init(img) {
    return new Promise((resolve, reject) => {
      this.img = Pixelator._getImg(img);
      this.img.addEventListener("load", () => {
        this.imagedata = Pixelator._extractImageData(this.img);
        resolve(this);
      });
      this.img.addEventListener("error", () => {
        reject("error loading image");
      });
    });
  }
  getPixel(x, y) {
    const position = (x + this.imagedata.width * y) * 4;
    const data = this.imagedata.data;
    return {
      r: data[position + 0],
      g: data[position + 1],
      b: data[position + 2],
      a: data[position + 3]
    };
  }
  getImageData() {
    return this.imagedata;
  }
}

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

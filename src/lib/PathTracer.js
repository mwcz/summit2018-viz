import { flatten, each } from "lodash";

////////////////////////////////////////////////////////////////////////
//                               POINT                                //
////////////////////////////////////////////////////////////////////////

class Point {
  static domIsPoint(el) {
    return el.classList.contains("point");
  }
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.id = Point.nextId++;
  }
  clone() {
    return new Point(this.x, this.y);
  }
  toArray() {
    return [this.x, this.y];
  }
  addToDOM() {
    const p = document.createElement("div");
    p.setAttribute(
      "style",
      `
      background: rgba(255, 255, 128, 0.4);
      border: 2px dotted rgba(255, 255, 128, 0.7);
      border-radius: 50%;
      height: 30px;
      width: 30px;
      transform: translate(-50%, -50%);
      position: absolute;
      left: ${this.x}px;
      top: ${this.y}px;
      cursor: pointer;
      z-index: 50;
    `
    );
    p.classList.add("point");
    p.point = this;
    this.domNode = p;
    document.body.appendChild(p);
  }
  dim() {
    this.domNode.style.opacity = 0.2;
  }
}

Point.nextId = 0;

////////////////////////////////////////////////////////////////////////
//                                PATH                                //
////////////////////////////////////////////////////////////////////////

class Path {
  constructor() {
    this.points = [];
  }
  addPoint(x, y) {
    const point = new Point(x, y);
    point.addToDOM();
    this.points.push(point);
  }
  end() {
    // dim all points
    this.points.forEach(p => p.dim());
  }
}

////////////////////////////////////////////////////////////////////////
//                            PATH TRACER                             //
////////////////////////////////////////////////////////////////////////

export default class PathTracer {
  constructor() {
    this.domMarkers = {};
    this.finalizedPaths = [];

    this._setupUI();

    this._mouseMoveHandler = this._mouseMoveHandler.bind(this);
    this._mouseUpHandler = this._mouseUpHandler.bind(this);
    this._mouseDownHandler = this._mouseDownHandler.bind(this);
  }

  startPath() {
    // allow placement of first point in a path
    // on click in empty space, add a point there
    // or, on click of an existing point, copy it onto the current path
    this.currentPath = new Path();

    // highlight the start button
    this.domEls.startPath.classList.add("active");

    this._startMouse();
  }

  endPath() {
    // finish the current path and allow starting a new one
    if (this.currentPath) {
      this.currentPath.end();
      this._stopMouse();
      this._savePath();
      this._exportPath();
    }

    // un-highlight the start button
    this.domEls.startPath.classList.remove("active");

    this.currentPath = undefined;
  }

  _exportPath() {
    const flattenedPoints = [];
    flatten(this.finalizedPaths.map(p => p.points)).forEach(point => {
      flattenedPoints.push(point.x);
      flattenedPoints.push(point.y);
    });
    console.log(flattenedPoints);
    this.domEls.exportArea.textContent = flattenedPoints;
  }

  import(points) {
    // import a JSON dump of previously generated points
  }

  print() {
    // print out all the paths
    this.finalizedPaths.forEach((path, i) => {
      console.log(`path ${i}:`);
      path.points.forEach(point =>
        console.log(`id ${point.id} (${point.x},${point.y})`)
      );
    });
  }

  _setupUI() {
    this.domEls = {
      startPath: document.querySelector("#start-path"),
      endPath: document.querySelector("#end-path"),
      exportArea: document.querySelector("#export-area")
    };

    this.domEls.startPath.addEventListener("click", ev => {
      ev.preventDefault();
      ev.stopPropagation();
      this.startPath();
    });
    this.domEls.endPath.addEventListener("click", ev => {
      ev.preventDefault();
      ev.stopPropagation();
      this.endPath();
    });
  }

  _savePath() {
    // add the current path to the list of finalized paths
    this.finalizedPaths.push(this.currentPath);
  }

  _addPoint(x, y) {
    // add a point to the current path
    this.currentPath.addPoint(x, y);
  }

  _startMouse() {
    document.addEventListener("mousemove", this._mouseMoveHandler, false);
    document.addEventListener("mouseup", this._mouseUpHandler, false);
    document.addEventListener("mousedown", this._mouseDownHandler, false);

    // create a fake point to move along with the mouse
    const point = new Point();
    point.addToDOM();
    const movingPoint = point.domNode;
    movingPoint.style.pointerEvents = "none";
    this.movingPoint = movingPoint;
  }

  _stopMouse() {
    document.removeEventListener("mousemove", this._mouseMoveHandler, false);
    document.removeEventListener("mouseup", this._mouseUpHandler, false);
    document.removeEventListener("mousedown", this._mouseDownHandler, false);

    if (this.movingPoint) {
      document.body.removeChild(this.movingPoint);
      this.movingPoint = undefined;
    }
  }

  _mouseMoveHandler(ev) {
    const onExistingPoint = Point.domIsPoint(ev.target);

    let x = 0;
    let y = 0;

    if (this.movingPoint) {
      if (onExistingPoint) {
        x = ev.target.point.x;
        y = ev.target.point.y;
      } else {
        x = ev.clientX;
        y = ev.clientY;
      }
      this.movingPoint.style.left = `${x}px`;
      this.movingPoint.style.top = `${y}px`;
    }
  }

  _mouseUpHandler(ev) {
    const clickedOnPoint = Point.domIsPoint(ev.target);
    const clickedOnCanvas = ev.target instanceof HTMLCanvasElement;
    if (clickedOnPoint) {
      this._addPoint(ev.target.point.x, ev.target.point.y);
      // hide the point that was clicked on; another will be put on top of it
      // and this prevents overlapping
      ev.target.hidden = true;
    } else if (clickedOnCanvas) {
      this._addPoint(ev.clientX, ev.clientY);
    }
  }

  _mouseDownHandler(ev) {
    ev.preventDefault();
  }

  _normalize() {
    // find the longest path, then for any shorter paths, repeat their final
    // point until they're as long as the longest path
  }
}

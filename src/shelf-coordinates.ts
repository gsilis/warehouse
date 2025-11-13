import { Plane, PlaneHelper, Vector2, Vector3 } from "three";

type VectorGeneratingFunction = (staticDim: number, point: Vector2) => Vector3;

export class ShelfCoordinates {
  static createBlank(): ShelfCoordinates {
    return new ShelfCoordinates(0, new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), () => new Vector3(0, 0, 0));
  }

  private staticDim: number;
  private startPoint: Vector2;
  private endPoint: Vector2;
  private units: Vector2;
  private toVector: VectorGeneratingFunction;

  private xStep: number = 0;
  private yStep: number = 0;

  constructor(
    staticDim: number,
    startPoint: Vector2,
    endPoint: Vector2,
    units: Vector2,
    vectorFn: VectorGeneratingFunction,
  ) {
    this.staticDim = staticDim;
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.units = units;
    this.toVector = vectorFn;

    this.calculateUnits();
  }

  pointFor(x: number, y: number): Vector3 {
    const addX = x * this.xStep;
    const addY = y * this.yStep;
    const point = new Vector2(this.startPoint.x + addX, this.startPoint.y + addY);

    return this.toVector(this.staticDim, point);
  }

  // getPlane(): [Plane, PlaneHelper] {
  //   const plane = new Plane(new Vector3(this.startPoint.x, this.staticDim, this.startPoint.y));
  // }

  private calculateUnits() {
    this.xStep = Math.abs((this.startPoint.x - this.endPoint.x) / this.units.x);
    this.yStep = Math.abs((this.startPoint.y - this.endPoint.y) / this.units.y);
  }
}
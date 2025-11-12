import { Vector2, Vector3 } from "three";
import { ShelfCoordinates } from "./shelf-coordinates";

export class ShelfCoordinateFactory {
  createStaticY(y: number, rows: number, columns: number, start: Vector2, end: Vector2): ShelfCoordinates {
    const units = new Vector2(rows, columns);
    const fn = (y: number, point: Vector2) => {
      return new Vector3(point.x, y, point.y);
    };
    const object = new ShelfCoordinates(
      y, start, end, units, fn
    );

    return object;
  }
}
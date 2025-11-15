import type { Vector3 } from "three";

export class ShelfPositionManager {
  private start: Vector3;
  private end: Vector3;
  private rows: number;
  private columns: number;

  constructor(start: Vector3, end: Vector3, rows: number, columns: number) {
    this.start = start;
    this.end = end;
    this.rows = rows;
    this.columns = columns;
  }
}
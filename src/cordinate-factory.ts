import { Vector3 } from "three";

export class CoordinateFactory {
  private rows: number;
  private columns: number;
  private indicesPerShelf: number;
  private start: Vector3;
  private end: Vector3;
  private ySize: number;
  private zSize: number;
  private xSize: number;

  constructor(rows: number, columns: number, start: Vector3, end: Vector3, ySize: number) {
    this.rows = rows;
    this.columns = columns;
    this.start = start;
    this.end = end;
    this.ySize = ySize;

    this.indicesPerShelf = this.rows * this.columns;
    const zDiff = this.end.z - this.start.z;
    const xDiff = this.end.x - this.start.x;
    const zMulti = zDiff / zDiff;
    const xMulti = xDiff / xDiff;

    this.zSize = zDiff/ (this.rows - 1);
    this.xSize = xDiff / (this.columns - 1);
  }

  create(index: number): Vector3 {
    const shelf = Math.floor(index / this.indicesPerShelf);
    const shelfRemaining = index - (shelf * this.indicesPerShelf);
    const row = Math.floor(shelfRemaining / this.columns);
    const column = shelfRemaining - (row * this.columns);

    return new Vector3(
      this.start.x + (column * this.xSize),
      this.start.y + (shelf * this.ySize),
      this.start.z + (row * this.zSize)
    );
  }
}
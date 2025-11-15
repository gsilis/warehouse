import { Vector3 } from "three";

export class CoordinateFactory {
  private rows: number;
  private columns: number;
  private indicesPerShelf: number;

  constructor(rows: number, columns: number) {
    this.rows = rows;
    this.columns = columns;

    this.indicesPerShelf = this.rows * this.columns;
  }

  create(index: number): Vector3 {
    const shelf = Math.floor(index / this.indicesPerShelf);
    const shelfRemaining = index - (shelf * this.indicesPerShelf);
    const row = Math.floor(shelfRemaining / this.columns);
    const column = shelfRemaining - (row * this.columns);

    console.log({ index, shelf, shelfRemaining, row, column });

    return new Vector3(0, 0, 0);
  }
}
import { Vector2 } from "three";

/**
 * Translates a number into an XY
 * +-+-+-+-+
 * |0|1|2|3|
 * +-+-+-+-+
 * |4|5|6|7|
 * +-+-+-+-+
 */
export class CoordinateTranslator {
  private rows: number;
  private columns: number;

  constructor(rows: number, columns: number) {
    this.rows = rows;
    this.columns = columns;
  }

  xyFor(index: number): Vector2 {
    const indicesPerShelf = this.rows * this.columns;
    const shelfIndex = index - (index % indicesPerShelf);
    const col = shelfIndex % this.columns;
    const row = shelfIndex - col;

    return new Vector2(row, col);
  }
}
export class ShelfResourceManager<T> {
  private blankResource: T;
  private shelves: T[] = [];
  private rows: number;
  private columns: number;

  constructor(rows: number, columns: number, blank: T) {
    this.rows = rows;
    this.columns = columns;
    this.blankResource = blank;
  }

  add(shelfCoordinates: T) {
    this.shelves.push(shelfCoordinates);
  }

  shelfFor(index: number): T {
    const shelfSize = this.rows * this.columns;
    const shelf = Math.floor(index / shelfSize);

    return this.shelves[shelf] || this.blankResource;    
  }

  get shelfCount(): number {
    return this.shelves.length;
  }
}
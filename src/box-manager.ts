import { Vector2, type Mesh, type Scene } from "three";
import { BoxFactory } from "./box-factory";
import { ShelfCoordinateFactory } from "./shelf-coordinate-factory";
import { SHELF_COLUMNS, SHELF_ROWS } from "./contexts/box-context";
import { ShelfResourceManager } from "./shelf-resource-manager";
import { change } from "./utilities/array";

export class BoxManager {
  private _boxAsset?: Mesh;
  private _scene: Scene;
  private _rows: number;
  private _columns: number;
  private _cachedBoxes: Mesh[] = [];
  private _shelfResourceManager: ShelfResourceManager<BoxFactory>;
  private _shelfCoordinateFactory: ShelfCoordinateFactory;

  constructor(scene: Scene, rows: number, columns: number) {
    this._scene = scene;
    this._rows = rows;
    this._columns = columns;
    this._shelfCoordinateFactory = new ShelfCoordinateFactory();
    this._shelfResourceManager = new ShelfResourceManager<BoxFactory>(rows, columns, BoxFactory.createBlank());
  }

  get asset(): Mesh | undefined {
    return this._boxAsset;
  }

  set asset(value: Mesh | undefined) {
    this._boxAsset = value;

    const start = new Vector2(-3.95, -1.73);
    const end = new Vector2(4.45, -3.85);

    if (!this._boxAsset) return;

    this._shelfResourceManager.add(
      new BoxFactory(
        this._boxAsset,
        this._shelfCoordinateFactory.createStaticY(1.61, SHELF_ROWS, SHELF_COLUMNS, start, end)
      )
    );
    this._shelfResourceManager.add(
      new BoxFactory(
        this._boxAsset,
        this._shelfCoordinateFactory.createStaticY(3.91, SHELF_ROWS, SHELF_COLUMNS, start, end)
      )
    );
    this._shelfResourceManager.add(
      new BoxFactory(
        this._boxAsset,
        this._shelfCoordinateFactory.createStaticY(6.21, SHELF_ROWS, SHELF_COLUMNS, start, end)
      )
    );
  }

  updateBoxes(newBoxes: number[]) {
    console.log(newBoxes);
  }
}
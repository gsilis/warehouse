import { Vector2, type Mesh, type Scene } from "three";
import { BoxFactory } from "./box-factory";
import { ShelfCoordinateFactory } from "./shelf-coordinate-factory";
import { SHELF_COLUMNS, SHELF_ROWS } from "./contexts/box-context";
import { ShelfResourceManager } from "./shelf-resource-manager";
import { CoordinateTranslator } from "./coordinate-translator";

export class BoxManager {
  private _boxAsset?: Mesh;
  private _scene: Scene;
  private _rows: number;
  private _columns: number;
  private _cachedBoxes: Record<number, Mesh> = {};
  private _indices: number[] = [];
  private _shelfResourceManager: ShelfResourceManager<BoxFactory>;
  private _shelfCoordinateFactory: ShelfCoordinateFactory;
  private _coordinates: CoordinateTranslator;

  constructor(scene: Scene, rows: number, columns: number) {
    this._scene = scene;
    this._rows = rows;
    this._columns = columns;
    this._shelfCoordinateFactory = new ShelfCoordinateFactory();
    this._shelfResourceManager = new ShelfResourceManager<BoxFactory>(rows, columns, BoxFactory.createBlank());
    this._coordinates = new CoordinateTranslator(this._rows, this._columns);
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
    const [indicesToAdd, indicesToRemove] = [...newBoxes, ...this._indices].reduce<[number[], number[]]>((arr, index) => {
      const inNewValue = newBoxes.includes(index);
      const inOldValue = this._indices.includes(index);

      if (inNewValue && inOldValue) {
      } else if (inNewValue) {
        arr[0].push(index);
      } else if (inOldValue) {
        arr[1].push(index);
      }

      return arr;
    }, [[], []]);

    indicesToRemove.forEach((index) => {
      const box = this._cachedBoxes[index];
      delete this._cachedBoxes[index];
      this._scene.remove(box);
    });

    indicesToAdd.forEach((index) => {
      const boxFactory = this._shelfResourceManager.shelfFor(index);
      const coordinates = this._coordinates.xyFor(index);
      const box = boxFactory.create(coordinates.y, coordinates.x);
      this._cachedBoxes[index] = box;

      console.log('Adding box to scene', coordinates, index, box.position);
      this._scene.add(box);
    });

    this._indices = [ ...newBoxes ];
  }
}
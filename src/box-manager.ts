import type { Mesh, Scene } from "three";

export class BoxManager {
  private _boxAsset?: Mesh;
  private _scene: Scene;
  private _active: boolean[] = [];
  private _rows: number;
  private _columns: number;

  constructor(scene: Scene, rows: number, columns: number) {
    this._scene = scene;
    this._rows = rows;
    this._columns = columns;
  }

  get asset(): Mesh | undefined {
    return this._boxAsset;
  }

  set asset(value: Mesh | undefined) {
    this._boxAsset = value;
  }

  updateBoxes(newBoxes: boolean[]) {
    // TBD how to update these
    console.log('Received boxes', newBoxes);
    this._active = newBoxes;
  }
}
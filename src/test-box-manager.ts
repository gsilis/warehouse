import type { Mesh, Scene } from "three";
import { GUI } from "dat.gui";

export class TestBoxManager {
  private _scene: Scene;
  private _gui?: GUI;
  private _box?: Mesh;
  private _boxClone?: Mesh;

  constructor(scene: Scene) {
    this._scene = scene;
  }

  get box(): Mesh | undefined {
    return this._box;
  }

  set box(value: Mesh | undefined) {
    this._box = value;
  }

  setup() {
    if (this._gui || !this._box || this._boxClone) return;

    this._boxClone = this._box.clone();
    this._boxClone.position.set(0, 4, 4);
    this._boxClone.receiveShadow = true;
    this._boxClone.castShadow = true;
    this._scene.add(this._boxClone);

    this._gui = new GUI();
    const f = this._gui.addFolder('Test Box');
    f.add(this._boxClone.position, 'x', -7, 7, 0.01);
    f.add(this._boxClone.position, 'y', -7, 7, 0.01);
    f.add(this._boxClone.position, 'z', -7, 7, 0.01);
  }

  teardown() {
    if (this._gui) {
      this._gui.destroy();
      this._gui = undefined;
    }

    if (this._boxClone) {
      this._scene.remove(this._boxClone);
      this._boxClone = undefined;
    }
  }
}
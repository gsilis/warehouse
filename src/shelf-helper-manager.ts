import { BoxGeometry, BoxHelper, Color, Mesh, type Scene } from "three";
import type { CoordinateFactory } from "./cordinate-factory";

const SHELF_PLANE_COLOR = (new Color()).setHex(0x00FF00);
const BOX_MESH_COLOR = (new Color()).setHex(0x00FFFF);

export class ShelfHelperManager {
  private state: boolean;
  private scene: Scene;
  private coordinateFactory: CoordinateFactory;
  private shelves: number;
  private rows: number;
  private columns: number;
  private items: (BoxHelper)[] = [];

  constructor(
    scene: Scene,
    coordinateFactory: CoordinateFactory,
    state = false,
    shelves: number,
    rows: number,
    columns: number,
  ) {
    this.scene = scene;
    this.coordinateFactory = coordinateFactory;
    this.state = state;
    this.shelves = shelves;
    this.rows = rows;
    this.columns = columns;
  }

  toggle(state: boolean) {
    const oldState = this.state;
    this.state = state;

    if (oldState === state) {
      return;
    }

    this.state ? this.enable() : this.disable();
  }

  private enable() {
    const indicesPerShelf = this.rows * this.columns;

    for (let shelf = 0; shelf < this.shelves; shelf++) {
      const index1 = (shelf * indicesPerShelf);
      const index2 = index1 + this.columns - 1;
      const index3 = index2 + 1;

      const vec1 = this.coordinateFactory.create(index1);
      const vec2 = this.coordinateFactory.create(index2);
      const vec3 = this.coordinateFactory.create(index3);

      const planeWidth = vec1.x - vec2.x;
      const planeHeight = vec1.z - vec3.z;
      const geom = new BoxGeometry(planeWidth, 0.01, planeHeight, 1, 1, 1);
      const box = new Mesh(geom);
      const boxHelper = new BoxHelper(box, SHELF_PLANE_COLOR);

      box.position.set(vec1.x - (planeWidth / 2), vec1.y, vec1.z - (planeHeight / 2));
      boxHelper.update();

      this.items.push(boxHelper);
      this.scene.add(boxHelper);
    }

    const indices = this.rows * this.columns * this.shelves;

    for (let index = 0; index < indices; index++) {
      const vector = this.coordinateFactory.create(index);
      const geom = new BoxGeometry(2, 2, 2, 1, 1, 1);
      const box = new Mesh(geom);
      const boxHelper = new BoxHelper(box, BOX_MESH_COLOR);

      box.position.set(vector.x, vector.y, vector.z);
      boxHelper.update();

      this.items.push(boxHelper);
      this.scene.add(boxHelper);
    }
  }

  private disable() {
    this.items.forEach(mesh => this.scene.remove(mesh));
    this.items = [];
  }
}
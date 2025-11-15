import type { Mesh } from "three";
import type { CoordinateFactory } from "./cordinate-factory";

export class BoxFactory {
  private mesh: Mesh;
  private coordinateFactory: CoordinateFactory;

  constructor(mesh: Mesh, coordinateFactory: CoordinateFactory) {
    this.mesh = mesh;
    this.coordinateFactory = coordinateFactory;
  }

  create(index: number): Mesh {
    const coordinates = this.coordinateFactory.create(index);
    const mesh = this.mesh.clone();

    mesh.position.set(coordinates.x, coordinates.y, coordinates.z);

    return mesh;
  }
}
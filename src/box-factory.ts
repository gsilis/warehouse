import type { Mesh } from "three";
import type { ShelfCoordinates } from "./shelf-coordinates";

export class BoxFactory {
  private mesh: Mesh;
  private coordinates: ShelfCoordinates;

  constructor(mesh: Mesh, coordinates: ShelfCoordinates) {
    this.mesh = mesh;
    this.coordinates = coordinates;
  }

  create(x: number, y: number): Mesh {
    const clone = this.mesh.clone();
    const position = this.coordinates.pointFor(x, y);

    clone.position.x = position.x;
    clone.position.y = position.y;
    clone.position.z = position.z;

    return clone;
  }
}
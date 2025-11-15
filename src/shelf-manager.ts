import type { Mesh, Scene } from "three";
import type { BoxFactory } from "./box-factory";

export class ShelfManager {
  private scene: Scene;
  private boxFactory: BoxFactory;
  private settings: number[];
  private currentObjects: Record<number, Mesh> = {};

  constructor(scene: Scene, boxFactory, settings: number[] = []) {
    this.scene = scene;
    this.boxFactory = boxFactory;
    this.settings = settings;
  }

  update(newBoxes: number[]) {
    const oldSettings = [...this.settings];
    this.settings = newBoxes;
    const removals = oldSettings.filter(s => newBoxes.indexOf(s) === -1);
    const additions = newBoxes.filter(s => oldSettings.indexOf(s) === -1);

    removals.forEach(i => this.removeBox(i));
    additions.forEach(i => this.addBox(i));
  }

  private addBox(index: number) {
    const box = this.boxFactory.create(index);
    this.currentObjects[index] = box;
    this.scene.add(box);
  }

  private removeBox(index: number) {
    const box = this.currentObjects[index];
    delete this.currentObjects[index];
    if (box) {
      this.scene.remove(box);
    }
  }
}
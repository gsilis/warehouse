import { GUI } from "dat.gui";
import type { Mesh, Scene } from "three";

export class TestCubeManager {
  private scene: Scene;
  private cube: Mesh;
  private gui?: GUI;
  private cubeInstance?: Mesh;

  constructor(scene: Scene, cube: Mesh) {
    this.scene = scene;
    this.cube = cube;
  }

  setup() {
    this.cubeInstance = this.cube.clone();
    this.scene.add(this.cubeInstance);
    this.gui = new GUI();

    const folder = this.gui.addFolder('Test Cube Position');
    folder.open();
    folder.add(this.cubeInstance.position, 'x', -7, 7, 0.01);
    folder.add(this.cubeInstance.position, 'y', 1, 15, 0.01);
    folder.add(this.cubeInstance.position, 'z', -7, 7, 0.01);

    this.cubeInstance.position.y = 1;
    this.cubeInstance.position.z = 1;
  }

  teardown() {
    if (this.cubeInstance) {
      this.scene.remove(this.cubeInstance);
      this.cubeInstance = undefined;
    }

    if (this.gui) {
      this.gui.destroy();
      this.gui = undefined;
    }
  }
}
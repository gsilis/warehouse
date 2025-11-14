import type { WebGLRenderer } from "three";
import { AssetsLoader } from "./assets-loader";
import { AssetLoader } from "./asset-loader";
import { Timer } from "./utilities/timer";
import { ShelvesScene } from "./shelves.scene";

export class WarehouseScene {
  private renderer: WebGLRenderer;
  private loaders: AssetsLoader;
  private timer: Timer;

  constructor(
    renderer: WebGLRenderer
  ) {
    this.timer = new Timer('GLB Asset loader');
    this.timer.start();
    this.renderer = renderer;
    this.loaders = new AssetsLoader();
    this.loaders.add('box', new AssetLoader('/box.glb'));
    this.loaders.add('room', new AssetLoader('/warehouse.glb'));
    this.loaders.subscribe({
      next: () => {},
      complete: this.onComplete.bind(this),
      error: () => {},
    });
  }

  onComplete() {
    this.timer.stop();
    this.timer.report();

    const boxPackage = this.loaders.assets['box'];
    const roomPackage = this.loaders.assets['room'];

    if (!boxPackage || !roomPackage) {
      return;
    }

    const box = boxPackage.scene;
    const room = roomPackage.scene;

    new ShelvesScene(this.renderer, box, room);
  }
}
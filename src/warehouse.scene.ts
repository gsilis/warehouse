import type { PerspectiveCamera, WebGLRenderer } from "three";
import { AssetsLoader } from "./assets-loader";
import { AssetLoader } from "./asset-loader";
import { Timer } from "./utilities/timer";
import { ShelvesScene } from "./shelves.scene";
import type { OrbitControls } from "three/examples/jsm/Addons.js";

export class WarehouseScene {
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private loaders: AssetsLoader;
  private timer: Timer;
  private beforeRender: () => void;

  constructor(
    renderer: WebGLRenderer,
    camera: PerspectiveCamera,
    beforeRender: () => void = () => {},
  ) {
    this.timer = new Timer('GLB Asset loader');
    this.timer.start();
    this.renderer = renderer;
    this.camera = camera;
    this.beforeRender = beforeRender;

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

    new ShelvesScene(this.renderer, this.camera, box, room, this.beforeRender);
  }
}
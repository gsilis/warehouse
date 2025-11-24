import type { PerspectiveCamera, WebGLRenderer } from "three";
import { AssetsLoader } from "./assets-loader";
import { AssetLoader } from "./asset-loader";
import { Timer } from "./utilities/timer";
import { ShelvesScene } from "./shelves.scene";
import type { GlobalSettings } from "./global-settings";
import type { OrbitControls } from "three/examples/jsm/Addons.js";

export class WarehouseScene {
  private settings: GlobalSettings;
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private loaders: AssetsLoader;
  private timer: Timer;
  private controls?: OrbitControls;
  private beforeRender: () => void;

  constructor(
    renderer: WebGLRenderer,
    camera: PerspectiveCamera,
    beforeRender: () => void = () => {},
    settings: GlobalSettings,
    controls?: OrbitControls,
  ) {
    this.timer = new Timer('GLB Asset loader');
    this.timer.start();

    this.settings = settings;
    this.renderer = renderer;
    this.camera = camera;
    this.controls = controls;
    this.beforeRender = beforeRender;

    this.loaders = new AssetsLoader();
    this.loaders.add('box', new AssetLoader('./box.glb'));
    this.loaders.add('room', new AssetLoader('./warehouse.glb'));
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

    new ShelvesScene(this.renderer, this.camera, box, room, this.beforeRender, this.settings, this.controls);
  }
}
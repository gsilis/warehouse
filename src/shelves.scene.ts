import { AmbientLight, Color, Fog, FogExp2, Mesh, Object3D, PerspectiveCamera, Scene, SpotLight, Vector3, type Group, type Object3DEventMap, type WebGLRenderer } from "three";
import type { GlobalSettings } from "./global-settings";
import { ShadowToggle } from "./shadow-toggle";
import { TestCubeManager } from "./test-cube-manager";
import { LightHelperManager } from "./light-helper-manager";
import { ShelfManager } from "./shelf-manager";
import { CoordinateFactory } from "./cordinate-factory";
import { BoxFactory } from "./box-factory";
import { ShelfHelperManager } from "./shelf-helper-manager";
import type { OrbitControls } from "three/examples/jsm/Addons.js";

export class ShelvesScene {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private box: Group<Object3DEventMap>;
  private room: Group<Object3DEventMap>;
  private ambientLight: AmbientLight;
  private lights: SpotLight[] = [];
  private beforeRender: () => void;
  private settings: GlobalSettings;
  private shadowToggle: ShadowToggle;
  private testCubeManager: TestCubeManager;
  private lightHelperManager: LightHelperManager;
  private shelfManager: ShelfManager;
  private coordinateFactory: CoordinateFactory;
  private boxFactory: BoxFactory;
  private shelfHelperManager: ShelfHelperManager;
  private controls?: OrbitControls;

  constructor(
    renderer: WebGLRenderer,
    camera: PerspectiveCamera,
    box: Group<Object3DEventMap>,
    room: Group<Object3DEventMap>,
    beforeRender: () => void = () => {},
    settings: GlobalSettings,
    controls?: OrbitControls
  ) {
    this.scene = new Scene();
    this.camera = camera;
    this.renderer = renderer;
    this.box = box;
    this.room = room;
    this.beforeRender = beforeRender;
    this.settings = settings;
    this.controls = controls;
    this.ambientLight = new AmbientLight(0xffffff, 1);
    this.shadowToggle = new ShadowToggle(this.renderer, false);
    this.testCubeManager = new TestCubeManager(this.scene, this.box.children[0] as Mesh);
    this.lightHelperManager = new LightHelperManager(this.scene, false);
    this.coordinateFactory = new CoordinateFactory(2, 5, new Vector3(-4, 1.68, -1.75), new Vector3(4.49, 1.68, -3.85), 2.27);
    this.boxFactory = new BoxFactory(this.box.children[0] as Mesh, this.coordinateFactory);
    this.shelfManager = new ShelfManager(this.scene, this.boxFactory);
    this.shelfHelperManager = new ShelfHelperManager(this.scene, this.coordinateFactory, false, 3, 2, 5);
    this.setup();
  }

  private setup() {
    this.camera.position.set(10.800573516263025, 15.235058507616007, 26.01630722640751);
    this.camera.rotateX(-0.3054604194122528);
    this.camera.rotateY(0.4141117780464906);
    this.camera.rotateZ(0.12620688296863003);
    this.scene.add(this.ambientLight);
    this.scene.add(this.room);

    if (this.controls) {
      this.controls.target.y = 10;
    }

    this.replaceLights();
    this.shadowToggle.addCamera(this.camera);
    this.shadowToggle.addLight(...this.lights);
    this.shadowToggle.addObject(...this.room.children);
    this.shadowToggle.addObject(...this.box.children);
    this.settings.subscribe<boolean>('shadows', this.onShadowSettings.bind(this));
    this.settings.subscribe<boolean>('testCube', this.onTestCube.bind(this));
    this.settings.subscribe<boolean>('lightHelpers', this.onLightHelpers.bind(this));
    this.settings.subscribe<number[]>('boxes', this.onBoxes.bind(this));
    this.settings.subscribe<boolean>('planeHelpers', this.onPlaneHelper.bind(this));
    this.addFog();

    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  private replaceLights() {
    const lightPlaceholder1 = this.room.children.find(o => o.name === 'light-1-placeholder');
    const lightPlaceholder2 = this.room.children.find(o => o.name === 'light-2-placeholder');

    lightPlaceholder1 && this.replaceLight(lightPlaceholder1);
    lightPlaceholder2 && this.replaceLight(lightPlaceholder2);
  }

  private replaceLight(placeholder: Object3D<Object3DEventMap>) {
    const color = new Color();
    const light = new SpotLight(color.setHex(0xf5ddb5), 200, 20, Math.PI / 3, 0, 2);
    light.position.set(placeholder.position.x, placeholder.position.y, placeholder.position.z);
    light.target.position.set(placeholder.position.x, 0, placeholder.position.z);

    this.scene.add(light);
    this.lights.push(light);
    this.lightHelperManager.addSpotLight(light);
  }

  private render() {
    this.beforeRender();
    this.renderer.render(this.scene, this.camera);
  }

  private addFog() {
    this.scene.fog = new FogExp2(0xFFFFFF, 0.003);
  }

  private onShadowSettings(state: boolean) {
    this.scene.remove(this.room);
    this.shadowToggle.toggle(state);
    this.scene.add(this.room);
  }

  private onTestCube(state: boolean) {
    state ? this.testCubeManager.setup() : this.testCubeManager.teardown();
  }

  private onLightHelpers(state: boolean) {
    this.lightHelperManager.toggle(state);
  }

  private onBoxes(value: number[]) {
    this.shelfManager.update(value);
  }

  private onPlaneHelper(value: boolean) {
    this.shelfHelperManager.toggle(value);
  }
}
import { AmbientLight, Color, PerspectiveCamera, Scene, SpotLight, Vector3, WebGLRenderer } from "three";
import { Loader } from "./loader";
import { OrbitControls, type GLTF } from "three/examples/jsm/Addons.js";

export class WarehouseScene {
  private renderer: WebGLRenderer;
  private sceneLoader: Loader;
  private boxLoader: Loader;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private ambient: AmbientLight;
  private orbitControls: OrbitControls;
  private spot1: SpotLight;
  private spot2: SpotLight;
  private boxes: boolean[] = [];

  constructor() {
    this.renderer = new WebGLRenderer({ antialias: true });
    this.sceneLoader = new Loader('/warehouse.glb');
    this.boxLoader = new Loader('/box.glb');
    this.camera = new PerspectiveCamera(75);
    this.camera.position.set(10.800573516263025, 15.235058507616007, 26.01630722640751);
    this.camera.rotateX(-0.3054604194122528);
    this.camera.rotateY(0.4141117780464906);
    this.camera.rotateZ(0.12620688296863003);
    this.scene = new Scene();
    this.ambient = new AmbientLight((new Color()).setHex(0xFFFFFF), 0.2);
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.spot1 = new SpotLight((new Color()).setHex(0xFFFFFF), 50, 0, 0.8, 0.9, 2);
    this.spot2 = new SpotLight((new Color()).setHex(0xFFFFFF), 50, 0, 0.8, 0.9, 2);

    this.spot1.castShadow = true;
    this.spot2.castShadow = true;
    this.spot1.shadow.mapSize.width = 8192;
    this.spot1.shadow.mapSize.height = 8192;
    this.spot2.shadow.mapSize.width = 8192;
    this.spot2.shadow.mapSize.height = 8192;

    this.scene.add(this.ambient);
  }

  setDimensions(width: number, height: number) {
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.orbitControls.update();
  }

  getCanvas() {
    return this.renderer.domElement;
  }

  start() {
    this.sceneLoader.load().subscribe(this.onSceneLoad.bind(this));
    this.boxLoader.load().subscribe(this.onBoxLoad.bind(this));
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  private onSceneLoad(data: GLTF) {
    this.scene.add(data.scene);

    data.scene.children.forEach(c => {
      c.castShadow = true;
      c.receiveShadow = true;
    });

    const spotlight1Placeholder = data.scene.getObjectByName('light-1-placeholder');
    const spotlight2Placeholder = data.scene.getObjectByName('light-2-placeholder');

    const settings: [SpotLight, Vector3 | undefined][] = [
      [this.spot1, spotlight1Placeholder?.position],
      [this.spot2, spotlight2Placeholder?.position]
    ];

    settings.forEach(([light, position]) => {
      if (!position) return;

      light.position.set(position.x, position.y, position.z);
      light.target.position.set(position.x, 0, position.z);
      this.scene.add(light);
    });
  }

  private onBoxLoad(data: GLTF) {
    const objects = data.scene.children;

    objects.forEach(o => {
      o.position.y = 5;
      o.castShadow = true;
      o.receiveShadow = true;
      this.scene.add(o);
    });
  }
}
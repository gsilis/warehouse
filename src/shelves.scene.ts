import { AmbientLight, PerspectiveCamera, Scene, type Group, type Object3DEventMap, type WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export class ShelvesScene {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private box: Group<Object3DEventMap>;
  private room: Group<Object3DEventMap>;
  private ambientLight: AmbientLight;
  private orbitControls: OrbitControls;

  constructor(
    renderer: WebGLRenderer,
    box: Group<Object3DEventMap>,
    room: Group<Object3DEventMap>,
  ) {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera();
    this.renderer = renderer;
    this.box = box;
    this.room = room;
    this.ambientLight = new AmbientLight(0xffffff, 20);
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

    this.setup();
  }

  private setup() {
    this.camera.position.z = -4;
    this.orbitControls.update();
    this.scene.add(this.ambientLight);
    this.scene.add(this.room);
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }
}
import { AmbientLight, PerspectiveCamera, Scene, type Group, type Object3DEventMap, type WebGLRenderer } from "three";

export class ShelvesScene {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private box: Group<Object3DEventMap>;
  private room: Group<Object3DEventMap>;
  private ambientLight: AmbientLight;
  private beforeRender: () => void;

  constructor(
    renderer: WebGLRenderer,
    camera: PerspectiveCamera,
    box: Group<Object3DEventMap>,
    room: Group<Object3DEventMap>,
    beforeRender: () => void = () => {},
  ) {
    this.scene = new Scene();
    this.camera = camera;
    this.renderer = renderer;
    this.box = box;
    this.room = room;
    this.beforeRender = beforeRender;
    this.ambientLight = new AmbientLight(0xffffff, 1);

    this.setup();
  }

  private setup() {
    this.camera.position.set(10.800573516263025, 15.235058507616007, 26.01630722640751);
    this.camera.rotateX(-0.3054604194122528);
    this.camera.rotateY(0.4141117780464906);
    this.camera.rotateZ(0.12620688296863003);
    this.scene.add(this.ambientLight);
    this.scene.add(this.room);
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  private render() {
    this.beforeRender();
    this.renderer.render(this.scene, this.camera);
  }
}
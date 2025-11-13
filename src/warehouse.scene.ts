import { AmbientLight, Color, Mesh, MeshStandardMaterial, PCFSoftShadowMap, PerspectiveCamera, PointLight, Scene, SpotLight, SpotLightHelper, Vector3, WebGLRenderer } from "three";
import { Loader } from "./loader";
import { OrbitControls, type GLTF } from "three/examples/jsm/Addons.js";
import { TestBoxManager } from "./test-box-manager";
import { BoxManager } from "./box-manager";
import { enableShadowsForGroup } from "./utilities/shadows";

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
  private spot1Helper: SpotLightHelper;
  private spot2Helper: SpotLightHelper;
  private _lightHelpersEnabled: boolean = false;
  private _sceneSetup = false;
  private _boxSetup = false;
  private _boxMesh?: Mesh;
  private _testBoxEnabled: boolean = false;
  private _testBox: TestBoxManager;
  private _boxManager: BoxManager;

  private _INITIAL_LOAD = false;

  constructor(rows: number, columns: number) {
    this.renderer = new WebGLRenderer({ antialias: true });
    this.sceneLoader = new Loader('/warehouse.glb');
    this.boxLoader = new Loader('/box.glb');
    this.camera = new PerspectiveCamera(75);
    this.camera.position.set(10.800573516263025, 15.235058507616007, 26.01630722640751);
    this.camera.rotateX(-0.3054604194122528);
    this.camera.rotateY(0.4141117780464906);
    this.camera.rotateZ(0.12620688296863003);
    this.scene = new Scene();
    this.ambient = new AmbientLight((new Color()).setHex(0xFFFFFF), 1);
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.spot1 = new SpotLight((new Color()).setHex(0xFFFFFF), 150, 0, 0.8, 0.9, 2);
    this.spot2 = new SpotLight((new Color()).setHex(0xFFFFFF), 150, 0, 0.8, 0.9, 2);

    this.spot1Helper = new SpotLightHelper(this.spot1, (new Color()).setHex(0xFFFF00));
    this.spot2Helper = new SpotLightHelper(this.spot2, (new Color()).setHex(0xFFFF00));

    this.spot1.shadow.mapSize.width = 2048;
    this.spot1.shadow.mapSize.height = 2048;
    this.spot2.shadow.mapSize.width = 2048;
    this.spot2.shadow.mapSize.height = 2048;
    this.spot1.shadow.bias = -0.0005;
    this.spot2.shadow.bias = -0.0005;

    this.scene.add(this.ambient);
    this._testBox = new TestBoxManager(this.scene);
    this._boxManager = new BoxManager(this.scene, rows, columns);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
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

  get lightHelpersEnabled() {
    return this._lightHelpersEnabled;
  }

  set lightHelpersEnabled(value: boolean) {
    const oldValue = this._lightHelpersEnabled;
    this._lightHelpersEnabled = value;

    if (oldValue === value) {
      // No change
      return;
    }

    if (value) {
      this.scene.add(this.spot1Helper);
      this.scene.add(this.spot2Helper);

      this.spot1Helper.update();
      this.spot1Helper.update();
    } else {
      this.scene.remove(this.spot1Helper);
      this.scene.remove(this.spot2Helper);
    }
  }

  get testBoxEnabled() {
    return this._testBoxEnabled;
  }

  set testBoxEnabled(value: boolean) {
    const old = this._testBoxEnabled;
    this._testBoxEnabled = value;

    if (old === value) {
      return;
    }

    if (value) {
      this._testBox.setup();
    } else {
      this._testBox.teardown();
    }
  }

  get shelfHelpersEnabled() {
    return this._boxManager.shelfHelpers;
  }

  set shelfHelpersEnabled(value: boolean) {
    this._boxManager.shelfHelpers = value;
  }

  updateBoxes(boxes: number[]) {
    // This is a dirty implementation, clean this up later on
    if (this._INITIAL_LOAD) {
      this._boxManager.updateBoxes(boxes);
    } else {
      setTimeout(() => {
        this._boxManager.updateBoxes(boxes);
        this._INITIAL_LOAD = true;
      }, 1000);
    }
  }

  private onSceneLoad(data: GLTF) {
    if (this._sceneSetup) {
      return;
    }

    this._sceneSetup = true;
    this.scene.add(data.scene);

    const spotlight1Placeholder = data.scene.getObjectByName('light-1-placeholder') as Mesh;
    const spotlight2Placeholder = data.scene.getObjectByName('light-2-placeholder') as Mesh;

    const settings: [SpotLight | PointLight, Mesh | undefined, Vector3 | undefined][] = [
      [this.spot1, spotlight1Placeholder, spotlight1Placeholder?.position],
      [this.spot2, spotlight2Placeholder, spotlight2Placeholder?.position],
    ];

    enableShadowsForGroup(data.scene);

    settings.forEach(([light, object, position]) => {
      if (!position) return;

      const material = object?.material as MeshStandardMaterial;
      if (material) {
        material.emissive = (new Color()).setHex(0xFFFFFF);
        material.emissiveIntensity = 10;
      }

      light.position.set(position.x, position.y - 0.4, position.z);
      if ('target' in light) {
        light.castShadow = true;
        light.shadow.mapSize.setX(2048);
        light.shadow.mapSize.setY(2048);
        light.target.position.set(position.x, 0, position.z);
        light.target.updateMatrixWorld();
      }
      this.scene.add(light);
    });

    this.spot1Helper.update();
    this.spot2Helper.update();
  }

  private onBoxLoad(data: GLTF) {
    if (this._boxSetup) {
      return;
    }

    this._boxSetup = true;
    this._boxMesh = data.scene.getObjectByName('moving-box') as Mesh;

    if (!this._boxMesh) {
      console.error(`Could not locate 'moving-box' object within box assets.`);
      return;
    }

    this._boxMesh.receiveShadow = true;
    this._boxMesh.castShadow = true;
    this._testBox.box = this._boxMesh;
    this._boxManager.asset = this._boxMesh;
  }
}
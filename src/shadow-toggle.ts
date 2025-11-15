import { PCFShadowMap, PCFSoftShadowMap, type Camera, type Light, type Object3D, type Object3DEventMap, type WebGLRenderer } from "three";

export class ShadowToggle {
  private renderer: WebGLRenderer;
  private state: boolean;
  private cameras: Camera[] = [];
  private objects: Object3D<Object3DEventMap>[] = [];
  private lights: Light[] = [];

  constructor(renderer: WebGLRenderer, state = false) {
    this.renderer = renderer;
    this.state = state;
    this.applyRenderer();
  }

  toggle(value: boolean) {
    this.state = value;
    this.objects.forEach(o => this.applySHadowToObject(o));
    this.cameras.forEach(c => this.applyShadowToCamera(c));
    this.lights.forEach(l => this.applyShadowToLight(l));
    this.applyRenderer();
  }

  addCamera(...cameras: Camera[]) {
    cameras.forEach(c => this.applyShadowToCamera(c));
    this.cameras.push(...cameras);
  }

  addObject(...objects: Object3D<Object3DEventMap>[]) {
    objects.forEach(o => this.applySHadowToObject(o));
    this.objects.push(...objects);
  }

  addLight(...lights: Light[]) {
    lights.forEach(l => this.applyShadowToLight(l));
    this.lights.push(...lights);
  }

  private applySHadowToObject(object: Object3D<Object3DEventMap>) {
    object.receiveShadow = this.state;
    object.castShadow = this.state;
  }

  private applyShadowToLight(light: Light) {
    light.castShadow = this.state;

    if (this.state && light.shadow) {
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;
      light.shadow.bias = -0.0005;
    } else if (light.shadow) {
      light.shadow.mapSize.width = 0;
      light.shadow.mapSize.height = 0;
      light.shadow.bias = 0;
    }
  }

  private applyShadowToCamera(_camera: Camera) {}

  private applyRenderer() {
    this.renderer.shadowMap.enabled = this.state;
    
    if (this.state) {
      this.renderer.shadowMap.type = PCFSoftShadowMap;
    } else {
      this.renderer.shadowMap.type = PCFShadowMap;
    }
  }
}
import { BehaviorSubject, filter } from "rxjs";
import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";

export class Loader {
  private path: string;
  private subject: BehaviorSubject<GLTF | null>;
  private triggered: boolean = false;
  private gltfLoader: GLTFLoader;

  constructor(path: string) {
    this.path = path;
    this.subject = new BehaviorSubject<GLTF | null>(null);
    this.gltfLoader = new GLTFLoader();
  }

  load() {
    if (!this.triggered) {
      this.startLoading();
    }

    return this.subject.pipe(filter(d => d !== null));
  }

  private startLoading() {
    this.triggered = true;
    this.gltfLoader.load(this.path,
      (data: GLTF) => {
        this.subject.next(data);
      },
      (event: ProgressEvent) => {
        console.log(`Loading... ${this.path}`, Math.round(event.loaded / event.total) * 100);
      },
      (err) => {
        console.error(`Error: ${this.path}`, err);
      }
    );
  }
}
import { BehaviorSubject, filter } from "rxjs";
import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";

export class Loader {
  private path: string;
  private subject: BehaviorSubject<[GLTF | null, number]>;
  private triggered: boolean = false;
  private gltfLoader: GLTFLoader;

  constructor(path: string) {
    this.path = path;
    this.subject = new BehaviorSubject<[GLTF | null, number]>([null, 0]);
    this.gltfLoader = new GLTFLoader();
  }

  load() {
    if (!this.triggered) {
      this.startLoading();
    }

    return this.subject;
  }

  private startLoading() {
    this.triggered = true;
    this.gltfLoader.load(this.path,
      (data: GLTF) => {
        this.subject.next([data, 100]);
        this.subject.complete();
      },
      (event: ProgressEvent) => {
        const percentage = Math.round(event.loaded / event.total) * 100;

        this.subject.next([null, percentage]);
        this.subject.complete();
      },
      (err) => {
        console.error(`Error: ${this.path}`, err);
        this.subject.complete();
      }
    );
  }
}
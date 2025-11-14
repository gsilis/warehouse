import { Observable, type Observer, type Subscriber, type Subscription } from "rxjs";
import { type GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";

export type AssetLoaderData = { asset: GLTF | null, bytesLoaded: number, bytesTotal: number };
export type AssetLoaderObserver = Observer<AssetLoaderData>;

export const READY = 'AssetLoaderReady';
export const LOADING = 'AssetLoaderLoading';
export const ERROR = 'AssetLoaderError';
export const COMPLETE = 'AssetLoaderComplete';

export type AssetLoaderState = (typeof READY | typeof LOADING | typeof ERROR | typeof COMPLETE);

export class AssetLoader {
  private path: string;
  private observable: Observable<AssetLoaderData>;
  private asset: GLTF | null = null;
  private total: number = 0;
  private loaded: number = 0;
  private subscribers: AssetLoaderObserver[] = [];
  private state: AssetLoaderState = READY;
  private gltfLoader: GLTFLoader;
  private error = '';

  constructor(path: string) {
    this.path = path;
    this.observable = new Observable(this.processSub.bind(this));
    this.gltfLoader = new GLTFLoader();
  }

  get ready(): boolean {
    return this.state === READY;
  }

  subscribe(subscriber: AssetLoaderObserver): Subscription {
    this.subscribers.push(subscriber);
    return this.observable.subscribe(subscriber);
  }

  load() {
    if (this.state !== READY) {
      // Already loading, completed, or errored
      // Nothing to kick off
      return;
    }

    this.state = LOADING;
    this.gltfLoader.load(
      this.path,
      this.onLoad.bind(this),
      this.onProgress.bind(this),
      this.onError.bind(this)
    );
  }

  private processSub(sub: AssetLoaderObserver) {
    switch (this.state) {
      case LOADING:
        this.notifyProgress(sub);
        break;
      
      case COMPLETE:
        this.notifyData(sub, true);
        break;

      case ERROR:
        sub.error(this.error);
        sub.complete();
        break;
    }
  }

  private onLoad(data: GLTF) {
    this.state = COMPLETE;
    this.asset = data;

    this.subscribers.forEach(sub => this.notifyData(sub, true));
  }

  private onProgress(event: ProgressEvent) {
    this.total = event.total;
    this.loaded = event.loaded;

    this.subscribers.forEach(sub => this.notifyProgress(sub));
  }

  private onError(err: unknown) {
    this.state = ERROR;
    this.error = err as string;

    this.subscribers.forEach(sub => sub.error(err));
  }

  private notifyProgress(sub: AssetLoaderObserver) {
    const asset = { asset: this.asset, bytesLoaded: this.loaded, bytesTotal: this.total };
    sub.next(asset);
  }

  private notifyData(sub: AssetLoaderObserver, complete: boolean = false) {
    if (!this.asset) {
      console.error('AssetLoader.notifyData; Cannot broadcast asset, it is null. This should be impossible.');
      return;
    }

    const asset = { asset: this.asset, bytesLoaded: this.loaded, bytesTotal: this.total };
    sub.next(asset);
    if (complete) sub.complete();
  }
}
import type { Observer, Subscription } from "rxjs";
import type { AssetLoader, AssetLoaderData, AssetLoaderObserver } from "./asset-loader";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { all, sum } from "./utilities/array";

const READY = 'LoadReady';
const COMPLETE = 'LoadComplete';
type AssetsLoaderState = (typeof COMPLETE | typeof READY);
export type ObservableObject = {
  bytesLoaded: number,
  bytesTotal: number,
  assets: Record<string, GLTF | null>
};
type AssetsLoaderObserver = Observer<ObservableObject>;

export class AssetsLoader {
  loaders: Record<string, AssetLoader> = {};
  loaderSubs: Record<string, Subscription> = {};
  subs: AssetsLoaderObserver[] = [];
  totals: Record<string, number> = {};
  loaded: Record<string, number> = {};
  complete: Record<string, AssetsLoaderState> = {};
  _assets: Record<string, GLTF | null> = {};

  add(name: string, loader: AssetLoader) {
    this.loaders[name] = loader;
    this.loaderSubs[name] = loader.subscribe(this.callbacksFor(name));
    this.totals[name] = 0;
    this.loaded[name] = 0;
    this._assets[name] = null;
    this.complete[name] = READY;
  }

  subscribe(observer: AssetsLoaderObserver) {
    this.subs.push(observer);

    const readyStates = Object.values(this.loaders).map(l => l.ready);

    if (all(readyStates, true)) {
      this.load();
    } else {
      this.doNext([observer]);
      this.attemptComplete();
    }
  }

  get assets(): Record<string, GLTF | null> {
    return { ...this._assets };
  }

  private load() {
    Object.values(this.loaders).forEach(loader => loader.load());
  }

  private callbacksFor(name: string): AssetLoaderObserver {
    return {
      next: (data: AssetLoaderData) => {
        this.totals[name] = data.bytesTotal;
        this.loaded[name] = data.bytesLoaded;
        this._assets[name] = data.asset;

        this.doNext(this.subs);
      },
      complete: () => {
        this.complete[name] = COMPLETE;
        this.attemptComplete();
      },
      error: () => {
        this.complete[name] = COMPLETE;
        this.attemptComplete();
      },
    };
  }

  private doNext(subs: AssetsLoaderObserver[]) {
    const totals = sum(Object.values(this.totals));
    const loaded = sum(Object.values(this.loaded));
    const snapshot = { ...this._assets };

    subs.forEach(sub => sub.next({ bytesTotal: totals, bytesLoaded: loaded, assets: snapshot }));
  }

  private attemptComplete() {
    const states = Object.values(this.complete);

    if (all(states, COMPLETE)) {
      this.subs.forEach(s => s.complete());
    }
  }
}
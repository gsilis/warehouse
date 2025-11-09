import { WebGLRenderer } from "three";

export class WarehouseScene {
  private renderer: WebGLRenderer;

  constructor() {
    this.renderer = new WebGLRenderer({ antialias: true });
  }

  setDimensions(width: number, height: number) {
    console.log('Updating dims', width, height);
  }
}
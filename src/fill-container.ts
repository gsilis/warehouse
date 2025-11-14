export class FillContainer {
  private dom?: HTMLElement;
  private canvas: HTMLCanvasElement;
  private resizeObserver: ResizeObserver;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          this.onResize(entry.contentRect);
        }
      }
    });
  }

  watch(dom: HTMLElement) {
    if (this.dom) {
      this.resizeObserver.unobserve(this.dom);
    }

    this.dom = dom;
    this.resizeObserver.observe(this.dom);
  }

  onResize(size: DOMRectReadOnly) {
    this.canvas.width = size.width;
    this.canvas.height = size.height;
  }

  teardown() {
    if (this.dom) this.resizeObserver.unobserve(this.dom);
    this.resizeObserver.disconnect();
  }
}
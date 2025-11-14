type ListenerArg = { width: number, height: number };
type HandlerFn = (dims: ListenerArg) => void;

export class FillContainer {
  private dom?: HTMLElement;
  private handler: HandlerFn;
  private resizeObserver: ResizeObserver;

  constructor(handler: (dims: ListenerArg) => void) {
    this.handler = handler;
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

  onResize(size: ListenerArg) {
    this.handler.call(undefined, size);
  }

  teardown() {
    if (this.dom) this.resizeObserver.unobserve(this.dom);
    this.resizeObserver.disconnect();
  }
}
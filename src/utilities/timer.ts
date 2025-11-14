export class Timer {
  private title: string;
  private startAt?: number;
  private endAt?: number;

  constructor(title: string) {
    this.title = title;
  }

  start() {
    this.startAt = Date.now();
  }

  stop() {
    this.endAt = Date.now();
  }

  report() {
    let str = '';

    if (this.startAt && this.endAt) {
      str = `DONE - ${this.endAt - this.startAt}ms`;
    } else if (this.startAt) {
      str = `RUNNING - ${Date.now() - this.startAt}`;
    } else {
      str = `NOT STARTED`;
    }
    console.log(`[${this.title}] - ${str}`);
  }
}
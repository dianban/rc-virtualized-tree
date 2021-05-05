// 节流
export class Throttled {
  private lastTime: number = 0;
  private interval: number;
  private timeoutId: number | null = null;

  public constructor(interval: number) {
    this.interval = interval;
  }

  public queue(func: Function) {
    const now = new Date().getTime();
    if (now - this.lastTime > this.interval) {
      this.clear();
      this.lastTime = now;
      func();
    } else {
      this.timeoutId = window.setTimeout(func, this.interval);
    }
  }

  public clear() {
    if (this.timeoutId != null) {
      window.clearTimeout(this.timeoutId);
    }
  }
}

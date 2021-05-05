// 防抖
export class Debounce {
  private delay: number;
  private timeoutId: number | null = null;

  public constructor(delay: number) {
    this.delay = delay;
  }

  public queue(func: Function) {
    this.clear();
    this.timeoutId = window.setTimeout(func, this.delay);
  }

  public clear() {
    if (this.timeoutId != null) {
      window.clearTimeout(this.timeoutId);
    }
  }
}

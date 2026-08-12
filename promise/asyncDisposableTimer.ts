type TimerCallback = () => void | Promise<void>;

interface AsyncDisposableTimerOptions {
  /** If true, uses setTimeout + reschedule instead of setInterval (avoids overlap by design). Default: false (setInterval). */
  mode?: "interval" | "timeout";
  /** Run the callback immediately once before starting the timer. Default: false. */
  immediate?: boolean;
}

/**
 * A generic timer that implements `AsyncDisposable`, so it can be used with
 * `await using` for automatic, safe cleanup (including awaiting any in-flight
 * async callback before the timer is considered disposed).
 */
export class AsyncDisposableTimer implements AsyncDisposable {
  private handle: ReturnType<typeof setInterval> | undefined;
  private pending: Promise<void> = Promise.resolve();
  private disposed = false;
  private readonly mode: "interval" | "timeout";

  constructor(
    private readonly callback: TimerCallback,
    private readonly intervalMs: number,
    options: AsyncDisposableTimerOptions = {},
  ) {
    this.mode = options.mode ?? "interval";

    if (options.immediate) {
      this.run();
    }

    if (this.mode === "interval") {
      this.handle = setInterval(() => this.run(), this.intervalMs);
    } else {
      this.scheduleNext();
    }
  }

  private scheduleNext(): void {
    if (this.disposed) return;
    this.handle = setTimeout(() => {
      this.run();
      this.scheduleNext();
    }, this.intervalMs);
  }

  /** Chains the callback onto the pending promise to guarantee non-overlapping execution. */
  private run(): void {
    this.pending = this.pending
      .then(() => this.callback())
      .catch(error => {
        // Swallow to avoid unhandled rejection; consumers can wrap callback for custom handling.
        console.error("AsyncDisposableTimer callback error:", error);
      });
  }

  /** Manually trigger the callback outside of the regular schedule (still queued/non-overlapping). */
  trigger(): void {
    this.run();
  }

  /** Stops the timer and waits for any in-flight (or queued) callback execution to finish. */
  async dispose(): Promise<void> {
    if (this.disposed) return;
    this.disposed = true;

    if (this.handle !== undefined) {
      clearInterval(this.handle as ReturnType<typeof setInterval>);
      clearTimeout(this.handle as ReturnType<typeof setTimeout>);
      this.handle = undefined;
    }

    await this.pending;
  }

  async [Symbol.asyncDispose](): Promise<void> {
    await this.dispose();
  }
}

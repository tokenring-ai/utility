/**
 * Waits for an abort signal and resolves a promise with the result of the provided callback function.
 *
 * @param {AbortSignal} signal - The AbortSignal to listen for the abort event.
 * @param {(ev: Event) => Promise<T>} param2 - A callback function that handles the abort event and returns a promise.
 * @return {Promise<T>} A promise that resolves with the result of the callback function when the abort event is triggered.
 * @template T
 */
export default function waitForAbort<T extends any | void>(signal: AbortSignal, param2: (ev: Event) => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    signal.addEventListener('abort', (ev: Event) => {
      resolve(param2(ev));
    })
  })
}
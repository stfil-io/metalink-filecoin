/**
 * Allows to retry to call a function a certain amount of times on given interval.
 * It wil throw the error if the function fails each time.
 * @param fn - function to execute
 * @param qty - amount of times the function will be executed
 * @param interval - time to wait between calls
 * @returns a generic type T
 */
export declare const retry: <T>(fn: () => Promise<T>, qty: number, interval: number) => Promise<T>;

import { Request, RequestInit } from 'node-fetch';
import { NodeFetchRetrierLogger, NodeFetchRetrierResponseInit, NodeFetchRetrierRetryOn, RetrierOptions, WaitOptions } from './types';

//export const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
export function wait(delay: number, options?: WaitOptions): Promise<void> {
    const ms = !options ? delay : options.attempt === 0 ? 0 : options.exponential ? Math.pow(2, (options.attempt - 2)) * delay : delay
    return new Promise(resolve => setTimeout(resolve, ms))
}

export class RetrierDefaultSettings {
    title: string = "Fetch Retrier"
    maxAttempts: number = 1
    delay: number = 100
    exponential: boolean = true
    returnJson: boolean = true
    retryOn: NodeFetchRetrierRetryOn = function (response: NodeFetchRetrierResponseInit) { return response.status >= 500 }
    log: NodeFetchRetrierLogger = function () { }

    constructor(options: RetrierOptions = {}) {
        this.update(options)
    }

    update(options: RetrierOptions = {}) {
        this.validate(options);
        for (const key in options) {
            const value = options[key as keyof RetrierOptions];
            if (value !== undefined) {
                (this as any)[key] = value;
            }
        };
        return this;
    }

    validate(options: RetrierOptions) {
        if (options.maxAttempts !== undefined && options.maxAttempts <= 0) {
            throw new Error("maxAttempts must be greater than 0");
        }

        if (options.delay !== undefined && options.delay < 0) {
            throw new Error("delay must be a positive number");
        }

        if (options.exponential !== undefined && typeof options.exponential !== "boolean") {
            throw new Error("exponential must be a boolean");
        }

        if (options.returnJson !== undefined && typeof options.returnJson !== "boolean") {
            throw new Error("returnJson must be a boolean");
        }

        if (options.retryOn !== undefined && typeof options.retryOn !== "function") {
            throw new Error("retryOn must be a function");
        }

        if (options.log !== undefined && typeof options.log !== "function") {
            throw new Error("log must be a function");
        }
    }
}
import { httpStatusCodes } from "./statusCodes"
import { HeadersInit, RequestInit } from 'node-fetch';

export type HttpStatusCode = keyof typeof httpStatusCodes;
export type NodeFetchRetrierRetryOn = (response:NodeFetchRetrierResponseInit) => boolean
export type NodeFetchRetrierLogger = (response:NodeFetchRetrierResponseInit) => void
export type RetrierOptions = Partial<RetrierSettings>

export interface NodeFetchRetrierOptions extends RequestInit {
    retrierOptions?: RetrierOptions
}

/**
 * Configuration for the retry settings of a NodeFetch retrier.
 */
export interface RetrierSettings {
    /**
     * The title used for logging and debugging retry attempts.
     */
    title: string;

    /**
     * The maximum number of retry attempts allowed before giving up.
     */
    maxAttempts: number;

    /**
     * The delay in milliseconds between retry attempts.
     */
    delay: number;

    /**
     * Whether to use exponential backoff for the delay between retries.
     */
    exponential: boolean;

    /**
     * If `true`, the response body will be parsed as JSON if possible.
     */
    returnJson: boolean;

    /**
     * A function to determine whether a retry should be attempted based on the response.
     */
    retryOn: NodeFetchRetrierRetryOn;

    /**
     * A logging function to track retry attempts.
     */
    log: NodeFetchRetrierLogger;
}

export interface NodeFetchRetrierResponseInit {
    status: HttpStatusCode
    statusText: string
    body: any
    headers?: HeadersInit
    ok: boolean
    type?: ResponseType
    url: string
    redirected: boolean;
    input: any
    attempt: number
}

export interface WaitOptions {
    attempt:number
    exponential: boolean
}
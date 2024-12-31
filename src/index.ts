import { RetrierDefaultSettings, wait } from "./settings";
import { NodeFetchRetrierResponse } from "./response";
import { NodeFetchRetrierOptions, NodeFetchRetrierResponseInit, RetrierOptions } from "./types";
import fetch from 'node-fetch'

/**
 * Creates a retrier function for performing fetch requests with retry logic.
 * 
 * @param {RetrierOptions} [options={}] - Configuration options for the retrier. Includes:
 * @param {string} [options.title="Fetch Retrier"] - The title used for logging and debugging retry attempts.
 * @param {number} [options.maxAttempts=3] - The maximum number of retry attempts. Must be greater than 0.
 * @param {number} [options.delay=1000] - The delay in milliseconds between retries. Must be a positive number.
 * @param {boolean} [options.exponential=true] - Whether to use exponential backoff for retries.
 * @param {boolean} [options.returnJson=true] - If `true`, the response will be parsed and returned as JSON.
 *     - If the response is JSON, it will be parsed as such.
 *     - If the response is in another format (e.g., XML or plain text), an attempt will be made to parse it as JSON.
 *     - If parsing fails, the raw response will be included in a `raw` field within the data object.
 * @param {function(NodeFetchRetrierResponseInit): boolean} [options.retryOn] - A function to determine whether to retry based on the response.
 * @param {function({ title: string, attempt: number, error: any, result: any }): void} [options.log] - A logging function for tracking retry attempts.
 * 
 * @returns {Function} A retrier function that accepts a URL and options for the fetch request.
 */
export function createNodeFetchRetrier(options: RetrierOptions = {}) {
    const defaultSettings = new RetrierDefaultSettings(options)
    const retrier = async function (url: string, options: NodeFetchRetrierOptions = {}): Promise<NodeFetchRetrierResponseInit> {
        const { retrierOptions = {}, ...nodeFetchOptions } = options
        let settings = defaultSettings.update(retrierOptions)
        let nodeFetchResponse = new NodeFetchRetrierResponse(url, options.body)
        let attempt: number = 0
        do {
            attempt++
            await wait(settings.delay, { attempt, exponential: settings.exponential })
            try {
                const nodeFetchAttempt = await fetch(url, nodeFetchOptions)
                await nodeFetchResponse.create(nodeFetchAttempt, settings.returnJson)
            } catch (error) {
                await nodeFetchResponse.functionError(error)
            }
        } while (settings.retryOn(nodeFetchResponse.response) && attempt < settings.maxAttempts)

        return nodeFetchResponse.response
    }

    retrier.settings = defaultSettings
    return retrier
}

export const nodeFetchRetrier = createNodeFetchRetrier()
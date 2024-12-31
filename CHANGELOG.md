
# Changelog

## [1.0.0] - Initial Release

### Added
- `createNodeFetchRetrier`: A function to create retriers for fetch requests with retry logic.
- `settings` Property: Added a `settings` property to inspect and dynamically update retrier options.
- Support for retry logic configuration:
  - `maxAttempts`: Set the maximum number of retry attempts.
  - `delay`: Configure delays between retries.
  - `exponential`: Enable exponential backoff.
  - `returnJson`: Automatically parse responses as JSON.
  - `retryOn`: Custom logic for determining retry conditions.
  - `log`: Custom logging for retry attempts.
- Examples for various use cases, including retrying on network errors, custom retry logic, and logging.

---

**Note**: This is the first release of the `node-fetch-retrier` package.

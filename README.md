
# **Node Fetch Retrier Documentation**

## **Overview**
`node-fetch-retrier` is a utility for performing fetch requests with customizable retry logic. It allows developers to handle network errors and transient server issues gracefully by retrying requests based on specified conditions.

---

## **Installation**
Install the package using npm:

```bash
npm install node-fetch-retrier
```

---

## **Usage**

### **Basic Example**
```javascript
import { createNodeFetchRetrier } from 'node-fetch-retrier';

const retrier = createNodeFetchRetrier();

const response = await retrier('https://jsonplaceholder.typicode.com/posts/1', {
    retrierOptions: {
        maxAttempts: 3,
        delay: 1000,
        exponential: true,
    },
    nodeFetchOptions: {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    },
});

console.log(response);
```

---

## **API**

### **`createNodeFetchRetrier`**
Creates a retrier function for performing fetch requests with retry logic.

#### **Parameters**
- `options` (optional): An object containing configuration options for the retrier.

#### **Options**
| Property      | Type       | Default                | Description                                                                |
| ------------- | ---------- | ---------------------- | -------------------------------------------------------------------------- |
| `title`       | `string`   | `"Fetch Retrier"`      | Title used for logging and debugging retry attempts.                       |
| `maxAttempts` | `number`   | `3`                    | Maximum number of retry attempts before giving up. Must be greater than 0. |
| `delay`       | `number`   | `1000`                 | Delay in milliseconds between retries. Must be a positive number.          |
| `exponential` | `boolean`  | `true`                 | Whether to use exponential backoff for the delay between retries.          |
| `returnJson`  | `boolean`  | `true`                 | If `true`, attempts to parse the response body as JSON.                    |
| `retryOn`     | `function` | Retry on status >= 500 | A function that determines whether to retry based on the response.         |
| `log`         | `function` | No-op function         | Logging function to track retry attempts.                                  |

#### **`settings` Property**
Every retrier instance now has a `settings` property that exposes the current retrier options. This allows developers to inspect or modify the settings dynamically.

---

### **Retrier Function**
The retrier function returned by `createNodeFetchRetrier` performs fetch requests with retry logic.

#### **Signature**
```typescript
async function retrier(
    url: string,
    options: NodeFetchRetrierOptions
): Promise<NodeFetchRetrierResponseInit>
```

#### **Parameters**
- `url`: The URL to fetch.
- `options`: Configuration options for the fetch request.

---

### **`NodeFetchRetrierOptions`**
| Property           | Type     | Description                                                                 |
| ------------------ | -------- | --------------------------------------------------------------------------- |
| `retrierOptions`   | `object` | Contains retry-related settings like `maxAttempts`, `delay`, and `retryOn`. |
| `nodeFetchOptions` | `object` | Standard fetch options such as `headers`, `method`, and `body`.             |

---

### **Return Value**
A `Promise` that resolves to an object containing the following:
- **`response`**: The final response object after retries, if applicable.
- **`error`**: Details of any error encountered during retries.

---

## **Examples**

### **Retry on Network Errors**
```javascript
const retrier = createNodeFetchRetrier();

const response = await retrier('https://example.com', {
    retrierOptions: {
        maxAttempts: 5,
        delay: 2000,
    },
    nodeFetchOptions: {
        method: 'GET',
    },
});

console.log(response);
```

### **Custom Retry Logic**
```javascript
const retrier = createNodeFetchRetrier({
    retryOn: (response) => response.status === 500 || response.status === 503,
});

const response = await retrier('https://example.com/fail', {
    retrierOptions: {
        maxAttempts: 3,
        delay: 1000,
    },
});

console.log(response);
```

### **Accessing `settings` Property**
```javascript
const retrier = createNodeFetchRetrier({
    title: "Custom Fetch Retrier",
});

console.log(retrier.settings); // Inspect the retrier's settings

retrier.settings.maxAttempts = 10; // Dynamically update settings
```

---

## **Testing**

To test the package locally, use `npm link`:

```bash
cd /path/to/node-fetch-retrier
npm link
cd /path/to/test-project
npm link node-fetch-retrier
```

Run your test scripts in the test project.

---

## **Contributing**

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Run tests:
   ```bash
   npm test
   ```

---

## **License**
MIT License

## **Author**
codebyolan
golfbyolan
olan88
Fredrik Olander
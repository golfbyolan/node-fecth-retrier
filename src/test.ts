import { createNodeFetchRetrier } from "./index";

// Delay function to pause between tests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Running the tests
(async () => {
    console.log("Running tests for nodeFetchRetrier...");

    // **Test 1: Successful fetch**
    console.log("\nTest 1: Successful fetch");
    const retrier1 = createNodeFetchRetrier();
    const response1 = await retrier1("https://jsonplaceholder.typicode.com/posts/1", {
        retrierOptions: { maxAttempts: 3 },
    });
    console.log("Result:", response1);

    await delay(10000);

    // **Test 2: Retry on 404**
    console.log("\nTest 2: Retry on 404");
    const retrier2 = createNodeFetchRetrier();
    const response2 = await retrier2("https://jsonplaceholder.typicode.com/posts/9999999", {
        retrierOptions: { maxAttempts: 3 },
        method:"POST",
        body:JSON.stringify({lol:"lol"})
    });
    console.log("Result:", response2);

})();
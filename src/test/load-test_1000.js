import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "http://localhost:5000"; // Update with your API base URL

export let options = {
  stages: [
    { duration: "1m", target: 500 }, // Ramp-up to 500 users over 1 minute
    { duration: "2m", target: 1000 }, // Ramp-up to 1000 users over 2 minutes
    { duration: "3m", target: 1000 }, // Stay at 1000 users for 3 minutes
    { duration: "1m", target: 500 }, // Ramp-down to 500 users over 1 minute
    { duration: "30s", target: 0 }, // Ramp-down to 0 users
  ],
};

export default function () {
  // Set Cache Entry
  let setResponse = http.post(
    `${BASE_URL}/cache`,
    JSON.stringify({
      key: `myKey-${__VU}-${__ITER}`, // Make each key unique per Virtual User and iteration
      value: "myValue",
      tags: ["tag1", "tag2"],
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(setResponse, {
    "set cache status is 200": (r) => r.status === 200,
  });

  // Get Cache Entry
  let getResponse = http.get(`${BASE_URL}/cache/myKey-${__VU}-${__ITER}`);
  check(getResponse, {
    "get cache status is 200": (r) => r.status === 200,
  });

  // Revalidate Cache by Tags
  let revalidateResponse = http.post(
    `${BASE_URL}/cache/revalidate`,
    JSON.stringify({
      tags: ["tag1"],
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  check(revalidateResponse, {
    "revalidate cache status is 200": (r) => r.status === 200,
  });

  // Sleep for a bit before the next iteration
  sleep(1);
}

// to run
// k6 run load-test_1000.js

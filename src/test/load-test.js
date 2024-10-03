import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "http://localhost:5000"; // Update with your API base URL

export let options = {
  stages: [
    { duration: "30s", target: 50 }, // Ramp-up to 50 users over 30 seconds
    { duration: "1m", target: 50 }, // Stay at 50 users for 1 minute
    { duration: "30s", target: 0 }, // Ramp-down to 0 users
  ],
};

export default function () {
  // Set Cache Entry
  let setResponse = http.post(
    `${BASE_URL}/cache`,
    JSON.stringify({
      key: "myKey",
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
  let getResponse = http.get(`${BASE_URL}/cache/myKey`);
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

  // Sleep for a bit before next iteration
  sleep(1);
}

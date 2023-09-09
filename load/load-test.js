import http from "k6/http";
import { check } from "k6";

// NOTE - 10vus will absolutely destroy the python service
//        1vu seems to be alright for latency under 200ms
//
export let options = {
  stages: [
    { duration: "2m", target: 1 }, // ramp up to 2 VUs during the first minute
    { duration: "3m", target: 1 }, // stay at 2 VUs for 3 minutes
    { duration: "1m", target: 0 }, // ramp down to 0 VUs during the last minute
  ],
};

export default function () {
  let url = "http://localhost:8081/api/generate-embeddings";
  let payload = JSON.stringify({
    text: "Embed this text please!",
  });

  let params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let response = http.post(url, payload, params);

  check(response, {
    "Status was 200": (r) => r.status === 200,
    "Transaction time OK": (r) => r.timings.duration < 200, // adjust this based on expected performance
  });
}

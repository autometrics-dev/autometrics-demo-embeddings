import http from "k6/http";
import { check } from "k6";

export let options = {
  vus: 1, // Number of virtual users
  duration: "30s",
};

export default function () {
  let url = "http://localhost:5000/embeddings";
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

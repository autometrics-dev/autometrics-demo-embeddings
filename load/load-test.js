import http from "k6/http";
import { check, sleep } from "k6";

// NOTE - 10vus will absolutely destroy the python service
// 
//        1vu seems to be alright for latency that averages around 100ms,
//        provided there's a 10ms sleep in the default function.
//
export let options = {
  stages: [
    { duration: "2m", target: 1 }, // TODO - could ramp up to two VUs here and then stay at 2 VUs for the next stage
    { duration: "3m", target: 1 },
    { duration: "1m", target: 0 }, // ramp down to 0 VUs during the last minute
  ],
};

export default function () {

  checkNodeJsEmbeddingsApi();
  checkPythonIsHotDogApi();
  checkPythonIsHotDogApi();

  function checkNodeJsEmbeddingsApi() {
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

    function checkPythonIsHotDogApi() {
      let url = "http://localhost:8082/is-hotdog";
      let payload = JSON.stringify({
        text: "not hotdog",
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

      // Sleep for 10ms
      sleep(0.01)
    }
}

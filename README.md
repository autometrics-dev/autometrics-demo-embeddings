# Autometrics Demo App - Embeddings Service

## Quickstart

- `docker compose up --build` - Start all services 
- Check the UI is running at `http://localhost:8081`
- `am start :8082 :9464` - Start Prometheus and scrape the services 
- `k6 run load/load-test.js` - Generate load on the api 
- View some metrics - `http://localhost:6789`
- Make a coffee (let the load test run for 6 minutes)
- Check the alerts - `http://localhost:6789/explorer#/alerts`

If you don't want to install `am` or `k6` locally, you can run them via Docker as well.

To run `am` in a container:

```sh
docker run \
  --network host
  -e LISTEN_ADDRESS=0.0.0.0:6789 \
  -p 6789:6789 \
  autometrics/am start :8082 :9464
```

To run `k6` from a container:

```sh
docker run --rm -i grafana/k6 run --vus 10 --duration 30s - <load/load-test.js
```

### Dependencies

You need a few tools installed on your system to run this demo:

- Docker and Docker Compose
- `am` CLI tool (`brew install autometrics-dev/tap/am`)
- `k6` CLI tool (`brew install k6`)

If you don't want to install `am` or `k6`, you can also run them via Docker (see instructions above)

## Description

This is a setup for a demo service that generates embeddings from some input text.

The service has three components:

- A node.js web server that serves a simple HTML form, and accepts POST requests to `/generate-embeddings` with a `text` parameter in the body. It calls a python service (described below) to generate the embeddings, and returns a JSON response with the embeddings.

- A python service that accepts POST requests to the route `/embeddings` with a `text` parameter in the body. It returns a JSON response with BERT embeddings of the provided `text`.

- A postgres database that can store the embeddings (_not yet integrated_)

The python and node services are instrumented with the `autometrics` library, and the `am` CLI tool is used to start a prometheus server that collects metrics from the services.

Optionally, the `k6` CLI tool can be used to generate load on the services, which will make the `am` explorer UI far more fun to look at.

### Service Level Objectives and Alerts

The node.js api has two SLOs:

- The API should have a 99.9% success rate
- 99% of API requests should return in under 100ms

After running the load test, which takes around 6 minutes, there should be alerts in the `am` explorer UI (at `http://localhost:6789/explorer#/alerts`) for the latency SLO.
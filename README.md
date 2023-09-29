# Autometrics Demo App - Embeddings Service

## Quickstart

- Start all services - `docker compose up --build`
- Generate load on the api - `k6 run load/load-test.js`
- View some metrics - `http://localhost:6788`
- Make a coffee  - Let the load test run for at least 5 minutes
- Check the alerts - `http://localhost:6788/explorer#/alerts`

If you don't want to install `k6` locally, you can run it via Docker as well:

```sh
docker run --rm -i grafana/k6 run --vus 10 --duration 30s - <load/load-test.js
```

### Dependencies

You need a few tools installed on your system to run this demo:

- Docker and Docker Compose
- `k6` CLI tool (`brew install k6`)

## Description

This is a setup for a demo service that generates embeddings from some input text.

The service has three components:

- A node.js web server that serves a simple HTML form, and accepts POST requests to `/generate-embeddings` with a `text` parameter in the body. It calls a python service (described below) to generate the embeddings, and returns a JSON response with the embeddings.

- A python service that accepts POST requests to the route `/embeddings` with a `text` parameter in the body. It returns a JSON response with BERT embeddings of the provided `text`.

- A postgres database that can store the embeddings (_not yet integrated_)

The python and node services are instrumented with the `autometrics` library. Their metrics data can be visualized with the Autometrics Explorer UI, which is available at `http://localhost:6788`.

Optionally, the `k6` CLI tool can be used to generate load on the services, which will make the autometrics explorer UI far more fun to look at.

### Service Level Objectives and Alerts

The node.js api has two SLOs:

- The API should have a 99.9% success rate
- 99% of API requests should return in under 100ms

After running the load test, which takes around 6 minutes, there should be alerts in the `am` explorer UI (at `http://localhost:6789/explorer#/alerts`) for the latency SLO.


## Extras

The Docker Compose file also starts a few other services for monitoring. Most of these are started on nonstandard ports to avoid conflicts with other services you may have running on your system.

### Prometheus

Access Prometheus via http://localhost:9099.

### Autometrics Explorer

Access the Autometrics Explorer via http://localhost:6789/explorer.

### Grafana

Access Grafana via http://localhost:9011.

There you'll find a dashboard with some basic metrics about containers on your system (thanks to cAdvisor). Look for the `autometrics-demo-embeddings-embeddings-1` container.

### cAdvisor

Access cAdvistor via http://localhost:8088.

Container metrics are made available via cAdvisor. However, the configuration to get these metrics is specific to running on an M1/M2 macbook.



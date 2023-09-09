# [WIP] Autometrics Demo App

> **THIS IS A WORK IN PROGRESS!**

- Run all services `docker compose up --build`
- Check the UI is running at `http://localhost:8081`
- Start prometheus `am start :8082 :9464`
- Generate load `k6 run load/load-test.js`
- View metrics at `http://localhost:6789`

## Dependencies

- Docker
- `am` CLI tool (`brew install autometrics-dev/tap/am`)
- `k6` CLI tool (`brew install k6`)

## Description

This is a setup for a demo service that generates embeddings from some input text.

The service is composed of three components:

- A python service that accepts POST requests to `/embeddings` with a `text` parameter in the body, and returns a JSON response with the embeddings.

- A node.js web server that serves a simple HTML form, and accepts POST requests to `/generate-embeddings` with a `text` parameter in the body.

- A postgres database that can store the embeddings

The python and node services are instrumented with the `autometrics` library, and the `am` CLI tool is used to start a prometheus server that collects metrics from the services.

The `k6` CLI tool is used to generate load on the services.

### Service Level Objectives and Alerts

> **TODO**
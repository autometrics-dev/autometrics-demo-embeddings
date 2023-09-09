# [WIP] Autometrics Demo App

> **THIS IS A WORK IN PROGRESS!**

- Run all services `docker compose up --build`
- Check the UI is running at `http://localhost:8080`
- Start prometheus `am start :8082`
- Generate load `k6 run load/load-test.js`
- View metrics at `http://localhost:6789`

## Scenario

This is a setup for a demo service that generates embeddings from some input text.

The service is composed of two components:

- A node.js web server that serves a simple HTML form, and accepts POST requests to `/generate-embeddings` with a `text` parameter in the body.

- A python service that accepts POST requests to `/embeddings` with a `text` parameter in the body, and returns a JSON response with the embeddings.



## TODO

- Add postgres database to store embeddings
- Add K6 for load generation
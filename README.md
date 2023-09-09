# [WIP] Autometrics Demo App

> **THIS IS A WORK IN PROGRESS!**

Run with `docker compose up --build`.

## Scenario

This is a setup for a demo service that generates embeddings from some input text.

The service is composed of two components:

- A node.js web server that serves a simple HTML form, and accepts POST requests to `/generate-embeddings` with a `text` parameter in the body.

- A python service that accepts POST requests to `/embeddings` with a `text` parameter in the body, and returns a JSON response with the embeddings.


## TODO

- Add postgres database to store embeddings
- Add K6 for load generation
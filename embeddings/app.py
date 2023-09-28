from flask import Flask, request, jsonify, Response
from autometrics import autometrics
from autometrics.objectives import Objective, ObjectiveLatency, ObjectivePercentile
from prometheus_client import generate_latest
from hotdog import HOTDOG_EMBEDDING
from embeddings import create_embedding, compare_embeddings

app = Flask(__name__)

NLP_SLO = Objective(
    "nlp",
    latency=(ObjectiveLatency.Ms250, ObjectivePercentile.P99),
)


# Expose a `/metrics` endpoint for Prometheus to scrape
@app.route("/metrics", methods=["GET"])
def metrics():
    return Response(generate_latest())


@app.route("/embeddings", methods=["POST"])
@autometrics(objective=NLP_SLO)
async def embeddings():
    data = request.json
    text = data["text"]
    embeddings = await create_embedding(text)
    return jsonify(embeddings)


@app.route("/is-hotdog", methods=["POST"])
@autometrics(objective=NLP_SLO)
async def is_hotdog():
    data = request.json
    text = data["text"]
    is_hotdog = text == "hotdog"
    return jsonify({ "is_hotdog": is_hotdog })


# Takes a BERT embedding and compares it to the BERT embedding for "hotdog"
@app.route("/is-hotdogish", methods=["POST"])
@autometrics(objective=NLP_SLO)
async def is_hotdogish():
    data = request.json
    potential_hotdog_embedding = data["embedding"]
    distance = await compare_embeddings(HOTDOG_EMBEDDING, potential_hotdog_embedding)
    print("DISTANCE", distance)
    # NOTE - need to convert numpy bool to native python bool
    is_hotdogish = bool(distance > 0.92)
    return jsonify({ "is_hotdogish": is_hotdogish })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

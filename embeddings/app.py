from flask import Flask, request, jsonify, Response
from transformers import AutoTokenizer, AutoModel
from autometrics import autometrics, init, Objective, ObjectiveLatency, ObjectivePercentile
from prometheus_client import generate_latest

VERSION="0.0.1"

app = Flask(__name__)

init(version=VERSION)

NLP_SLO = Objective(
    "nlp",
    latency=(ObjectiveLatency.Ms200, ObjectivePercentile.P99),
)

# Set up the tokenizer and model for creating BERT embeddings
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModel.from_pretrained("bert-base-uncased")

# Expose a `/metrics` endpoint for Prometheus to scrape
@app.route("/metrics", methods=["GET"])
def metrics():
    return Response(generate_latest())


@app.route("/embeddings", methods=["POST"])
@autometrics(objective=NLP_SLO)
def embeddings():
    data = request.json
    text = data["text"]
    inputs = tokenizer(text, return_tensors="pt")
    outputs = model(**inputs)
    embeddings = outputs.last_hidden_state.mean(dim=1).tolist()[0]
    return jsonify(embeddings)

@app.route("/is-hotdog", methods=["GET"])
@autometrics(objective=NLP_SLO)
def is_hotdog():
    data = request.json
    text = data["text"]
    is_hotdog = text == "hotdog"
    return jsonify({ "is_hotdog": is_hotdog })

@app.route("/", methods=["GET"])
@autometrics(objective=NLP_SLO)
def home():
    text = "test123"
    inputs = tokenizer(text, return_tensors="pt")
    outputs = model(**inputs)
    embeddings = outputs.last_hidden_state.mean(dim=1).tolist()[0]
    return jsonify(embeddings)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
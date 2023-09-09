from flask import Flask, request, jsonify, Response
from transformers import AutoTokenizer, AutoModel
from autometrics import autometrics
from prometheus_client import generate_latest

app = Flask(__name__)

tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModel.from_pretrained("bert-base-uncased")

# Set up a metrics endpoint for Prometheus to scrape
# `generate_latest` returns the latest metrics data in the Prometheus text format
@app.route("/metrics", methods=["GET"])
def metrics():
    return Response(generate_latest())


@app.route("/embeddings", methods=["POST"])
@autometrics
def embeddings():
    data = request.json
    text = data["text"]
    inputs = tokenizer(text, return_tensors="pt")
    outputs = model(**inputs)
    embeddings = outputs.last_hidden_state.mean(dim=1).tolist()[0]
    return jsonify(embeddings)

@app.route("/", methods=["GET"])
def home():
    text = "test123"
    inputs = tokenizer(text, return_tensors="pt")
    outputs = model(**inputs)
    embeddings = outputs.last_hidden_state.mean(dim=1).tolist()[0]
    return jsonify(embeddings)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
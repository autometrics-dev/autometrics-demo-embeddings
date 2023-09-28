
from transformers import AutoTokenizer, AutoModel
from scipy.spatial.distance import cosine
from autometrics import autometrics
from prometheus_client import generate_latest
from hotdog import HOTDOG_EMBEDDING

@autometrics
async def compare_embeddings(embedding1, embedding2):
    similarity = 1 - cosine(embedding1, embedding2)
    return similarity

# Set up the tokenizer and model for creating BERT embeddings
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModel.from_pretrained("bert-base-uncased")

@autometrics
async def create_embedding(text):
    inputs = tokenizer(text, return_tensors="pt")
    outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).tolist()[0]

import express from "express";
import cors from "cors";
import path from "path";
import { autometrics } from "@autometrics/autometrics";
import { init } from "@autometrics/exporter-prometheus";
import { fileURLToPath } from "url";

import { setupDatabase, getEmbeddings, saveEmbeddings } from "./db.js";
import { API_SLO } from "./instrumentation.js";

// Polyfill __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;

// Initialize the Prometheus exporter, expose /metrics on port 9464
console.log("Initializing autometrics...");
init({ port: 9464 });

console.log("Setting up db...");
await setupDatabase();
console.log("Database initialized!");

const app = express();

// Enable CORS on all routes, don't do this in production
app.use(cors());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/embeddings", async (req, res) => {
  try {
    const result = await getEmbeddings();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.post("/api/embeddings", async (req, res) => {
  const { originalText, embeddings } = req.body;
  try {
    await saveEmbeddings({ originalText, embeddings });
    res.send("Embeddings saved successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

const generateEmbeddingsHandler = autometrics(
  { objective: API_SLO },
  async function generateEmbeddingsHandler(req, res) {
    const originalText = req.body.text;
    const data = await fetch("http://embeddings:5000/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: originalText,
      }),
    });
    const json = await data.json();
    try {
      await saveEmbeddings({ originalText, embeddings: json });
    } catch (error) {
      console.error("Error saving embeddings!", error);
    }
    res.json(json);
  }
);

app.post("/api/generate-embeddings", generateEmbeddingsHandler);

// Serve the index.html file for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

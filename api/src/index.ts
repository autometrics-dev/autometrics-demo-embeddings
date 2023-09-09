import express from "express";
import cors from "cors";
import path from "path";
import { Pool } from "pg";

// import path from "path";
// import { fileURLToPath } from "url";

const PORT = 8080;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: "db",
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

export const main = async () => {
  try {
    // Create the pgvector extension
    await pool.query("CREATE EXTENSION IF NOT EXISTS vector;");

    // Create a table to contain vectors
    await pool.query(`
      CREATE TABLE IF NOT EXISTS embeddings_results (
        id SERIAL PRIMARY KEY,
        original_text TEXT NOT NULL,
        embeddings VECTOR(768) NOT NULL -- Assuming BERT-base embeddings, which are of length 768
      );
    `);

    console.log("Database setup completed.");
  } catch (error) {
    console.error("Error setting up the database:", error);
  }

  console.log("Starting api...");

  // HACK - import autometrics after the server starts due to module interoperability issues
  const { autometrics } = await import("@autometrics/autometrics");
  const { init } = await import("@autometrics/exporter-prometheus");

  // Initialize the Prometheus exporter, expose /metrics on port 9464
  init({
    port: 9464,
  });

  const app = express();

  // Enable CORS on all routes, don't do this in production
  app.use(cors());

  // Parse JSON bodies (as sent by API clients)
  app.use(express.json());

  // Serve static files from the "public" directory
  // const __filename = fileURLToPath(import.meta.url);
  // const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, "..", "public")));

  // TODO - save embeddings to database
  app.get("/users", async (req, res) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users");
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  });

  const generateEmbeddings = autometrics(async function generateEmbeddings(
    req,
    res
  ) {
    const data = await fetch("http://embeddings:5000/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: req.body.text,
      }),
    });
    const json = await data.json();
    res.json(json);
  });

  app.post("/api/generate-embeddings", generateEmbeddings);

  // Serve the index.html file for all other routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });
};

import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: "db",
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

export async function setupDatabase() {
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
}

export async function getEmbeddings() {
  const { rows } = await pool.query("SELECT * FROM embeddings_results");
  return rows;
}

export async function saveEmbeddings({
  originalText,
  embeddings,
}: {
  originalText: string;
  embeddings: number[];
}) {
  await pool.query(
    "INSERT INTO embeddings_results (original_text, embeddings) VALUES ($1, $2)",
    [originalText, embeddings]
  );
}

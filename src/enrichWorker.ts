import { Worker } from "bullmq";
import { pool } from "./db";
import ollama from "ollama"; // Local AI model

async function enrichData(id: number, title: string, details: string) {
  console.log(`Enriching contract ${id}...`);

  let enrichedText;
  try {
    const response = await ollama.generate({
      model: "deepseek",
      prompt: `Summarize: ${title} - ${details}`,
    });
    enrichedText = response.data.output;
  } catch (err) {
    console.error("Error using Ollama:", err);
    return;
  }

  await pool.query("UPDATE contracts SET enriched_data = $1 WHERE id = $2", [
    JSON.stringify({ summary: enrichedText }),
    id,
  ]);

  console.log(`Contract ${id} enriched successfully!`);
}

// AI Worker
const aiWorker = new Worker(
  "ai_enrichment",
  async (job) => {
    const { id, title, details } = job.data;
    await enrichData(id, title, details);
  },
  {
    connection: { host: "redis", port: 6379 },
  }
);

// Trigger AI Enrichment
async function processAIEnrichment() {
  const result = await pool.query(
    "SELECT * FROM contracts WHERE enriched_data IS NULL"
  );
  for (const row of result.rows) {
    await aiWorker.add("enrich", row);
  }
}

// Run enrichment every minute
setInterval(processAIEnrichment, 60000);

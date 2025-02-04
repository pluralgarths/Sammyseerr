import { Queue, Worker } from "bullmq";
import { pool } from "./db";
import ollama from "ollama";

const enrichmentQueue = new Queue("ai_enrichment", {
  connection: { host: "redis", port: 6379 },
});

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

  await pool.query(
    "UPDATE opportunities SET enriched_data = $1 WHERE id = $2",
    [JSON.stringify({ summary: enrichedText }), id]
  );

  console.log(`Contract ${id} enriched successfully!`);
}

// Worker to process AI enrichment jobs
new Worker(
  "ai_enrichment",
  async (job) => {
    const { id, title, details } = job.data;
    await enrichData(id, title, details);
  },
  {
    connection: { host: "redis", port: 6379 },
  }
);

// Function to add jobs to the queue
export async function queueEnrichment(id: number, title: string, details: string) {
  await enrichmentQueue.add("enrich", { id, title, details });
}

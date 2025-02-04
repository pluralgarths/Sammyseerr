"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueEnrichment = queueEnrichment;
const bullmq_1 = require("bullmq");
const db_1 = require("./db");
const ollama_1 = __importDefault(require("ollama"));
const enrichmentQueue = new bullmq_1.Queue("ai_enrichment", {
    connection: { host: "redis", port: 6379 },
});
async function enrichData(id, title, details) {
    console.log(`Enriching contract ${id}...`);
    let enrichedText;
    try {
        const response = await ollama_1.default.generate({
            model: "deepseek",
            prompt: `Summarize: ${title} - ${details}`,
        });
        enrichedText = response.data.output;
    }
    catch (err) {
        console.error("Error using Ollama:", err);
        return;
    }
    await db_1.pool.query("UPDATE opportunities SET enriched_data = $1 WHERE id = $2", [JSON.stringify({ summary: enrichedText }), id]);
    console.log(`Contract ${id} enriched successfully!`);
}
// Worker to process AI enrichment jobs
new bullmq_1.Worker("ai_enrichment", async (job) => {
    const { id, title, details } = job.data;
    await enrichData(id, title, details);
}, {
    connection: { host: "redis", port: 6379 },
});
// Function to add jobs to the queue
async function queueEnrichment(id, title, details) {
    await enrichmentQueue.add("enrich", { id, title, details });
}
//# sourceMappingURL=enrichWorker.js.map
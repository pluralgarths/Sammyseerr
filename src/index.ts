import express from "express";
import { scraperQueue } from "./scraper"; // ✅ Ensure this exists

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Route to trigger scraper manually
app.post("/run-scraper", async (_req, res) => {
  await scraperQueue.add("scrape", {});
  res.json({ message: "Scraper job added to queue" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

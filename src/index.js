import express from "express";
import dotenv from "dotenv";
import authRoutes from "./auth";
import { scraperQueue } from "./scraper";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Authentication routes (login/signup)
app.use("/auth", authRoutes);

// Route to trigger the scraper
app.post("/run-scraper", async (req, res) => {
  await scraperQueue.add("scrape", {});
  res.json({ message: "Scraper job added to queue" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

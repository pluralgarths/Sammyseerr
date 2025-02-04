"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scraper_1 = require("./scraper"); // ✅ Ensure this exists
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
// Route to trigger scraper manually
app.post("/run-scraper", async (_req, res) => {
    await scraper_1.scraperQueue.add("scrape", {});
    res.json({ message: "Scraper job added to queue" });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scraperQueue = void 0;
const bullmq_1 = require("bullmq");
exports.scraperQueue = new bullmq_1.Queue("scraper", {
    connection: {
        host: "redis",
        port: 6379
    }
});
console.log(" Scraper queue initialized.");
//# sourceMappingURL=scraper.js.map
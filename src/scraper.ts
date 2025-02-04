import { Queue } from "bullmq";

export const scraperQueue = new Queue("scraper", {
  connection: {
    host: "redis",
    port: 6379
  }
});

console.log(" Scraper queue initialized.");

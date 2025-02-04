const { Worker } = require("bullmq");
const { exec } = require("child_process");

new Worker(
  "scraper",
  async () => {
    console.log("Running scraper...");
    exec("docker start -ai sam_scraper", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running scraper: ${error.message}`);
      }
      console.log(stdout);
    });
  },
  {
    connection: { host: "redis", port: 6379 },
  }
);

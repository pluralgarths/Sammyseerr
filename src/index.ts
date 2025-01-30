import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config(); // now process.env.MY_VAR is available

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript + Express!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

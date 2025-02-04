import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./db";

const router = express.Router();

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Register a user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [username, hashedPassword]
    );
    res.json({ message: "User created", userId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  if (
    !user.rows.length ||
    !(await bcrypt.compare(password, user.rows[0].password))
  ) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.rows[0].id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

export default router;

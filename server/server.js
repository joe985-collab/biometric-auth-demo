import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = new pg.Pool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});

// Login example
app.post("/login", async (req, res) => {
  //   const { email, password } = req.body;

  const result = await db.query(
    "SELECT * FROM users;"
  );
  console.log("Here")
  if (result.rows.length === 0) {
    // return res.status(401).json({ message: "Invalid credentials" });
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Logged in!", user: result.rows[0] });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import bcrypt from "bcrypt";
dotenv.config();

const app = express();
const created_at = new Date();
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
app.post("/store", async (req, res) => {
  //   const { email, password } = req.body;
  console.log("response: ", req.body)
  console.log("Type:", typeof req.body.embedding);
  console.log(req.body.embedding.slice(0, 5));

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const result = await db.query(
    "INSERT INTO users (username, password_hash, face_embedding, created_at) VALUES ($1, $2, $3, $4);",
    [req.body.username, hashedPassword, JSON.stringify(req.body.embedding), created_at]
  );
  // console.log("Here")
  // if (result.rows.length === 0) {
  //   // return res.status(401).json({ message: "Invalid credentials" });
  //   return res.status(401).json({ message: "Invalid credentials" });
  // }

  res.json({ message: "Logged in!", user: result.rows[0] });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));

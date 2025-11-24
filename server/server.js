import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import bcrypt from "bcrypt";
import fs from "fs";
dotenv.config();

const app = express();
const created_at = new Date();
app.use(cors());
app.use(express.json());
const verificationKey = process.env.VITE_VERIFICATION_API_KEY



function normalize(vec) {
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0))
  return vec.map(v => v / norm);
}

function averageEmbeddings(embeddings) {
  const len = embeddings[0].length;
  const sum = new Array(len).fill(0);

  for (const emb of embeddings) {
    for (let i = 0; i < len; i++) {
      sum[i] += emb[i];
    }
  }

  const avg = sum.map(v => v / embeddings.length)
  return normalize(avg);
}
const db = new pg.Pool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});



app.post("/password_login",async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM users WHERE username = $1;",
      [req.body.username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Logged in!", result: user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// Login example
app.post("/retrieve_users", async (req, res) => {
  try {
    const result = await db.query(`SELECT 
       *
      FROM users
      WHERE 1 - (face_embedding <=> $1::vector) > 0.6;`,
      [JSON.stringify(req.body.embedding)]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const targetEmbedding = result.rows[0].face_embedding.match(/[\w.-]+/g).map(Number)

    const verificationResponse = await fetch("http://localhost:8000/api/v1/verification/embeddings/verify", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': verificationKey
      },
      body: JSON.stringify({
        "source": req.body.embedding,
        "targets": [targetEmbedding]
      })
    }).then(res => {
      return res.json()
    }).then(data => {
      if (data.result[0].similarity > 0.9) {
        res.json({ result: result.rows[0] });
      } else {
        res.status(401).json({ message: "Unauthorized user" });
      }

    }).catch(err => {
      return false
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
})

app.post("/store", async (req, res) => {
  //   const { email, password } = req.body;
  const avgEmbed = averageEmbeddings(req.body.embedding)
  // fs.writeFileSync('output.txt', JSON.stringify(avgEmbed, null, 2), 'utf8');
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const result = await db.query(
    "INSERT INTO users (username, password_hash, face_embedding, created_at) VALUES ($1, $2, $3, $4);",
    [req.body.username, hashedPassword, JSON.stringify(avgEmbed), created_at]
  );
  if (result.rows.length === 0) {
    // return res.status(401).json({ message: "Invalid credentials" });
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Logged in!", user: [] });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));

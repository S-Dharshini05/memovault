const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Health check (important for Render)
app.get("/", (req, res) => {
  res.send("MemoVault API Running 🚀");
});

// GET notes
app.get("/api/notes", (req, res) => {
  const sql = "SELECT * FROM notes ORDER BY pinned DESC, created_at DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("GET error:", err.message);
      return res.status(500).json({ error: "Failed to fetch notes" });
    }

    res.json(results);
  });
});

// CREATE note
app.post("/api/notes", (req, res) => {
  const { title, content, category } = req.body;

  const sql =
    "INSERT INTO notes (title, content, category) VALUES (?, ?, ?)";

  db.query(sql, [title, content, category], (err, result) => {
    if (err) {
      console.error("POST error:", err.message);
      return res.status(500).json({ error: "Failed to create note" });
    }

    res.json({ message: "Note created", id: result.insertId });
  });
});

// DELETE note
app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM notes WHERE id=?", [id], (err) => {
    if (err) {
      console.error("DELETE error:", err.message);
      return res.status(500).json({ error: "Failed to delete note" });
    }

    res.json({ message: "Deleted" });
  });
});

// PIN toggle
app.patch("/api/notes/:id/pin", (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE notes SET pinned = NOT pinned WHERE id=?",
    [id],
    (err) => {
      if (err) {
        console.error("PIN error:", err.message);
        return res.status(500).json({ error: "Failed to pin" });
      }

      res.json({ message: "Pinned updated" });
    }
  );
});

// IMPORTANT FIX FOR RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
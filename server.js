const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const dataFilePath = path.join(__dirname, "db", "db.json");
// ↑↑↑↑↑↑↑↑↑↑↑↑ Server Setup ↑↑↑↑↑↑↑↑↑↑↑↑

app.get("/", (req, res) => {
    const indexPath = path.join(__dirname, "public", "index.html");
    res.sendFile(indexPath);
  });
  
  app.get("/notes", (req, res) => {
    const notesPath = path.join(__dirname, "public", "notes.html");
    res.sendFile(notesPath);
  });
  // ↑↑↑↑↑↑↑↑↑↑↑↑ HTML Page Setup ↑↑↑↑↑↑↑↑↑↑↑↑
  
app.get("/api/notes", (req, res) => {
    fs.readFile(dataFilePath, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to read notes" });
      }
      const notes = JSON.parse(data);
      res.json(notes);
    });
  });
  // ↑↑↑↑↑↑↑↑↑↑↑↑ read note from the file ↑↑↑↑↑↑↑↑↑↑↑↑

  app.post("/api/notes", (req, res) => {
    const { title, text } = req.body;
    if (!title || !text) {
      return res.status(400).json({ error: "Title and text are required" });
    }
  
    fs.readFile(dataFilePath, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to read notes" });
      }
  
      const notes = JSON.parse(data);
      const newNote = { title, text, id: notes.length + 1 };
      notes.push(newNote);
  
      fs.writeFile(dataFilePath, JSON.stringify(notes), "utf8", (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to save note" });
        }
        res.json(newNote);
      });
    });
  });
 // ↑↑↑↑↑↑↑↑↑↑↑↑ add a new note ↑↑↑↑↑↑↑↑↑↑↑↑
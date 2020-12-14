const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3606;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    console.log(data);
    res.json(JSON.parse(data));
  });
});

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    console.log(data);
    const db = JSON.parse(data);
    db.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(db), (err) => {
      res.json(db);
    });
  });
});

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));

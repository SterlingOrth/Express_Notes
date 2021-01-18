const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

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
    if (err) throw err;
    console.log(data);
    const db = JSON.parse(data);
    newNote.id = uuidv4();
    db.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(db), (err) => {
      res.json(db);
    });
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const noteID = req.params.id;
  console.log(typeof noteID);
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    let newData = JSON.parse(data).filter((note) => {
      if (note.id === noteID) {
        return false;
      } else {
        return true;
      }
    });
    console.log(newData);
    fs.writeFile("./db/db.json", JSON.stringify(newData), (err) => {
      if (err) throw err;
      res.json(newData);
    });
  });
});
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
